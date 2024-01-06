import { OllamaEmbeddings } from 'langchain/embeddings/ollama';

const getOllamaEmbeddings = () =>
  class OllamaEmbeddingSingleton {
    static instance: OllamaEmbeddings | null = null;
    static async getInstance() {
      if (this.instance === null) {
        this.instance = new OllamaEmbeddings({
          model: 'mistral',
          requestOptions: {
            useMMap: true,
            numThread: 6,
            numGpu: 1,
          },
        });
      }
      return this.instance;
    }
  };

export type TOllamaEmbeddingSingleton = ReturnType<typeof getOllamaEmbeddings>;

let OllamaEmbeddingSingleton: TOllamaEmbeddingSingleton;

if (process.env.NODE_ENV !== 'production') {
  if (!global.OllamaEmbeddingSingleton) {
    global.OllamaEmbeddingSingleton = getOllamaEmbeddings();
  }
  OllamaEmbeddingSingleton = global.OllamaEmbeddingSingleton;
} else {
  OllamaEmbeddingSingleton = getOllamaEmbeddings();
}
export default OllamaEmbeddingSingleton;
