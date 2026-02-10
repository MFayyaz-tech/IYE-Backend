import { Module } from '@nestjs/common';

import { EnvironmentConfigModule } from '../../config/environment-config/environment-config.module';
import { JwtAuthGuard } from './jwt-auth.guard';
import { SuperAdminGuard } from './super-admin.guard';
import { OrganizationAdminGuard } from './organization-admin.guard';
import { ShopAdminGuard } from './shop-admin.guard';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from 'src/utils-services/jwt/jwt.module';

@Module({
  imports: [UsersModule, EnvironmentConfigModule, JwtModule],
  providers: [
    JwtAuthGuard,
    SuperAdminGuard,
    OrganizationAdminGuard,
    ShopAdminGuard,
  ],
  exports: [
    JwtAuthGuard,
    SuperAdminGuard,
    OrganizationAdminGuard,
    ShopAdminGuard,
    UsersModule,
    EnvironmentConfigModule,
    JwtModule,
  ],
})
export class GuardsModule {}
