import {
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  Min,
} from "class-validator";

export class CreateAddressDto {
  @IsNumber()
  @Min(1)
  user_id: number;

  @IsString()
  @MaxLength(50)
  phone: string;

  @IsString()
  address: string;

  @IsString()
  @MaxLength(100)
  title: string;
}

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;
}

export class AddressResponseDto {
  id: number;
  user_id: number;
  phone: string;
  address: string;
  title: string;
  created_at: Date;
  updated_at: Date;
}

export class AddressSingleResponseDto {
  success: boolean;
  message: string;
  data?: AddressResponseDto;
  error?: string;
}

export class AddressListResponseDto {
  success: boolean;
  message: string;
  data?: AddressResponseDto[];
  error?: string;
}

export class GenericAddressResponseDto {
  success: boolean;
  message: string;
  error?: string;
}
