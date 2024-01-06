import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const url = process.env.DB_HOST;
const database = process.env.DB_NAME;
const port = process.env.DB_PORT;

const CONNECTION_STRING = `postgresql://${user}:${password}@${url}:${port}/${database}`;

const sql = postgres(CONNECTION_STRING, { max: 1 });

const db = drizzle(sql);

await migrate(db, { migrationsFolder: 'drizzle' });
await sql.end();
