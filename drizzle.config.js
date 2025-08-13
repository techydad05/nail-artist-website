import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.js',
  out: './src/lib/db/migrations',
  driver: 'better-sqlite',
  dbCredentials: {
    url: './appointments.db'
  }
} satisfies Config;