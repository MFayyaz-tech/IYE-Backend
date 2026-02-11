import {
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  Min,
  Matches,
  IsBoolean,
} from "class-validator";

/** Time string HH:mm or HH:mm:ss */
const TIME_PATTERN = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;

export class CreateStoreDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  logo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  cover_image?: string;

  @IsNumber()
  @Min(1)
  market_id: number;

  @IsString()
  @MaxLength(255)
  store_name: string;

  @IsOptional()
  @IsString()
  @Matches(TIME_PATTERN, {
    message: "open_time must be HH:mm or HH:mm:ss",
  })
  open_time?: string;

  @IsOptional()
  @IsString()
  @Matches(TIME_PATTERN, {
    message: "closed_time must be HH:mm or HH:mm:ss",
  })
  closed_time?: string;

  @IsNumber()
  @Min(1)
  vendor_id: number;

  @IsOptional()
  @IsBoolean()
  is_approved?: boolean;
}

export class UpdateStoreDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  logo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  cover_image?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  market_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  store_name?: string;

  @IsOptional()
  @IsString()
  @Matches(TIME_PATTERN, {
    message: "open_time must be HH:mm or HH:mm:ss",
  })
  open_time?: string;

  @IsOptional()
  @IsString()
  @Matches(TIME_PATTERN, {
    message: "closed_time must be HH:mm or HH:mm:ss",
  })
  closed_time?: string;

  @IsOptional()
  @IsBoolean()
  is_approved?: boolean;
}

export class StoreResponseDto {
  id: number;
  logo: string | null;
  cover_image: string | null;
  market_id: number;
  store_name: string;
  open_time: string | null;
  closed_time: string | null;
  vendor_id: number;
  is_approved: boolean;
  created_at: Date;
  updated_at: Date;
}

export class StoreSingleResponseDto {
  success: boolean;
  message: string;
  data?: StoreResponseDto;
  error?: string;
}

export class StoreListResponseDto {
  success: boolean;
  message: string;
  data?: StoreResponseDto[];
  error?: string;
}

export class GenericStoreResponseDto {
  success: boolean;
  message: string;
  error?: string;
}
