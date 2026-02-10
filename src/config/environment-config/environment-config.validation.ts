import { plainToClass } from 'class-transformer';
import {
  IsNotEmpty,
  // IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsNotEmpty()
  @IsString()
  DATABASE_TYPE: string;
  @IsNotEmpty()
  @IsString()
  DATABASE_NAME: string;
  @IsNotEmpty()
  @IsString()
  DATABASE_PORT: string;
  @IsNotEmpty()
  @IsString()
  DATABASE_HOST: string;
  @IsNotEmpty()
  @IsString()
  DATABASE_USERNAME: string;
  @IsNotEmpty()
  @IsString()
  DATABASE_PASSWORD: string;
  @IsNotEmpty()
  @IsString()
  DATABASE_SYNCHRONIZE: string;
  @IsNotEmpty()
  @IsString()
  DATABASE_MIGRATIONS_RUN: string;
  @IsNotEmpty()
  @IsString()
  DATABASE_SCHEMA: string;
  @IsNotEmpty()
  @IsString()
  PORT: string;
  // @IsString()
  // @IsOptional()
  // CACHE_MANAGER_HOST: string;
  // @IsString()
  // @IsOptional()
  // CACHE_MANAGER_PORT: string;
  @IsString()
  WHATSAPP_VERIFY_TOKEN: string;
  @IsString()
  WHATSAPP_PHONE_NUMBER_ID: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
