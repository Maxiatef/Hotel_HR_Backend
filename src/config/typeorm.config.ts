import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

const databaseUrl = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  url: databaseUrl,
  host: databaseUrl ? undefined : process.env.POSTGRESQL_ADDON_HOST,
  port: databaseUrl ? undefined : parseInt(process.env.POSTGRESQL_ADDON_PORT ?? '5432', 10),
  username: databaseUrl ? undefined : process.env.POSTGRESQL_ADDON_USER,
  password: databaseUrl ? undefined : process.env.POSTGRESQL_ADDON_PASSWORD,
  database: databaseUrl ? undefined : process.env.POSTGRESQL_ADDON_DB,
  schema: 'public',
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  entities: [__dirname + '/../models/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
  logging: false,
  extra: {
    max: 10,                    // cap connections to stay within Clever Cloud free tier limits
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  },
};

export default new DataSource(typeOrmConfig);
