import type { InferInsertModel } from 'drizzle-orm';

import { MessagesTable } from '@/lib/db/schema';
import type { WithRequired } from '@/lib/types';

type TMessagesRequiredFields = WithRequired<
  InferInsertModel<typeof MessagesTable>,
  'roomId' | 'persona' | 'content'
>;

export interface IAPIChatMessagesCreateParams {
  messages: Array<TMessagesRequiredFields>;
}

export interface IAPIChatMessagesCreateResponse {
  message: string;
  ids: Array<string>;
}
