import { RoomTable } from '@/lib/db/schema';
import { InferSelectModel } from 'drizzle-orm';

export interface IAPIChatRoomGetOutput {
  rooms: Array<Pick<InferSelectModel<typeof RoomTable>, 'id' | 'modifiedTime' | 'summary'>>;
}
