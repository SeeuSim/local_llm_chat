import type { InferSelectModel } from 'drizzle-orm';

import { MessagesTable } from '@/lib/db/schema';

export interface IAPIChatMessagesGetParams {
  roomId: string;
}

export interface IAPIChatMessagesGetOutput {
  messages: Array<InferSelectModel<typeof MessagesTable>>;
}
