import { customVector } from '@useverk/drizzle-pgvector';
import { index, jsonb, pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const RoomTable = pgTable('room', {
  id: serial('id').unique().primaryKey(),
  summary: text('summary'),
});

export const MessagesTable = pgTable(
  'messages',
  {
    roomId: serial('room_id').references(() => RoomTable.id, {
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

export const EmbeddingsTable = pgTable('embeddings', {
  id: serial('id').unique().primaryKey(),
  content: text('content'),
  metadata: jsonb('metadata'),
  embedding: customVector('embedding', { dimensions: 768 }),
});
