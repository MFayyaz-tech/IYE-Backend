import { IsString, IsOptional, MaxLength } from "class-validator";

export class CreateMarketDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateMarketDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class MarketResponseDto {
  id: number;
  name: string;
  location: string | null;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

export class MarketSingleResponseDto {
  success: boolean;
  message: string;
  data?: MarketResponseDto;
  error?: string;
}

export class MarketListResponseDto {
  success: boolean;
  message: string;
  data?: MarketResponseDto[];
  error?: string;
}

export class GenericMarketResponseDto {
  success: boolean;
  message: string;
  error?: string;
}
