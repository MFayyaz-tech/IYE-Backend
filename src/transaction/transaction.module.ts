import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderTransaction } from "./entities/order-transaction.entity";
import { OrderTransactionController } from "./transaction.controller";
import { OrderTransactionService } from "./transaction.service";

@Module({
  imports: [TypeOrmModule.forFeature([OrderTransaction])],
  controllers: [OrderTransactionController],
  providers: [OrderTransactionService],
  exports: [OrderTransactionService, TypeOrmModule],
})
export class TransactionModule {}
