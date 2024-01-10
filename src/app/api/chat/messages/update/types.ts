import type { InferInsertModel } from 'drizzle-orm';

import { MessagesTable } from '@/lib/db/schema';
import type { WithRequired } from '@/lib/types';

type TMessagesRequiredFields = WithRequired<
  InferInsertModel<typeof MessagesTable>,
  'roomId' | 'content' | 'id'
>;

export interface IAPIChatMessagesUpdateParams {
  messages: Array<TMessagesRequiredFields>;
}

export interface IAPIChatMessagesUpdateResponse {
  message: string;
  ids: Array<string>;
}
