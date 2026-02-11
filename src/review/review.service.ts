import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Review } from "./entities/review.entity";
import { Product } from "../product/entities/product.entity";
import {
  CreateReviewDto,
  UpdateReviewDto,
  ReviewResponseDto,
} from "./review.dto";

@Injectable()
export class ReviewService {
  private readonly logger = new Logger(ReviewService.name);

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Recompute product rating aggregates from current reviews
   */
  private async updateProductRating(productId: number): Promise<void> {
    const result = await this.reviewRepository
      .createQueryBuilder("review")
      .select("COUNT(review.id)", "count")
      .addSelect("COALESCE(SUM(review.rating), 0)", "total")
      .where("review.product_id = :productId", { productId })
      .getRawOne<{ count: string; total: string }>();

    const count = parseInt(result?.count ?? "0", 10);
    const total = parseFloat(result?.total ?? "0");

    await this.productRepository.update(productId, {
      rating_count: count,
      rating_total: total,
    });
  }

  /**
   * Create review and update product rating aggregates
   */
  async create(data: CreateReviewDto): Promise<Review> {
    const review = this.reviewRepository.create({
      product_id: data.product_id,
      user_id: data.user_id,
      rating: data.rating,
      comment: data.comment ?? null,
    });
    const saved = await this.reviewRepository.save(review);
    await this.updateProductRating(data.product_id);
    return saved;
  }

  /**
   * Find review by ID
   */
  async findById(id: number): Promise<Review | null> {
    return this.reviewRepository.findOne({
      where: { id },
      relations: ["product", "user"],
    });
  }

  /**
   * Find all reviews for a product
   */
  async findByProductId(productId: number): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { product_id: productId },
      order: { created_at: "DESC" },
      relations: ["user"],
    });
  }

  /**
   * Find all reviews by a user
   */
  async findByUserId(userId: number): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { user_id: userId },
      order: { created_at: "DESC" },
      relations: ["product"],
    });
  }

  /**
   * Find review by product and user (one per user per product)
   */
  async findByProductAndUser(
    productId: number,
    userId: number,
  ): Promise<Review | null> {
    return this.reviewRepository.findOne({
      where: { product_id: productId, user_id: userId },
      relations: ["product", "user"],
    });
  }

  /**
   * Update review and refresh product rating aggregates
   */
  async update(id: number, data: UpdateReviewDto): Promise<Review | null> {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) return null;

    await this.reviewRepository.update(id, {
      ...(data.rating !== undefined && { rating: data.rating }),
      ...(data.comment !== undefined && { comment: data.comment }),
    });
    await this.updateProductRating(review.product_id);
    return this.findById(id);
  }

  /**
   * Delete review and update product rating aggregates
   */
  async delete(id: number): Promise<boolean> {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) return false;

    const result = await this.reviewRepository.delete(id);
    if ((result.affected ?? 0) > 0) {
      await this.updateProductRating(review.product_id);
      return true;
    }
    return false;
  }

  /**
   * Map entity to response DTO
   */
  mapToResponse(review: Review): ReviewResponseDto {
    return {
      id: review.id,
      product_id: review.product_id,
      user_id: review.user_id,
      rating: review.rating,
      comment: review.comment,
      created_at: review.created_at,
      updated_at: review.updated_at,
    };
  }
}
