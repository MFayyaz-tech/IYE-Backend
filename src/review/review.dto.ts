import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  MaxLength,
} from "class-validator";

const RATING_MIN = 1;
const RATING_MAX = 5;

export class CreateReviewDto {
  @IsNumber()
  @Min(1)
  product_id: number;

  @IsNumber()
  @Min(1)
  user_id: number;

  @IsNumber()
  @Min(RATING_MIN)
  @Max(RATING_MAX)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

export class UpdateReviewDto {
  @IsOptional()
  @IsNumber()
  @Min(RATING_MIN)
  @Max(RATING_MAX)
  rating?: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

export class ReviewResponseDto {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string | null;
  created_at: Date;
  updated_at: Date;
}

export class ReviewSingleResponseDto {
  success: boolean;
  message: string;
  data?: ReviewResponseDto;
  error?: string;
}

export class ReviewListResponseDto {
  success: boolean;
  message: string;
  data?: ReviewResponseDto[];
  error?: string;
}

export class GenericReviewResponseDto {
  success: boolean;
  message: string;
  error?: string;
}
