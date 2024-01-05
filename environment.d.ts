/* eslint no-var: 0 */

import type { TEmbeddingsSingleton } from '@/app/api/embed/embeddings';
import type { TVectorStore } from '@/app/api/embed/vectorStore';

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
