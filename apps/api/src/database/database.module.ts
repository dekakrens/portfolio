import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

export const DRIZZLE_DB = 'DRIZZLE_DB';

export type AppDatabase = PostgresJsDatabase<typeof schema>;

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DRIZZLE_DB,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const connectionString =
          config.get<string>('DATABASE_URL') ||
          'postgresql://postgres:postgres@localhost:5432/portfolio_db';
        const client = postgres(connectionString, {
          max: 10,
          idle_timeout: 20,
          connect_timeout: 10,
        });
        return drizzle(client, { schema });
      },
    },
  ],
  exports: [DRIZZLE_DB],
})
export class DatabaseModule {}
