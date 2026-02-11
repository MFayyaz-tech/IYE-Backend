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
import { AddressService } from "./address.service";
import {
  CreateAddressDto,
  UpdateAddressDto,
  AddressSingleResponseDto,
  AddressListResponseDto,
  GenericAddressResponseDto,
} from "./address.dto";

@Controller("addresses")
export class AddressController {
  private readonly logger = new Logger(AddressController.name);

  constructor(private readonly addressService: AddressService) {}

  /**
   * Create user address
   */
  @Post()
  async create(
    @Body() body: CreateAddressDto,
  ): Promise<AddressSingleResponseDto | GenericAddressResponseDto> {
    try {
      this.logger.log("[create] Creating address");
      const address = await this.addressService.create(body);
      return {
        success: true,
        message: "Address created successfully",
        data: this.addressService.mapToResponse(address),
      };
    } catch (error) {
      this.logger.error(`[create] Error: ${error}`);
      return {
        success: false,
        message: "Failed to create address",
        error: error.message,
      };
    }
  }

  /**
   * Get all addresses (optional filter by user_id)
   */
  @Get()
  async findAll(
    @Query("user_id") userId?: string,
  ): Promise<AddressListResponseDto> {
    try {
      this.logger.log("[findAll] Fetching addresses");
      const list = userId
        ? await this.addressService.findByUserId(parseInt(userId, 10))
        : await this.addressService.findAll();
      return {
        success: true,
        message: "Addresses fetched successfully",
        data: list.map((a) => this.addressService.mapToResponse(a)),
      };
    } catch (error) {
      this.logger.error(`[findAll] Error: ${error}`);
      return {
        success: false,
        message: "Failed to fetch addresses",
        error: error.message,
      };
    }
  }

  /**
   * Get address by ID
   */
  @Get(":id")
  async findById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<AddressSingleResponseDto> {
    try {
      this.logger.log(`[findById] Fetching address ${id}`);
      const address = await this.addressService.findById(id);

      if (!address) {
        return {
          success: false,
          message: "Address not found",
          error: `Address with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "Address fetched successfully",
        data: this.addressService.mapToResponse(address),
      };
    } catch (error) {
      this.logger.error(`[findById] Error: ${error}`);
      return {
        success: false,
        message: "Failed to fetch address",
        error: error.message,
      };
    }
  }

  /**
   * Update address
   */
  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateAddressDto,
  ): Promise<AddressSingleResponseDto | GenericAddressResponseDto> {
    try {
      this.logger.log(`[update] Updating address ${id}`);
      const address = await this.addressService.update(id, body);

      if (!address) {
        return {
          success: false,
          message: "Address not found",
          error: `Address with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "Address updated successfully",
        data: this.addressService.mapToResponse(address),
      };
    } catch (error) {
      this.logger.error(`[update] Error: ${error}`);
      return {
        success: false,
        message: "Failed to update address",
        error: error.message,
      };
    }
  }

  /**
   * Delete address
   */
  @Delete(":id")
  async delete(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<GenericAddressResponseDto> {
    try {
      this.logger.log(`[delete] Deleting address ${id}`);
      const deleted = await this.addressService.delete(id);

      if (!deleted) {
        return {
          success: false,
          message: "Address not found",
          error: `Address with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "Address deleted successfully",
      };
    } catch (error) {
      this.logger.error(`[delete] Error: ${error}`);
      return {
        success: false,
        message: "Failed to delete address",
        error: error.message,
      };
    }
  }
}
