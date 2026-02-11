import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsEnum,
  MaxLength,
} from "class-validator";
import { WalletTransactionType } from "./entities/wallet-transaction.entity";

export class CreateWalletDto {
  @IsNumber()
  @Min(1)
  user_id: number;
}

export class CreditDebitWalletDto {
  @IsNumber()
  @Min(1)
  wallet_id: number;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsEnum(WalletTransactionType)
  type?: WalletTransactionType;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  reference_type?: string;

  @IsOptional()
  @IsNumber()
  reference_id?: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class WalletResponseDto {
  id: number;
  user_id: number;
  balance: number;
  created_at: Date;
  updated_at: Date;
}

export class WalletTransactionResponseDto {
  id: number;
  wallet_id: number;
  amount: number;
  type: WalletTransactionType;
  reference_type: string | null;
  reference_id: number | null;
  description: string | null;
  balance_after: number | null;
  created_at: Date;
  updated_at: Date;
}

export class WalletSingleResponseDto {
  success: boolean;
  message: string;
  data?: WalletResponseDto;
  error?: string;
}

export class WalletTransactionListResponseDto {
  success: boolean;
  message: string;
  data?: WalletTransactionResponseDto[];
  error?: string;
}

export class GenericWalletResponseDto {
  success: boolean;
  message: string;
  error?: string;
}
