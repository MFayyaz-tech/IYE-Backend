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
import { KycService } from "./kyc.service";
import {
  CreateKycDto,
  UpdateKycDto,
  KycSingleResponseDto,
  KycListResponseDto,
  GenericKycResponseDto,
} from "./kyc.dto";

@Controller("kyc")
export class KycController {
  private readonly logger = new Logger(KycController.name);

  constructor(private readonly kycService: KycService) {}

  /**
   * Create KYC record
   */
  @Post()
  async create(
    @Body() body: CreateKycDto,
  ): Promise<KycSingleResponseDto | GenericKycResponseDto> {
    try {
      this.logger.log("[create] Creating KYC record");
      const kyc = await this.kycService.create(body);
      return {
        success: true,
        message: "KYC created successfully",
        data: this.kycService.mapToResponse(kyc),
      };
    } catch (error) {
      this.logger.error(`[create] Error: ${error}`);
      return {
        success: false,
        message: "Failed to create KYC",
        error: error.message,
      };
    }
  }

  /**
   * Get all KYC records
   */
  @Get()
  async findAll(): Promise<KycListResponseDto> {
    try {
      this.logger.log("[findAll] Fetching all KYC records");
      const list = await this.kycService.findAll();
      return {
        success: true,
        message: "KYC records fetched successfully",
        data: list.map((k) => this.kycService.mapToResponse(k)),
      };
    } catch (error) {
      this.logger.error(`[findAll] Error: ${error}`);
      return {
        success: false,
        message: "Failed to fetch KYC records",
        error: error.message,
      };
    }
  }

  /**
   * Get KYC by ID
   */
  @Get(":id")
  async findById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<KycSingleResponseDto> {
    try {
      this.logger.log(`[findById] Fetching KYC ${id}`);
      const kyc = await this.kycService.findById(id);

      if (!kyc) {
        return {
          success: false,
          message: "KYC not found",
          error: `KYC with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "KYC fetched successfully",
        data: this.kycService.mapToResponse(kyc),
      };
    } catch (error) {
      this.logger.error(`[findById] Error: ${error}`);
      return {
        success: false,
        message: "Failed to fetch KYC",
        error: error.message,
      };
    }
  }

  /**
   * Update KYC record
   */
  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateKycDto,
  ): Promise<KycSingleResponseDto | GenericKycResponseDto> {
    try {
      this.logger.log(`[update] Updating KYC ${id}`);
      const kyc = await this.kycService.update(id, body);

      if (!kyc) {
        return {
          success: false,
          message: "KYC not found",
          error: `KYC with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "KYC updated successfully",
        data: this.kycService.mapToResponse(kyc),
      };
    } catch (error) {
      this.logger.error(`[update] Error: ${error}`);
      return {
        success: false,
        message: "Failed to update KYC",
        error: error.message,
      };
    }
  }

  /**
   * Delete KYC record
   */
  @Delete(":id")
  async delete(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<GenericKycResponseDto> {
    try {
      this.logger.log(`[delete] Deleting KYC ${id}`);
      const deleted = await this.kycService.delete(id);

      if (!deleted) {
        return {
          success: false,
          message: "KYC not found",
          error: `KYC with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "KYC deleted successfully",
      };
    } catch (error) {
      this.logger.error(`[delete] Error: ${error}`);
      return {
        success: false,
        message: "Failed to delete KYC",
        error: error.message,
      };
    }
  }
}
