import { RoomTable } from '@/lib/db/schema';
import type { InferInsertModel } from 'drizzle-orm';

export type TAPIChatRoomUpdateParams = InferInsertModel<typeof RoomTable>;
