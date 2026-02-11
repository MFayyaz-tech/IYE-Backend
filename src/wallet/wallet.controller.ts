import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Logger,
  ParseIntPipe,
} from "@nestjs/common";
import { WalletService } from "./wallet.service";
import {
  CreateWalletDto,
  CreditDebitWalletDto,
  WalletSingleResponseDto,
  WalletTransactionListResponseDto,
  GenericWalletResponseDto,
} from "./wallet.dto";
import { WalletTransactionType } from "./entities/wallet-transaction.entity";

@Controller("wallets")
export class WalletController {
  private readonly logger = new Logger(WalletController.name);

  constructor(private readonly walletService: WalletService) {}

  @Post()
  async create(
    @Body() body: CreateWalletDto,
  ): Promise<WalletSingleResponseDto | GenericWalletResponseDto> {
    try {
      this.logger.log("[create] Creating wallet");
      const wallet = await this.walletService.create(body);
      return {
        success: true,
        message: "Wallet created successfully",
        data: this.walletService.mapToResponse(wallet),
      };
    } catch (error) {
      this.logger.error(`[create] Error: ${error}`);
      return {
        success: false,
        message: error.message || "Failed to create wallet",
        error: error.message,
      };
    }
  }

  @Get("by-user")
  async getByUserId(
    @Query("user_id", ParseIntPipe) userId: number,
  ): Promise<WalletSingleResponseDto> {
    try {
      this.logger.log(`[getByUserId] Fetching wallet for user ${userId}`);
      const wallet = await this.walletService.getOrCreateByUserId(userId);
      return {
        success: true,
        message: "Wallet fetched successfully",
        data: this.walletService.mapToResponse(wallet),
      };
    } catch (error) {
      this.logger.error(`[getByUserId] Error: ${error}`);
      return {
        success: false,
        message: "Failed to fetch wallet",
        error: error.message,
      };
    }
  }

  @Post("credit")
  async credit(
    @Body() body: CreditDebitWalletDto,
  ): Promise<WalletSingleResponseDto | GenericWalletResponseDto> {
    try {
      this.logger.log("[credit] Crediting wallet");
      const wallet = await this.walletService.creditOrDebit({
        ...body,
        type: WalletTransactionType.CREDIT,
      });
      return {
        success: true,
        message: "Wallet credited successfully",
        data: this.walletService.mapToResponse(wallet),
      };
    } catch (error) {
      this.logger.error(`[credit] Error: ${error}`);
      return {
        success: false,
        message: error.message || "Failed to credit wallet",
        error: error.message,
      };
    }
  }

  @Post("debit")
  async debit(
    @Body() body: CreditDebitWalletDto,
  ): Promise<WalletSingleResponseDto | GenericWalletResponseDto> {
    try {
      this.logger.log("[debit] Debiting wallet");
      const wallet = await this.walletService.creditOrDebit({
        ...body,
        type: WalletTransactionType.DEBIT,
      });
      return {
        success: true,
        message: "Wallet debited successfully",
        data: this.walletService.mapToResponse(wallet),
      };
    } catch (error) {
      this.logger.error(`[debit] Error: ${error}`);
      return {
        success: false,
        message: error.message || "Failed to debit wallet",
        error: error.message,
      };
    }
  }

  @Get(":id/transactions")
  async getTransactions(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<WalletTransactionListResponseDto> {
    try {
      this.logger.log(
        `[getTransactions] Fetching transactions for wallet ${id}`,
      );
      const wallet = await this.walletService.findById(id);
      if (!wallet) {
        return {
          success: false,
          message: "Wallet not found",
          error: `Wallet with ID ${id} does not exist`,
        };
      }
      const list = await this.walletService.getTransactions(id);
      return {
        success: true,
        message: "Transactions fetched successfully",
        data: list.map((t) => this.walletService.mapTransactionToResponse(t)),
      };
    } catch (error) {
      this.logger.error(`[getTransactions] Error: ${error}`);
      return {
        success: false,
        message: "Failed to fetch transactions",
        error: error.message,
      };
    }
  }

  @Get(":id")
  async findById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<WalletSingleResponseDto> {
    try {
      this.logger.log(`[findById] Fetching wallet ${id}`);
      const wallet = await this.walletService.findById(id);

      if (!wallet) {
        return {
          success: false,
          message: "Wallet not found",
          error: `Wallet with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "Wallet fetched successfully",
        data: this.walletService.mapToResponse(wallet),
      };
    } catch (error) {
      this.logger.error(`[findById] Error: ${error}`);
      return {
        success: false,
        message: "Failed to fetch wallet",
        error: error.message,
      };
    }
  }
}
