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
import { OrderService } from "./order.service";
import {
  CreateOrderDto,
  UpdateOrderDto,
  OrderSingleResponseDto,
  OrderListResponseDto,
  GenericOrderResponseDto,
} from "./order.dto";

@Controller("orders")
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  /**
   * Create order with items
   */
  @Post()
  async create(
    @Body() body: CreateOrderDto,
  ): Promise<OrderSingleResponseDto | GenericOrderResponseDto> {
    try {
      this.logger.log("[create] Creating order");
      const order = await this.orderService.create(body);
      const fullOrder = await this.orderService.findById(order.id);
      return {
        success: true,
        message: "Order created successfully",
        data: this.orderService.mapToResponse(fullOrder!),
      };
    } catch (error) {
      this.logger.error(`[create] Error: ${error}`);
      return {
        success: false,
        message: "Failed to create order",
        error: error.message,
      };
    }
  }

  /**
   * Get all orders (optional filter by user_id or store_id)
   */
  @Get()
  async findAll(
    @Query("user_id") userId?: string,
    @Query("store_id") storeId?: string,
  ): Promise<OrderListResponseDto> {
    try {
      this.logger.log("[findAll] Fetching orders");
      let list;
      if (userId) {
        list = await this.orderService.findByUserId(parseInt(userId, 10));
      } else if (storeId) {
        list = await this.orderService.findByStoreId(parseInt(storeId, 10));
      } else {
        list = await this.orderService.findAll();
      }
      return {
        success: true,
        message: "Orders fetched successfully",
        data: list.map((o) => this.orderService.mapToResponse(o)),
      };
    } catch (error) {
      this.logger.error(`[findAll] Error: ${error}`);
      return {
        success: false,
        message: "Failed to fetch orders",
        error: error.message,
      };
    }
  }

  /**
   * Get order by ID
   */
  @Get(":id")
  async findById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<OrderSingleResponseDto> {
    try {
      this.logger.log(`[findById] Fetching order ${id}`);
      const order = await this.orderService.findById(id);

      if (!order) {
        return {
          success: false,
          message: "Order not found",
          error: `Order with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "Order fetched successfully",
        data: this.orderService.mapToResponse(order),
      };
    } catch (error) {
      this.logger.error(`[findById] Error: ${error}`);
      return {
        success: false,
        message: "Failed to fetch order",
        error: error.message,
      };
    }
  }

  /**
   * Update order (e.g. status, is_paid)
   */
  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateOrderDto,
  ): Promise<OrderSingleResponseDto | GenericOrderResponseDto> {
    try {
      this.logger.log(`[update] Updating order ${id}`);
      const order = await this.orderService.update(id, body);

      if (!order) {
        return {
          success: false,
          message: "Order not found",
          error: `Order with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "Order updated successfully",
        data: this.orderService.mapToResponse(order),
      };
    } catch (error) {
      this.logger.error(`[update] Error: ${error}`);
      return {
        success: false,
        message: "Failed to update order",
        error: error.message,
      };
    }
  }

  /**
   * Delete order
   */
  @Delete(":id")
  async delete(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<GenericOrderResponseDto> {
    try {
      this.logger.log(`[delete] Deleting order ${id}`);
      const deleted = await this.orderService.delete(id);

      if (!deleted) {
        return {
          success: false,
          message: "Order not found",
          error: `Order with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "Order deleted successfully",
      };
    } catch (error) {
      this.logger.error(`[delete] Error: ${error}`);
      return {
        success: false,
        message: "Failed to delete order",
        error: error.message,
      };
    }
  }
}
