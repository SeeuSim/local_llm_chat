import { ChatOllama } from '@langchain/community/chat_models/ollama';

const getOllamaSingleton = () =>
  class OllamaSingleton {
    static model = 'mistral';
    static instance: ChatOllama | null = null;
    static async getInstance() {
      if (this.instance === null) {
        this.instance = new ChatOllama({
          baseUrl: process.env.OLLAMA_BASE_URL,
          model: this.model,
        });
      }
      return this.instance;
    }
  };

export type TChatOllamaSingleton = ReturnType<typeof getOllamaSingleton>;

let ChatOllamaSingleton: TChatOllamaSingleton;
if (process.env.NODE_ENV !== 'production') {
  if (!global.ChatOllamaSingleton) {
    global.ChatOllamaSingleton = getOllamaSingleton();
  }
  ChatOllamaSingleton = global.ChatOllamaSingleton;
} else {
  ChatOllamaSingleton = getOllamaSingleton();
}
export default ChatOllamaSingleton;
