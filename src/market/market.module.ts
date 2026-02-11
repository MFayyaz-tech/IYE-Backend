import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Market } from "./entities/market.entity";
import { MarketController } from "./market.controller";
import { MarketService } from "./market.service";

@Module({
  imports: [TypeOrmModule.forFeature([Market])],
  controllers: [MarketController],
  providers: [MarketService],
  exports: [MarketService, TypeOrmModule],
})
export class MarketModule {}
