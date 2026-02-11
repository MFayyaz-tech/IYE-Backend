import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Logger,
  ParseIntPipe,
} from "@nestjs/common";
import { OrderTransactionService } from "./transaction.service";
import {
  CreateOrderTransactionDto,
  UpdateOrderTransactionDto,
  OrderTransactionSingleResponseDto,
  OrderTransactionListResponseDto,
  GenericOrderTransactionResponseDto,
} from "./transaction.dto";

@Controller("transactions")
export class OrderTransactionController {
  private readonly logger = new Logger(OrderTransactionController.name);

  constructor(private readonly transactionService: OrderTransactionService) {}

  @Post()
  async create(
    @Body() body: CreateOrderTransactionDto,
  ): Promise<
    OrderTransactionSingleResponseDto | GenericOrderTransactionResponseDto
  > {
    try {
      this.logger.log("[create] Creating order transaction");
      const tx = await this.transactionService.create(body);
      const full = await this.transactionService.findById(tx.id);
      return {
        success: true,
        message: "Transaction created successfully",
        data: this.transactionService.mapToResponse(full!),
      };
    } catch (error) {
      this.logger.error(`[create] Error: ${error}`);
      return {
        success: false,
        message: "Failed to create transaction",
        error: error.message,
      };
    }
  }

  @Get()
  async findAll(
    @Query("order_id") orderId?: string,
    @Query("user_id") userId?: string,
    @Query("store_id") storeId?: string,
  ): Promise<OrderTransactionListResponseDto> {
    try {
      this.logger.log("[findAll] Fetching transactions");
      const list = await this.transactionService.findAll(
        orderId ? parseInt(orderId, 10) : undefined,
        userId ? parseInt(userId, 10) : undefined,
        storeId ? parseInt(storeId, 10) : undefined,
      );
      return {
        success: true,
        message: "Transactions fetched successfully",
        data: list.map((t) => this.transactionService.mapToResponse(t)),
      };
    } catch (error) {
      this.logger.error(`[findAll] Error: ${error}`);
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
  ): Promise<OrderTransactionSingleResponseDto> {
    try {
      this.logger.log(`[findById] Fetching transaction ${id}`);
      const tx = await this.transactionService.findById(id);

      if (!tx) {
        return {
          success: false,
          message: "Transaction not found",
          error: `Transaction with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "Transaction fetched successfully",
        data: this.transactionService.mapToResponse(tx),
      };
    } catch (error) {
      this.logger.error(`[findById] Error: ${error}`);
      return {
        success: false,
        message: "Failed to fetch transaction",
        error: error.message,
      };
    }
  }

  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateOrderTransactionDto,
  ): Promise<
    OrderTransactionSingleResponseDto | GenericOrderTransactionResponseDto
  > {
    try {
      this.logger.log(`[update] Updating transaction ${id}`);
      const tx = await this.transactionService.update(id, body);

      if (!tx) {
        return {
          success: false,
          message: "Transaction not found",
          error: `Transaction with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "Transaction updated successfully",
        data: this.transactionService.mapToResponse(tx),
      };
    } catch (error) {
      this.logger.error(`[update] Error: ${error}`);
      return {
        success: false,
        message: "Failed to update transaction",
        error: error.message,
      };
    }
  }

  @Delete(":id")
  async delete(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<GenericOrderTransactionResponseDto> {
    try {
      this.logger.log(`[delete] Deleting transaction ${id}`);
      const deleted = await this.transactionService.delete(id);

      if (!deleted) {
        return {
          success: false,
          message: "Transaction not found",
          error: `Transaction with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "Transaction deleted successfully",
      };
    } catch (error) {
      this.logger.error(`[delete] Error: ${error}`);
      return {
        success: false,
        message: "Failed to delete transaction",
        error: error.message,
      };
    }
  }
}
