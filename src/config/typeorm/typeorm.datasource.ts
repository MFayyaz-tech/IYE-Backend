import { DataSource } from 'typeorm';
import { databaseConfigurations } from './typeorm.config';
import { entities } from '../../entities';

const AppDataSource = new DataSource({
  ...databaseConfigurations,
  entities: entities,
  migrations: ['dist/database/migrations/*{.ts,.js}'],
});

module.exports = AppDataSource;
