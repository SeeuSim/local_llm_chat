import { formatLoggerMessage, getLogger } from '@/lib/log';

import {
  getTextChunks,
  processPDFFiles,
  type TProcessedChunk,
} from '@/lib/models/embeddings/utils';
import VectorStoreSingleton from '@/lib/models/vectorStore';

const PATH = 'api/embed/documents';

export async function POST(req: Request) {
  const logger = getLogger(req);

  // 1. Parse payload
  const payload = await req.formData();
  logger.info(
    {
      req,
      params: payload,
    },
    formatLoggerMessage(PATH, 'Starting embedding', 'parseInput')
  );

  // 2. Parse and split chunks
  const roomId = payload.get('roomId') as string | null;
  const files = payload.getAll('files') as Array<File>;
  if (!roomId || roomId === null || !files || !Array.isArray(files)) {
    // Validate files, roomId
    return new Response(JSON.stringify({ message: 'Invalid Params' }), { status: 400 });
  }
  const documents = await processPDFFiles(files, roomId);
  const chunks = await getTextChunks(documents);
  logger.info(
    {
      req,
    },
    formatLoggerMessage(PATH, 'Chunking completed', 'splitChunks')
  );

  // 3. Insert into vector store.
  const vectorStore = await VectorStoreSingleton.getInstance();
  const successfulInserts: string[] = [];
  const retries: TProcessedChunk[][] = [];
  for (const currentDocument of chunks) {
    if (currentDocument.length === 0) {
      continue;
    }
    const { roomId, title } = currentDocument[0].metadata;
    try {
      // TODO: Add custom ON CONFLICT sql statement.
      await vectorStore.addDocuments(currentDocument);
      successfulInserts.push(`${roomId}-${title}`);
    } catch (error) {
      retries.push(currentDocument);
    }
  }
  const errors: any[] = [];
  for (const duplicateDocument of retries) {
    if (duplicateDocument.length === 0) {
      continue;
    }
    const { roomId, title } = duplicateDocument[0].metadata;
    try {
      await vectorStore.delete({ filter: { roomId, title } });
      await vectorStore.addDocuments(duplicateDocument);
      successfulInserts.push(`${roomId}-${title}`);
    } catch (error) {
      errors.push([`${roomId}-${title}`, error]);
    }
  }
  if (errors.length > 0) {
    logger.error(
      {
        req,
        error: errors,
        results: {
          successfulInserts,
        },
      },
      formatLoggerMessage(PATH, 'These errors occurred.')
    );
    return new Response(
      JSON.stringify({
        message: 'These insertions and errors occurred',
        errors,
        successfulInserts,
      }),
      {
        status: 500,
      }
    );
  }
  logger.info(
    {
      req,
      results: {
        successfulInserts,
      },
    },
    formatLoggerMessage(PATH, 'Documents inserted successfully.')
  );
  return new Response(
    JSON.stringify({
      message: 'Documents inserted successfully',
      successfulInserts,
    }),
    { status: 200 }
  );
}
