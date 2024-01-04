import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const user = 'locallm';
const password = 'locallm';
const url = '127.0.0.1';
const database = 'llmchat';
const port = 5431;

const CONNECTION_STRING = `postgresql://${user}:${password}@${url}:${port}/${database}`;

const sql = postgres(CONNECTION_STRING, { max: 1 });

const db = drizzle(sql);

await migrate(db, { migrationsFolder: 'drizzle' });
await sql.end();
