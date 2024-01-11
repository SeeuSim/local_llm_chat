import { RoomTable } from '@/lib/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

export interface IAPIChatRoomGetDetailsParams {
  roomId: string;
}

export type TAPIChatRoomGetDetailsResult = InferSelectModel<typeof RoomTable>;
