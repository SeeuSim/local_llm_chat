import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const getDBInstance = () =>
  class PostgresPool {
    static pool: Pool | null = null;
    static db: NodePgDatabase | null = null;
    static async getInstance() {
      if (this.pool === null) {
        this.pool = new Pool({
          database: process.env.DB_NAME,
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          port: process.env.DB_PORT,
        });
        process.on('beforeExit', () => this.pool?.end());
      }
      if (this.db === null) {
        this.db = drizzle(this.pool);
      }
      return this.db;
    }
  };

export type TPGInstance = ReturnType<typeof getDBInstance>;

let PgInstance: TPGInstance;
if (process.env.NODE_ENV !== 'production') {
  if (!global.PgInstance) {
    global.PgInstance = getDBInstance();
  }
  PgInstance = global.PgInstance;
} else {
  PgInstance = getDBInstance();
}
export default PgInstance;
