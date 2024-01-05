import { OllamaEmbeddings } from 'langchain/embeddings/ollama';

// For now, we use Ollama Embeddings.
// TODO: Figure out how to run onnx transformers embeddings on the server.
const getEmbeddings = () =>
  class EmbeddingPipelineSingleton {
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

export type TEmbeddingsSingleton = ReturnType<typeof getEmbeddings>;

let EmbeddingsSingleton: TEmbeddingsSingleton;

if (process.env.NODE_ENV !== 'production') {
  if (!global.EmbeddingSingleton) {
    global.EmbeddingSingleton = getEmbeddings();
  }
  EmbeddingsSingleton = global.EmbeddingSingleton;
} else {
  EmbeddingsSingleton = getEmbeddings();
}
export default EmbeddingsSingleton;
