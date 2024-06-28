import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.db_host,
    port: (process.env.db_port),
    user: process.env.db_username,
    password: process.env.db_password,
    database: process.env.db_name,
    ssl: 'require',
  }
// @ts-ignore
} satisfies Config;