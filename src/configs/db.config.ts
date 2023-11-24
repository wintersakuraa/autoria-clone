import { DataSourceOptions } from 'typeorm';

export const dbConfig: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DB_URL,
  migrationsRun: true,
  entities: ['dist/models/**/entities/**/*.js'],
  migrations: ['dist/database/migrations/**/*.js'],
  synchronize: false,
};
