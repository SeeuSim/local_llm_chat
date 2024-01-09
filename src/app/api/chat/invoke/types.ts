import type { InferSelectModel } from 'drizzle-orm';
import { MessagesTable } from '@/lib/db/schema';

export type TChatMessage = Pick<InferSelectModel<typeof MessagesTable>, 'content' | 'persona'>;

export interface IAPIChatInvokeParams {
  history: Array<TChatMessage>;
  hasDocuments?: boolean;
  message: string;
  roomId?: string;
}
