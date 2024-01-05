import { formatLoggerMessage, getLogger } from '@/lib/log';

import EmbeddingsSingleton from '@/lib/models/embeddings';

const PATH = 'api/embed';

export async function POST(req: Request) {
  const logger = getLogger(req);
  logger.info(
    {
      req,
    },
    formatLoggerMessage(PATH, 'Invocation starting', process.env.NODE_ENV)
  );

  const model = await EmbeddingsSingleton.getInstance();
  const result = await model.embedQuery('Hello world!');

  logger.info(
    {
      req,
      params: result.length,
    },
    formatLoggerMessage(PATH, 'Embeddings generated successfully')
  );

  return Response.json({ status: 200, message: 'OK' });
}
