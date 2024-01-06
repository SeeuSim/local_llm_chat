import type { PoolConfig } from 'pg';
import type { PGVectorStoreArgs } from '@langchain/community/vectorstores/pgvector';

import { EmbeddingsTableConf } from './schema';

export const PgVectorStoreConfig: PGVectorStoreArgs = {
  postgresConnectionOptions: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  } as PoolConfig,
  tableName: EmbeddingsTableConf.name,
  columns: {
    idColumnName: EmbeddingsTableConf.columns.id.name,
    vectorColumnName: EmbeddingsTableConf.columns.embedding.name,
    contentColumnName: EmbeddingsTableConf.columns.content.name,
    metadataColumnName: EmbeddingsTableConf.columns.metadata.name,
  },
};
