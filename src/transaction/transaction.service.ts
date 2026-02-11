import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrderTransaction } from "./entities/order-transaction.entity";
import {
  CreateOrderTransactionDto,
  UpdateOrderTransactionDto,
  OrderTransactionResponseDto,
} from "./transaction.dto";
import { TransactionStatus } from "./entities/order-transaction.entity";

@Injectable()
export class OrderTransactionService {
  private readonly logger = new Logger(OrderTransactionService.name);

  constructor(
    @InjectRepository(OrderTransaction)
    private readonly transactionRepository: Repository<OrderTransaction>,
  ) {}

  /**
   * Create order transaction
   */
  async create(data: CreateOrderTransactionDto): Promise<OrderTransaction> {
    const tx = this.transactionRepository.create({
      transaction_id: data.transaction_id,
      order_id: data.order_id,
      user_id: data.user_id,
      store_id: data.store_id,
      payment_method: data.payment_method,
      amount: data.amount,
      status: data.status ?? TransactionStatus.PENDING,
      notes: data.notes ?? null,
    });
    return this.transactionRepository.save(tx);
  }

  /**
   * Find transaction by ID
   */
  async findById(id: number): Promise<OrderTransaction | null> {
    return this.transactionRepository.findOne({
      where: { id },
      relations: ["order", "user", "store"],
    });
  }

  /**
   * Find by external transaction_id
   */
  async findByTransactionId(
    transactionId: string,
  ): Promise<OrderTransaction | null> {
    return this.transactionRepository.findOne({
      where: { transaction_id: transactionId },
      relations: ["order", "user", "store"],
    });
  }

  /**
   * Find all transactions (optional filters)
   */
  async findAll(
    orderId?: number,
    userId?: number,
    storeId?: number,
  ): Promise<OrderTransaction[]> {
    const qb = this.transactionRepository
      .createQueryBuilder("tx")
      .leftJoinAndSelect("tx.order", "order")
      .leftJoinAndSelect("tx.user", "user")
      .leftJoinAndSelect("tx.store", "store")
      .orderBy("tx.created_at", "DESC");

    if (orderId != null) {
      qb.andWhere("tx.order_id = :orderId", { orderId });
    }
    if (userId != null) {
      qb.andWhere("tx.user_id = :userId", { userId });
    }
    if (storeId != null) {
      qb.andWhere("tx.store_id = :storeId", { storeId });
    }
    return qb.getMany();
  }

  /**
   * Find transactions by order ID
   */
  async findByOrderId(orderId: number): Promise<OrderTransaction[]> {
    return this.transactionRepository.find({
      where: { order_id: orderId },
      order: { created_at: "DESC" },
      relations: ["order", "user", "store"],
    });
  }

  /**
   * Find transactions by user ID
   */
  async findByUserId(userId: number): Promise<OrderTransaction[]> {
    return this.transactionRepository.find({
      where: { user_id: userId },
      order: { created_at: "DESC" },
      relations: ["order", "user", "store"],
    });
  }

  /**
   * Find transactions by store ID
   */
  async findByStoreId(storeId: number): Promise<OrderTransaction[]> {
    return this.transactionRepository.find({
      where: { store_id: storeId },
      order: { created_at: "DESC" },
      relations: ["order", "user", "store"],
    });
  }

  /**
   * Update transaction
   */
  async update(
    id: number,
    data: UpdateOrderTransactionDto,
  ): Promise<OrderTransaction | null> {
    const tx = await this.transactionRepository.findOne({ where: { id } });
    if (!tx) return null;

    await this.transactionRepository.update(id, {
      ...(data.transaction_id !== undefined && {
        transaction_id: data.transaction_id,
      }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.notes !== undefined && { notes: data.notes }),
    });
    return this.findById(id);
  }

  /**
   * Delete transaction
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.transactionRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Map entity to response DTO
   */
  mapToResponse(tx: OrderTransaction): OrderTransactionResponseDto {
    return {
      id: tx.id,
      transaction_id: tx.transaction_id,
      order_id: tx.order_id,
      user_id: tx.user_id,
      store_id: tx.store_id,
      payment_method: tx.payment_method,
      amount: Number(tx.amount),
      status: tx.status,
      notes: tx.notes,
      created_at: tx.created_at,
      updated_at: tx.updated_at,
    };
  }
}
