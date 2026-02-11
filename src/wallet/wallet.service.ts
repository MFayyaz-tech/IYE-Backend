import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Wallet } from "./entities/wallet.entity";
import { WalletTransaction } from "./entities/wallet-transaction.entity";
import {
  CreateWalletDto,
  CreditDebitWalletDto,
  WalletResponseDto,
  WalletTransactionResponseDto,
} from "./wallet.dto";
import { WalletTransactionType } from "./entities/wallet-transaction.entity";

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(WalletTransaction)
    private readonly transactionRepository: Repository<WalletTransaction>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Create wallet for user (fails if user already has one)
   */
  async create(data: CreateWalletDto): Promise<Wallet> {
    const existing = await this.walletRepository.findOne({
      where: { user_id: data.user_id },
    });
    if (existing) {
      throw new BadRequestException("User already has a wallet");
    }
    const wallet = this.walletRepository.create({
      user_id: data.user_id,
      balance: 0,
    });
    return this.walletRepository.save(wallet);
  }

  /**
   * Get or create wallet for user
   */
  async getOrCreateByUserId(userId: number): Promise<Wallet> {
    let wallet = await this.walletRepository.findOne({
      where: { user_id: userId },
      relations: ["user"],
    });
    if (!wallet) {
      wallet = await this.create({ user_id: userId });
      wallet = (await this.walletRepository.findOne({
        where: { id: wallet.id },
        relations: ["user"],
      }))!;
    }
    return wallet;
  }

  /**
   * Find wallet by ID
   */
  async findById(id: number): Promise<Wallet | null> {
    return this.walletRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  /**
   * Find wallet by user ID
   */
  async findByUserId(userId: number): Promise<Wallet | null> {
    return this.walletRepository.findOne({
      where: { user_id: userId },
      relations: ["user"],
    });
  }

  /**
   * Credit or debit wallet (creates transaction record and updates balance)
   */
  async creditOrDebit(data: CreditDebitWalletDto): Promise<Wallet> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { id: data.wallet_id },
      });
      if (!wallet) {
        throw new BadRequestException("Wallet not found");
      }

      const currentBalance = Number(wallet.balance);
      const amount =
        data.type === WalletTransactionType.CREDIT ? data.amount : -data.amount;
      const newBalance = currentBalance + amount;

      if (
        data.type === WalletTransactionType.DEBIT &&
        currentBalance < data.amount
      ) {
        throw new BadRequestException("Insufficient wallet balance");
      }
      if (newBalance < 0) {
        throw new BadRequestException("Insufficient wallet balance");
      }

      const tx = queryRunner.manager.create(WalletTransaction, {
        wallet_id: data.wallet_id,
        amount:
          data.type === WalletTransactionType.CREDIT
            ? data.amount
            : -data.amount,
        type: data.type,
        reference_type: data.reference_type ?? null,
        reference_id: data.reference_id ?? null,
        description: data.description ?? null,
        balance_after: newBalance,
      });
      await queryRunner.manager.save(WalletTransaction, tx);

      await queryRunner.manager.update(Wallet, data.wallet_id, {
        balance: newBalance,
      });

      await queryRunner.commitTransaction();
      return this.findById(data.wallet_id) as Promise<Wallet>;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Credit wallet (add money)
   */
  async credit(
    walletId: number,
    amount: number,
    referenceType?: string,
    referenceId?: number,
    description?: string,
  ): Promise<Wallet> {
    return this.creditOrDebit({
      wallet_id: walletId,
      amount,
      type: WalletTransactionType.CREDIT,
      reference_type: referenceType,
      reference_id: referenceId,
      description,
    });
  }

  /**
   * Debit wallet (deduct money); throws if insufficient balance
   */
  async debit(
    walletId: number,
    amount: number,
    referenceType?: string,
    referenceId?: number,
    description?: string,
  ): Promise<Wallet> {
    return this.creditOrDebit({
      wallet_id: walletId,
      amount,
      type: WalletTransactionType.DEBIT,
      reference_type: referenceType,
      reference_id: referenceId,
      description,
    });
  }

  /**
   * Get transactions for a wallet
   */
  async getTransactions(walletId: number): Promise<WalletTransaction[]> {
    return this.transactionRepository.find({
      where: { wallet_id: walletId },
      order: { created_at: "DESC" },
    });
  }

  /**
   * Map wallet to response DTO
   */
  mapToResponse(wallet: Wallet): WalletResponseDto {
    return {
      id: wallet.id,
      user_id: wallet.user_id,
      balance: Number(wallet.balance),
      created_at: wallet.created_at,
      updated_at: wallet.updated_at,
    };
  }

  /**
   * Map wallet transaction to response DTO
   */
  mapTransactionToResponse(
    tx: WalletTransaction,
  ): WalletTransactionResponseDto {
    return {
      id: tx.id,
      wallet_id: tx.wallet_id,
      amount: Number(tx.amount),
      type: tx.type,
      reference_type: tx.reference_type,
      reference_id: tx.reference_id,
      description: tx.description,
      balance_after: tx.balance_after != null ? Number(tx.balance_after) : null,
      created_at: tx.created_at,
      updated_at: tx.updated_at,
    };
  }
}
