import { MessagesTable } from '@/lib/db/schema';
import { WithRequired } from '@/lib/types';
import { InferInsertModel } from 'drizzle-orm';

type TMessagesRequiredFields = WithRequired<
  InferInsertModel<typeof MessagesTable>,
  'roomId' | 'persona' | 'content'
>;

export interface IAPIChatMessagesCreateParams {
  messages: Array<TMessagesRequiredFields>;
}
