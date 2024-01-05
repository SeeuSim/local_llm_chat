/* eslint no-var: 0 */

import type { TEmbeddingsSingleton } from '@/lib/models/embeddings';
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
    }
  }
  namespace globalThis {
    var EmbeddingSingleton: TEmbeddingsSingleton | undefined;
    var VectorStoreSingleton: TVectorStore | undefined;
  }
}

export {};
