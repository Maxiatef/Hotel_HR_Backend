import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRESQL_ADDON_HOST,
  port: parseInt(process.env.POSTGRESQL_ADDON_PORT ?? '5432', 10),
  username: process.env.POSTGRESQL_ADDON_USER,
  password: process.env.POSTGRESQL_ADDON_PASSWORD,
  database: process.env.POSTGRESQL_ADDON_DB,
  schema: 'public',
  ssl: { rejectUnauthorized: false },
  entities: [__dirname + '/../models/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
  logging: false,
};

export default new DataSource(typeOrmConfig);
