import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';

const getHuggingFaceEmbeddings = () =>
  class HuggingFaceEmbeddingSingleton {
    // static model = 'Xenova/all-MiniLM-L6-v2'; // Dim: 384  | Fastest, poorest retrieval
    static model = 'Xenova/bge-small-en-v1.5'; // Dim: 384 | Second fastest, better retrieval
    // static model = 'Xenova/gte-base'; // Dim: 768 | Slowest, best retrieval

    static instance: HuggingFaceTransformersEmbeddings | null = null;
    static async getInstance() {
      if (this.instance === null) {
        this.instance = new HuggingFaceTransformersEmbeddings({
          modelName: this.model,
        });
      }
      return this.instance;
    }
  };

export type THuggingFaceEmbeddingSingleton = ReturnType<typeof getHuggingFaceEmbeddings>;

let HuggingFaceEmbeddingSingleton: THuggingFaceEmbeddingSingleton;

if (process.env.NODE_ENV !== 'production') {
  if (!global.HuggingFaceEmbeddingSingleton) {
    global.HuggingFaceEmbeddingSingleton = getHuggingFaceEmbeddings();
  }
  HuggingFaceEmbeddingSingleton = global.HuggingFaceEmbeddingSingleton;
} else {
  HuggingFaceEmbeddingSingleton = getHuggingFaceEmbeddings();
}

export default HuggingFaceEmbeddingSingleton;
