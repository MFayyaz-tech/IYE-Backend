import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EnvironmentConfigModule } from "./config/environment-config/environment-config.module";
import { TypeOrmConfigModule } from "./config/typeorm/typeorm.module";

import { AuthModule } from "./auth/auth.module";
import { CategoryModule } from "./category/category.module";
import { KycModule } from "./kyc/kyc.module";
import { ProductModule } from "./product/product.module";
import { StoreModule } from "./store/store.module";

@Module({
  imports: [
    EnvironmentConfigModule,
    TypeOrmConfigModule,
    KycModule,
    StoreModule,
    CategoryModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
