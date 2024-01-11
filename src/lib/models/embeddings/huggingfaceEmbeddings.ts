import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';

const getHuggingFaceEmbeddings = () =>
  class HuggingFaceEmbeddingSingleton {
    // static model = 'Xenova/gte-base';
    static model = 'Xenova/all-MiniLM-L6-v2';
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
