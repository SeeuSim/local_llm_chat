import { customVector } from '@useverk/drizzle-pgvector';
import { index, jsonb, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const RoomTable = pgTable('room', {
  id: uuid('id').unique().primaryKey().defaultRandom(),
  summary: text('summary'),
});

export const MessagesTable = pgTable(
  'messages',
  {
    roomId: uuid('room_id').references(() => RoomTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    timeStamp: timestamp('time_stamp'),
    persona: text('persona'),
    content: text('content'),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.roomId, table.timeStamp] }),
      timeIndex: index('time_index').on(table.timeStamp).asc(),
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
  content: text(EmbeddingsTableConf.columns.content.name),
  metadata: jsonb(EmbeddingsTableConf.columns.metadata.name),
  embedding: customVector(EmbeddingsTableConf.columns.embedding.name, { dimensions: 768 }),
});
