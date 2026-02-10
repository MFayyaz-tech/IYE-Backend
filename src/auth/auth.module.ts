import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { JwtModule } from '../utils-services/jwt/jwt.module';
import { BcryptModule } from '../utils-services/bcrypt/bcrypt.module';
import { GuardsModule } from './guards/guards.module';

@Module({
  imports: [
    UsersModule,
    EnvironmentConfigModule,
    JwtModule,
    BcryptModule,
    GuardsModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [
    AuthService,
    GuardsModule,
    JwtModule,
    EnvironmentConfigModule,
    UsersModule,
  ],
})
export class AuthModule {}
