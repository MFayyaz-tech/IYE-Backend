import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentConfigService {
  constructor(private configService: ConfigService) {}

  getPORT(): number {
    return +this.configService.get<string>('PORT')!;
  }

  getDatabaseSchema(): string {
    return this.configService.get<string>('DATABASE_SCHEMA')!;
  }

  getDatabaseHost(): string {
    return this.configService.get<string>('DATABASE_HOST')!;
  }

  getDatabasePort(): number {
    return this.configService.get<number>('DATABASE_PORT')!;
  }

  getDatabaseUser(): string {
    return this.configService.get<string>('DATABASE_USERNAME')!;
  }

  getDatabasePassword(): string {
    return this.configService.get<string>('DATABASE_PASSWORD')!;
  }

  getDatabaseName(): string {
    return this.configService.get<string>('DATABASE_NAME')!;
  }

  getDatabaseType(): any {
    return this.configService.get<string>('DATABASE_TYPE')!;
  }

  getDatabaseSync(): boolean {
    return this.configService.get<string>('DATABASE_SYNCHRONIZE') === 'true';
  }

  getDatabaseMigrationRun(): boolean {
    return this.configService.get<string>('DATABASE_MIGRATIONS_RUN') === 'true';
  }

  getJwtSecret(): string {
    const secret = this.configService.get<string>('JWT_SECRET');
    console.log('JWT_SECRET:', secret);
    return secret;
  }

  getJwtExpirationTime(): string {
    const expirationTime =
      this.configService.get<string>('JWT_EXPIRATION_TIME') || '1800';
    console.log('JWT_EXPIRATION_TIME:', expirationTime);
    return expirationTime;
  }

  getJwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');
  }

  getJwtRefreshExpirationTime(): string {
    const refreshExpirationTime =
      this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME') ||
      '2592000';
    console.log('JWT_REFRESH_TOKEN_EXPIRATION_TIME:', refreshExpirationTime);
    return refreshExpirationTime;
  }

  // getLocalMemoryUsageForCacheManager(): any {
  //   return (
  //     !this.configService.get<string>('USE_LOCAL_MEMORY_CACHE_MANAGER') ||
  //     this.configService
  //       .get<any>('USE_LOCAL_MEMORY_CACHE_MANAGER')
  //       .toLowerCase() === 'true'
  //   );
  // }

  // getCacheManagerPort(): any {
  //   return this.configService.get<string>('CACHE_MANAGER_PORT');
  // }

  // getCacheManagerHost(): any {
  //   return this.configService.get<string>('CACHE_MANAGER_HOST');
  // }

  // getCacheManagerPassword(): any {
  //   const password =
  //     this.configService.get<string>('CACHE_MANAGER_PASSWORD') || 'lowlu-redis';
  //   console.log('Cache Manager Password', password);
  //   return password ? { password } : {};
  // }

  getFacebookGraphApiToken(): any {
    return this.configService.get<string>('WHATSAPP_VERIFY_TOKEN');
  }

  getWhatsAppPhoneNumberId(): any {
    return this.configService.get<string>('WHATSAPP_PHONE_NUMBER_ID');
  }
}
