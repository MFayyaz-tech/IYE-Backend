import { IsString, IsOptional, MaxLength } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  icon?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  image?: string;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  icon?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  image?: string;
}

export class CategoryResponseDto {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  created_at: Date;
  updated_at: Date;
}

export class CategorySingleResponseDto {
  success: boolean;
  message: string;
  data?: CategoryResponseDto;
  error?: string;
}

export class CategoryListResponseDto {
  success: boolean;
  message: string;
  data?: CategoryResponseDto[];
  error?: string;
}

export class GenericCategoryResponseDto {
  success: boolean;
  message: string;
  error?: string;
}
