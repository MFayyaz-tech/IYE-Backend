import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EnvironmentConfigModule } from "./config/environment-config/environment-config.module";
import { TypeOrmConfigModule } from "./config/typeorm/typeorm.module";

import { AddressModule } from "./address/address.module";
import { AuthModule } from "./auth/auth.module";
import { CategoryModule } from "./category/category.module";
import { KycModule } from "./kyc/kyc.module";
import { MarketModule } from "./market/market.module";
import { OrderModule } from "./order/order.module";
import { ProductModule } from "./product/product.module";
import { ReviewModule } from "./review/review.module";
import { StoreModule } from "./store/store.module";
import { TransactionModule } from "./transaction/transaction.module";
import { WalletModule } from "./wallet/wallet.module";

@Module({
  imports: [
    EnvironmentConfigModule,
    TypeOrmConfigModule,
    KycModule,
    MarketModule,
    StoreModule,
    AddressModule,
    OrderModule,
    TransactionModule,
    WalletModule,
    CategoryModule,
    ProductModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
