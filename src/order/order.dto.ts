import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
  IsEnum,
  IsArray,
  ValidateNested,
  MaxLength,
} from "class-validator";
import { Type } from "class-transformer";
import { OrderStatus, PaymentMethod } from "./entities/order.entity";

export class CreateOrderItemDto {
  @IsNumber()
  @Min(1)
  product_id: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @IsNumber()
  @Min(1)
  store_id: number;

  @IsNumber()
  @Min(1)
  user_id: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsBoolean()
  is_paid?: boolean;

  @IsNumber()
  @Min(0)
  total_bill: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  payment_method?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  address_id?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsBoolean()
  is_paid?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  total_bill?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  payment_method?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  address_id?: number;
}

export class OrderItemResponseDto {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at: Date;
  updated_at: Date;
}

export class AddressRefResponseDto {
  id: number;
  user_id: number;
  phone: string;
  address: string;
  title: string;
}

export class OrderResponseDto {
  id: number;
  store_id: number;
  user_id: number;
  status: OrderStatus;
  is_paid: boolean;
  total_bill: number;
  discount: number;
  payment_method: string | null;
  address_id: number | null;
  address?: AddressRefResponseDto | null;
  items?: OrderItemResponseDto[];
  created_at: Date;
  updated_at: Date;
}

export class OrderSingleResponseDto {
  success: boolean;
  message: string;
  data?: OrderResponseDto;
  error?: string;
}

export class OrderListResponseDto {
  success: boolean;
  message: string;
  data?: OrderResponseDto[];
  error?: string;
}

export class GenericOrderResponseDto {
  success: boolean;
  message: string;
  error?: string;
}
