import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';

import { PgVectorStoreConfig } from '@/lib/db/vectorStoreConfig';
import EmbeddingsSingleton from './embeddings';

const getVectorStore = () =>
  class VectorStoreSingleton {
    static instance: PGVectorStore | null = null;
    static async getInstance() {
      if (this.instance === null) {
        const embeddings = await EmbeddingsSingleton.getInstance();
        this.instance = await PGVectorStore.initialize(embeddings, PgVectorStoreConfig);
      }
      return this.instance;
    }
  };

export type TVectorStore = ReturnType<typeof getVectorStore>;

let VectorStore: TVectorStore;

if (process.env.NODE_ENV !== 'production') {
  if (!global.VectorStoreSingleton) {
    global.VectorStoreSingleton = getVectorStore();
  }
  VectorStore = global.VectorStoreSingleton;
} else {
  VectorStore = getVectorStore();
}

export default VectorStore;
