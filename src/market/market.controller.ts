import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Logger,
  ParseIntPipe,
} from "@nestjs/common";
import { MarketService } from "./market.service";
import {
  CreateMarketDto,
  UpdateMarketDto,
  MarketSingleResponseDto,
  MarketListResponseDto,
  GenericMarketResponseDto,
} from "./market.dto";

@Controller("markets")
export class MarketController {
  private readonly logger = new Logger(MarketController.name);

  constructor(private readonly marketService: MarketService) {}

  /**
   * Create market
   */
  @Post()
  async create(
    @Body() body: CreateMarketDto,
  ): Promise<MarketSingleResponseDto | GenericMarketResponseDto> {
    try {
      this.logger.log("[create] Creating market");
      const market = await this.marketService.create(body);
      return {
        success: true,
        message: "Market created successfully",
        data: this.marketService.mapToResponse(market),
      };
    } catch (error) {
      this.logger.error(`[create] Error: ${error}`);
      return {
        success: false,
        message: "Failed to create market",
        error: error.message,
      };
    }
  }

  /**
   * Get all markets
   */
  @Get()
  async findAll(): Promise<MarketListResponseDto> {
    try {
      this.logger.log("[findAll] Fetching all markets");
      const list = await this.marketService.findAll();
      return {
        success: true,
        message: "Markets fetched successfully",
        data: list.map((m) => this.marketService.mapToResponse(m)),
      };
    } catch (error) {
      this.logger.error(`[findAll] Error: ${error}`);
      return {
        success: false,
        message: "Failed to fetch markets",
        error: error.message,
      };
    }
  }

  /**
   * Get market by ID
   */
  @Get(":id")
  async findById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<MarketSingleResponseDto> {
    try {
      this.logger.log(`[findById] Fetching market ${id}`);
      const market = await this.marketService.findById(id);

      if (!market) {
        return {
          success: false,
          message: "Market not found",
          error: `Market with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "Market fetched successfully",
        data: this.marketService.mapToResponse(market),
      };
    } catch (error) {
      this.logger.error(`[findById] Error: ${error}`);
      return {
        success: false,
        message: "Failed to fetch market",
        error: error.message,
      };
    }
  }

  /**
   * Update market
   */
  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateMarketDto,
  ): Promise<MarketSingleResponseDto | GenericMarketResponseDto> {
    try {
      this.logger.log(`[update] Updating market ${id}`);
      const market = await this.marketService.update(id, body);

      if (!market) {
        return {
          success: false,
          message: "Market not found",
          error: `Market with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "Market updated successfully",
        data: this.marketService.mapToResponse(market),
      };
    } catch (error) {
      this.logger.error(`[update] Error: ${error}`);
      return {
        success: false,
        message: "Failed to update market",
        error: error.message,
      };
    }
  }

  /**
   * Delete market
   */
  @Delete(":id")
  async delete(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<GenericMarketResponseDto> {
    try {
      this.logger.log(`[delete] Deleting market ${id}`);
      const deleted = await this.marketService.delete(id);

      if (!deleted) {
        return {
          success: false,
          message: "Market not found",
          error: `Market with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "Market deleted successfully",
      };
    } catch (error) {
      this.logger.error(`[delete] Error: ${error}`);
      return {
        success: false,
        message: "Failed to delete market",
        error: error.message,
      };
    }
  }
}
