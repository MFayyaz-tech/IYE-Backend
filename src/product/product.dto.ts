import {
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  Min,
  IsArray,
  ArrayMaxSize,
} from "class-validator";

export class CreateProductDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNumber()
  @Min(1)
  category_id: number;

  @IsNumber()
  @Min(1)
  store_id: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  purity?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  unit?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  main_image?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(4)
  additional_images?: string[];
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  category_id?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  purity?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  unit?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  main_image?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(4)
  additional_images?: string[];
}

export class ProductResponseDto {
  id: number;
  name: string;
  category_id: number;
  store_id: number;
  price: number;
  quantity: number;
  description: string | null;
  purity: string | null;
  unit: string | null;
  main_image: string | null;
  additional_images: string[] | null;
  /** Number of users who rated this product */
  rating_count: number;
  /** Average rating (1–5); 0 if no ratings */
  average_rating: number;
  created_at: Date;
  updated_at: Date;
}

export class ProductSingleResponseDto {
  success: boolean;
  message: string;
  data?: ProductResponseDto;
  error?: string;
}

export class ProductListResponseDto {
  success: boolean;
  message: string;
  data?: ProductResponseDto[];
  error?: string;
}

export class GenericProductResponseDto {
  success: boolean;
  message: string;
  error?: string;
}
