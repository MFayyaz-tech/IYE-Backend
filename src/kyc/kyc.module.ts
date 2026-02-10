import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Kyc } from "./entities/kyc.entity";
import { KycController } from "./kyc.controller";
import { KycService } from "./kyc.service";

@Module({
  imports: [TypeOrmModule.forFeature([Kyc])],
  controllers: [KycController],
  providers: [KycService],
  exports: [KycService, TypeOrmModule],
})
export class KycModule {}
