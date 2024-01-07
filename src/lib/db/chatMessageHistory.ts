import { BaseListChatMessageHistory } from '@langchain/core/chat_history';
import { BaseMessage } from '@langchain/core/messages';

export const getPGChatMessageHistory = (roomId: string) =>
  class PostgresChatMessageHistory extends BaseListChatMessageHistory {
    lc_namespace: string[] = ['@', 'lib', 'db'];

    constructor() {
      super();
    }

    async getMessages(): Promise<BaseMessage[]> {
      return new Promise((resolve, reject) => resolve([]));
    }

    async addMessage(message: BaseMessage): Promise<void> {}
  };
