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
import { CategoryService } from "./category.service";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategorySingleResponseDto,
  CategoryListResponseDto,
  GenericCategoryResponseDto,
} from "./category.dto";

@Controller("categories")
export class CategoryController {
  private readonly logger = new Logger(CategoryController.name);

  constructor(private readonly categoryService: CategoryService) {}

  /**
   * Create category
   */
  @Post()
  async create(
    @Body() body: CreateCategoryDto,
  ): Promise<CategorySingleResponseDto | GenericCategoryResponseDto> {
    try {
      this.logger.log("[create] Creating category");
      const category = await this.categoryService.create(body);
      return {
        success: true,
        message: "Category created successfully",
        data: this.categoryService.mapToResponse(category),
      };
    } catch (error) {
      this.logger.error(`[create] Error: ${error}`);
      return {
        success: false,
        message: "Failed to create category",
        error: error.message,
      };
    }
  }

  /**
   * Get all categories
   */
  @Get()
  async findAll(): Promise<CategoryListResponseDto> {
    try {
      this.logger.log("[findAll] Fetching all categories");
      const list = await this.categoryService.findAll();
      return {
        success: true,
        message: "Categories fetched successfully",
        data: list.map((c) => this.categoryService.mapToResponse(c)),
      };
    } catch (error) {
      this.logger.error(`[findAll] Error: ${error}`);
      return {
        success: false,
        message: "Failed to fetch categories",
        error: error.message,
      };
    }
  }

  /**
   * Get category by ID
   */
  @Get(":id")
  async findById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<CategorySingleResponseDto> {
    try {
      this.logger.log(`[findById] Fetching category ${id}`);
      const category = await this.categoryService.findById(id);

      if (!category) {
        return {
          success: false,
          message: "Category not found",
          error: `Category with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "Category fetched successfully",
        data: this.categoryService.mapToResponse(category),
      };
    } catch (error) {
      this.logger.error(`[findById] Error: ${error}`);
      return {
        success: false,
        message: "Failed to fetch category",
        error: error.message,
      };
    }
  }

  /**
   * Update category
   */
  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateCategoryDto,
  ): Promise<CategorySingleResponseDto | GenericCategoryResponseDto> {
    try {
      this.logger.log(`[update] Updating category ${id}`);
      const category = await this.categoryService.update(id, body);

      if (!category) {
        return {
          success: false,
          message: "Category not found",
          error: `Category with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "Category updated successfully",
        data: this.categoryService.mapToResponse(category),
      };
    } catch (error) {
      this.logger.error(`[update] Error: ${error}`);
      return {
        success: false,
        message: "Failed to update category",
        error: error.message,
      };
    }
  }

  /**
   * Delete category
   */
  @Delete(":id")
  async delete(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<GenericCategoryResponseDto> {
    try {
      this.logger.log(`[delete] Deleting category ${id}`);
      const deleted = await this.categoryService.delete(id);

      if (!deleted) {
        return {
          success: false,
          message: "Category not found",
          error: `Category with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "Category deleted successfully",
      };
    } catch (error) {
      this.logger.error(`[delete] Error: ${error}`);
      return {
        success: false,
        message: "Failed to delete category",
        error: error.message,
      };
    }
  }
}
