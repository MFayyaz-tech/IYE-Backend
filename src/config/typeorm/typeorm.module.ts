import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentConfigModule } from '../environment-config/environment-config.module';
import { databaseConfigurations } from './typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfigurations),
    // TypeOrmModule.forRoot({
    //   name: 'source-db',
    //   ...sourceDbDatabaseConfigurations,
    // }),
    EnvironmentConfigModule,
  ],
  exports: [
    TypeOrmModule.forRoot(databaseConfigurations),
    // TypeOrmModule.forRoot({
    //   name: 'source-db',
    //   ...sourceDbDatabaseConfigurations,
    // }),
  ],
})
export class TypeOrmConfigModule {}
