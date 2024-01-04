import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    host: '127.0.0.1',
    port: 5431,
    database: 'llmchat',
    user: 'locallm',
    password: 'locallm',
  },
} satisfies Config;
