import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsEnum,
  MaxLength,
} from "class-validator";
import { TransactionStatus } from "./entities/order-transaction.entity";

export class CreateOrderTransactionDto {
  @IsString()
  @MaxLength(255)
  transaction_id: string;

  @IsNumber()
  @Min(1)
  order_id: number;

  @IsNumber()
  @Min(1)
  user_id: number;

  @IsNumber()
  @Min(1)
  store_id: number;

  @IsString()
  @MaxLength(50)
  payment_method: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateOrderTransactionDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  transaction_id?: string;

  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class OrderTransactionResponseDto {
  id: number;
  transaction_id: string;
  order_id: number;
  user_id: number;
  store_id: number;
  payment_method: string;
  amount: number;
  status: TransactionStatus;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export class OrderTransactionSingleResponseDto {
  success: boolean;
  message: string;
  data?: OrderTransactionResponseDto;
  error?: string;
}

export class OrderTransactionListResponseDto {
  success: boolean;
  message: string;
  data?: OrderTransactionResponseDto[];
  error?: string;
}

export class GenericOrderTransactionResponseDto {
  success: boolean;
  message: string;
  error?: string;
}
