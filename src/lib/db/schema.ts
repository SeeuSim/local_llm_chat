import { pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const RoomTable = pgTable('room', {
  id: serial('id').unique().primaryKey(),
  summary: text('summary'),
});

export const MessagesTable = pgTable(
  'messages',
  {
    id: serial('id'),
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
      pk: primaryKey({ columns: [table.id, table.roomId] }),
    };
  }
);
