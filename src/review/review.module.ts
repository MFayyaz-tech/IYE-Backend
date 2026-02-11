import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./entities/review.entity";
import { Product } from "../product/entities/product.entity";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";

@Module({
  imports: [TypeOrmModule.forFeature([Review, Product])],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService, TypeOrmModule],
})
export class ReviewModule {}
