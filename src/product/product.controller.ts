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
import { ProductService } from "./product.service";
import {
  CreateProductDto,
  UpdateProductDto,
  ProductSingleResponseDto,
  ProductListResponseDto,
  GenericProductResponseDto,
} from "./product.dto";

@Controller("products")
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(private readonly productService: ProductService) {}

  /**
   * Create product (Add Product)
   */
  @Post()
  async create(
    @Body() body: CreateProductDto,
  ): Promise<ProductSingleResponseDto | GenericProductResponseDto> {
    try {
      this.logger.log("[create] Creating product");
      const product = await this.productService.create(body);
      return {
        success: true,
        message: "Product created successfully",
        data: this.productService.mapToResponse(product),
      };
    } catch (error) {
      this.logger.error(`[create] Error: ${error}`);
      return {
        success: false,
        message: "Failed to create product",
        error: error.message,
      };
    }
  }

  /**
   * Get all products (optional query: store_id, category_id)
   */
  @Get()
  async findAll(
    @Query("store_id") storeId?: string,
    @Query("category_id") categoryId?: string,
  ): Promise<ProductListResponseDto> {
    try {
      this.logger.log("[findAll] Fetching products");
      const list = await this.productService.findAll(
        storeId ? parseInt(storeId, 10) : undefined,
        categoryId ? parseInt(categoryId, 10) : undefined,
      );
      return {
        success: true,
        message: "Products fetched successfully",
        data: list.map((p) => this.productService.mapToResponse(p)),
      };
    } catch (error) {
      this.logger.error(`[findAll] Error: ${error}`);
      return {
        success: false,
        message: "Failed to fetch products",
        error: error.message,
      };
    }
  }

  /**
   * Get product by ID
   */
  @Get(":id")
  async findById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<ProductSingleResponseDto> {
    try {
      this.logger.log(`[findById] Fetching product ${id}`);
      const product = await this.productService.findById(id);

      if (!product) {
        return {
          success: false,
          message: "Product not found",
          error: `Product with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "Product fetched successfully",
        data: this.productService.mapToResponse(product),
      };
    } catch (error) {
      this.logger.error(`[findById] Error: ${error}`);
      return {
        success: false,
        message: "Failed to fetch product",
        error: error.message,
      };
    }
  }

  /**
   * Update product (Edit Info)
   */
  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ): Promise<ProductSingleResponseDto | GenericProductResponseDto> {
    try {
      this.logger.log(`[update] Updating product ${id}`);
      const product = await this.productService.update(id, body);

      if (!product) {
        return {
          success: false,
          message: "Product not found",
          error: `Product with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "Product updated successfully",
        data: this.productService.mapToResponse(product),
      };
    } catch (error) {
      this.logger.error(`[update] Error: ${error}`);
      return {
        success: false,
        message: "Failed to update product",
        error: error.message,
      };
    }
  }

  /**
   * Delete product
   */
  @Delete(":id")
  async delete(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<GenericProductResponseDto> {
    try {
      this.logger.log(`[delete] Deleting product ${id}`);
      const deleted = await this.productService.delete(id);

      if (!deleted) {
        return {
          success: false,
          message: "Product not found",
          error: `Product with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "Product deleted successfully",
      };
    } catch (error) {
      this.logger.error(`[delete] Error: ${error}`);
      return {
        success: false,
        message: "Failed to delete product",
        error: error.message,
      };
    }
  }
}
