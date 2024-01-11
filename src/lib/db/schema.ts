import { customVector } from '@useverk/drizzle-pgvector';
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import type { TChunkMetadata } from '@/lib/models/embeddings/utils';

export const RoomTable = pgTable(
  'room',
  {
    id: uuid('id').unique().primaryKey().defaultRandom(),
    createdTime: timestamp('created_time').defaultNow(),
    // Will have to manually update
    modifiedTime: timestamp('modified_time').defaultNow(),
    summary: text('summary'),
    truncateIndexes: integer('truncate_indexes').array().default([0]),
  },
  (table) => ({
    modifiedIndex: index('modified_time_index').on(table.modifiedTime).desc(),
  })
);

export const MessagesTable = pgTable(
  'messages',
  {
    id: uuid('id').defaultRandom(),
    roomId: uuid('room_id').references(() => RoomTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    timeStamp: timestamp('time_stamp').defaultNow(),
    persona: text('persona'),
    content: text('content'),
    documentTitles: text('document_titles').array().default([]),
    isAborted: boolean('is_aborted').default(false),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.roomId, table.id] }),
      timeIndex: index('time_stamp_index').on(table.timeStamp).asc(),
    };
  }
);

// Embedding conf

export const EmbeddingsTableConf = {
  name: 'embeddings',
  columns: {
    id: { name: 'id' },
    content: { name: 'content' },
    metadata: { name: 'metadata' },
    embedding: { name: 'embedding' },
  },
};

export const EmbeddingsTable = pgTable(EmbeddingsTableConf.name, {
  id: uuid(EmbeddingsTableConf.columns.id.name).unique().primaryKey().defaultRandom(),
  createdTime: timestamp('created_time').defaultNow(),
  content: text(EmbeddingsTableConf.columns.content.name),
  metadata: jsonb(EmbeddingsTableConf.columns.metadata.name).$type<TChunkMetadata>(),
  embedding: customVector(EmbeddingsTableConf.columns.embedding.name, { dimensions: 768 }),
});
