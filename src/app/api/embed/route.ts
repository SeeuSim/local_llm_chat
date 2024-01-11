import { NextRequest, NextResponse } from 'next/server';

import { formatLoggerMessage, getLogger } from '@/lib/log';

import HuggingFaceEmbeddingSingleton from '@/lib/models/embeddings/huggingfaceEmbeddings';
// import OllamaEmbeddingSingleton from '@/lib/models/ollamaEmbeddings';

const PATH = 'api/embed';

export async function POST(req: NextRequest) {
  const logger = getLogger(req);
  logger.info(
    {
      req,
    },
    formatLoggerMessage(PATH, 'Invocation starting', process.env.NODE_ENV)
  );

  const model = await HuggingFaceEmbeddingSingleton.getInstance();
  // const model = await OllamaEmbeddingSingleton.getInstance();
  const result = await model.embedQuery('Hello world!');

  logger.info(
    {
      req,
      result: {
        length: result.length,
      },
    },
    formatLoggerMessage(PATH, 'Embeddings generated successfully')
  );

  return NextResponse.json({ status: 200, message: 'OK' });
}
