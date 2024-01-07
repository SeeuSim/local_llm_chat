/* eslint no-var: 0 */

import type { TChatOllamaSingleton } from '@/lib/models/chat/chatOllama';
import type { THuggingFaceEmbeddingSingleton } from '@/lib/models/embeddings/huggingfaceEmbeddings';
import type { TOllamaEmbeddingSingleton } from '@/lib/models/embeddings/ollamaEmbeddings';
import type { TVectorStore } from '@/lib/models/vectorStore';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_VAR_ONE: string;
      VAR_ONE: string;

      DB_HOST: string;
      DB_PORT: number;
      DB_NAME: string;
      DB_USER: string;
      DB_PASSWORD: string;

      OLLAMA_BASE_URL: string;
    }
  }
  namespace globalThis {
    var HuggingFaceEmbeddingSingleton: THuggingFaceEmbeddingSingleton | undefined;
    var OllamaEmbeddingSingleton: TOllamaEmbeddingSingleton | undefined;
    var VectorStoreSingleton: TVectorStore | undefined;
    var ChatOllamaSingleton: TChatOllamaSingleton | undefined;
  }
}

export {};
