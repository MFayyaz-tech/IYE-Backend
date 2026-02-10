import { EnvironmentConfigService } from '../environment-config/environment-config.service';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { entities } from '../../entities';
import { DataSourceOptions } from 'typeorm';
const configSerivce = new EnvironmentConfigService(new ConfigService());

config({ path: 'env/.env' });

const schema = configSerivce.getDatabaseSchema();
// Use 'public' schema if schema is 'default' or empty, as PostgreSQL doesn't have a 'default' schema
const finalSchema = schema && schema !== 'default' ? schema : 'public';

export const databaseConfigurations: DataSourceOptions = {
  type: configSerivce.getDatabaseType(),
  port: configSerivce.getDatabasePort(),
  username: configSerivce.getDatabaseUser(),
  password: configSerivce.getDatabasePassword(),
  database: configSerivce.getDatabaseName(),
  synchronize: configSerivce.getDatabaseSync(),
  host: configSerivce.getDatabaseHost(),
  schema: finalSchema,
  entities: entities,
  cache: false,
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  migrationsRun: configSerivce.getDatabaseMigrationRun(),
  applicationName: 'orion',
  logger: 'advanced-console',
  migrationsTransactionMode: 'each',
  logging: ['error'],
  poolSize: 100,
};
