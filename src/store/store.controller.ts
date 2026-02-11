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
import { StoreService } from "./store.service";
import {
  CreateStoreDto,
  UpdateStoreDto,
  StoreSingleResponseDto,
  StoreListResponseDto,
  GenericStoreResponseDto,
} from "./store.dto";

@Controller("stores")
export class StoreController {
  private readonly logger = new Logger(StoreController.name);

  constructor(private readonly storeService: StoreService) {}

  /**
   * Create store (vendor creates store)
   */
  @Post()
  async create(
    @Body() body: CreateStoreDto,
  ): Promise<StoreSingleResponseDto | GenericStoreResponseDto> {
    try {
      this.logger.log("[create] Creating store");
      const store = await this.storeService.create(body);
      return {
        success: true,
        message: "Store created successfully",
        data: this.storeService.mapToResponse(store),
      };
    } catch (error) {
      this.logger.error(`[create] Error: ${error}`);
      return {
        success: false,
        message: "Failed to create store",
        error: error.message,
      };
    }
  }

  /**
   * Get all stores (optional filter by vendor_id or market_id)
   */
  @Get()
  async findAll(
    @Query("vendor_id") vendorId?: string,
    @Query("market_id") marketId?: string,
  ): Promise<StoreListResponseDto> {
    try {
      this.logger.log("[findAll] Fetching stores");
      let list;
      if (vendorId) {
        list = await this.storeService.findByVendorId(parseInt(vendorId, 10));
      } else if (marketId) {
        list = await this.storeService.findByMarketId(parseInt(marketId, 10));
      } else {
        list = await this.storeService.findAll();
      }
      return {
        success: true,
        message: "Stores fetched successfully",
        data: list.map((s) => this.storeService.mapToResponse(s)),
      };
    } catch (error) {
      this.logger.error(`[findAll] Error: ${error}`);
      return {
        success: false,
        message: "Failed to fetch stores",
        error: error.message,
      };
    }
  }

  /**
   * Get store by ID
   */
  @Get(":id")
  async findById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<StoreSingleResponseDto> {
    try {
      this.logger.log(`[findById] Fetching store ${id}`);
      const store = await this.storeService.findById(id);

      if (!store) {
        return {
          success: false,
          message: "Store not found",
          error: `Store with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "Store fetched successfully",
        data: this.storeService.mapToResponse(store),
      };
    } catch (error) {
      this.logger.error(`[findById] Error: ${error}`);
      return {
        success: false,
        message: "Failed to fetch store",
        error: error.message,
      };
    }
  }

  /**
   * Update store
   */
  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateStoreDto,
  ): Promise<StoreSingleResponseDto | GenericStoreResponseDto> {
    try {
      this.logger.log(`[update] Updating store ${id}`);
      const store = await this.storeService.update(id, body);

      if (!store) {
        return {
          success: false,
          message: "Store not found",
          error: `Store with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "Store updated successfully",
        data: this.storeService.mapToResponse(store),
      };
    } catch (error) {
      this.logger.error(`[update] Error: ${error}`);
      return {
        success: false,
        message: "Failed to update store",
        error: error.message,
      };
    }
  }

  /**
   * Delete store
   */
  @Delete(":id")
  async delete(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<GenericStoreResponseDto> {
    try {
      this.logger.log(`[delete] Deleting store ${id}`);
      const deleted = await this.storeService.delete(id);

      if (!deleted) {
        return {
          success: false,
          message: "Store not found",
          error: `Store with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "Store deleted successfully",
      };
    } catch (error) {
      this.logger.error(`[delete] Error: ${error}`);
      return {
        success: false,
        message: "Failed to delete store",
        error: error.message,
      };
    }
  }
}
