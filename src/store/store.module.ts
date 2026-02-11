import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Store } from "./entities/store.entity";
import { Market } from "../market/entities/market.entity";
import { StoreController } from "./store.controller";
import { StoreService } from "./store.service";

@Module({
  imports: [TypeOrmModule.forFeature([Store, Market])],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService, TypeOrmModule],
})
export class StoreModule {}
