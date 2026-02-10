import { IsString, IsOptional, MaxLength } from "class-validator";

export class CreateKycDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bvn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  nin_front?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  nin_back?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  bvn_number?: string;
}

export class UpdateKycDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bvn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  nin_front?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  nin_back?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  bvn_number?: string;
}

export class KycResponseDto {
  id: number;
  bvn: string | null;
  nin_front: string | null;
  nin_back: string | null;
  bvn_number: string | null;
  created_at: Date;
  updated_at: Date;
}

export class KycSingleResponseDto {
  success: boolean;
  message: string;
  data?: KycResponseDto;
  error?: string;
}

export class KycListResponseDto {
  success: boolean;
  message: string;
  data?: KycResponseDto[];
  error?: string;
}

export class GenericKycResponseDto {
  success: boolean;
  message: string;
  error?: string;
}
