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
import { ReviewService } from "./review.service";
import {
  CreateReviewDto,
  UpdateReviewDto,
  ReviewSingleResponseDto,
  ReviewListResponseDto,
  GenericReviewResponseDto,
} from "./review.dto";

@Controller("reviews")
export class ReviewController {
  private readonly logger = new Logger(ReviewController.name);

  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async create(
    @Body() body: CreateReviewDto,
  ): Promise<ReviewSingleResponseDto | GenericReviewResponseDto> {
    try {
      this.logger.log("[create] Creating review");
      const review = await this.reviewService.create(body);
      return {
        success: true,
        message: "Review created successfully",
        data: this.reviewService.mapToResponse(review),
      };
    } catch (error) {
      this.logger.error(`[create] Error: ${error}`);
      return {
        success: false,
        message: "Failed to create review",
        error: error.message,
      };
    }
  }

  @Get()
  async findAll(
    @Query("product_id") productId?: string,
    @Query("user_id") userId?: string,
  ): Promise<ReviewListResponseDto> {
    try {
      this.logger.log("[findAll] Fetching reviews");
      let list;
      if (productId) {
        list = await this.reviewService.findByProductId(
          parseInt(productId, 10),
        );
      } else if (userId) {
        list = await this.reviewService.findByUserId(parseInt(userId, 10));
      } else {
        list = [];
      }
      return {
        success: true,
        message: "Reviews fetched successfully",
        data: list.map((r) => this.reviewService.mapToResponse(r)),
      };
    } catch (error) {
      this.logger.error(`[findAll] Error: ${error}`);
      return {
        success: false,
        message: "Failed to fetch reviews",
        error: error.message,
      };
    }
  }

  @Get(":id")
  async findById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<ReviewSingleResponseDto> {
    try {
      this.logger.log(`[findById] Fetching review ${id}`);
      const review = await this.reviewService.findById(id);

      if (!review) {
        return {
          success: false,
          message: "Review not found",
          error: `Review with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "Review fetched successfully",
        data: this.reviewService.mapToResponse(review),
      };
    } catch (error) {
      this.logger.error(`[findById] Error: ${error}`);
      return {
        success: false,
        message: "Failed to fetch review",
        error: error.message,
      };
    }
  }

  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateReviewDto,
  ): Promise<ReviewSingleResponseDto | GenericReviewResponseDto> {
    try {
      this.logger.log(`[update] Updating review ${id}`);
      const review = await this.reviewService.update(id, body);

      if (!review) {
        return {
          success: false,
          message: "Review not found",
          error: `Review with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "Review updated successfully",
        data: this.reviewService.mapToResponse(review),
      };
    } catch (error) {
      this.logger.error(`[update] Error: ${error}`);
      return {
        success: false,
        message: "Failed to update review",
        error: error.message,
      };
    }
  }

  @Delete(":id")
  async delete(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<GenericReviewResponseDto> {
    try {
      this.logger.log(`[delete] Deleting review ${id}`);
      const deleted = await this.reviewService.delete(id);

      if (!deleted) {
        return {
          success: false,
          message: "Review not found",
          error: `Review with ID ${id} does not exist`,
        };
      }

      return {
        success: true,
        message: "Review deleted successfully",
      };
    } catch (error) {
      this.logger.error(`[delete] Error: ${error}`);
      return {
        success: false,
        message: "Failed to delete review",
        error: error.message,
      };
    }
  }
}
