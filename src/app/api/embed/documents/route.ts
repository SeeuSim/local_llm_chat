import { NextRequest, NextResponse } from 'next/server';

import { formatLoggerMessage, getLogger } from '@/lib/log';

import { getTextChunks, processPDFFiles } from '@/lib/models/embeddings/utils';
import VectorStoreSingleton from '@/lib/models/vectorStore';

const PATH = 'api/embed/documents';

export async function POST(req: NextRequest) {
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
    return new NextResponse(JSON.stringify({ message: 'Invalid Params' }), { status: 400 });
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
  const errors: string[] = [];
  for (const currentDocument of chunks) {
    if (currentDocument.length === 0) {
      continue;
    }
    const { title } = currentDocument[0].metadata;
    try {
      // TODO: Add custom ON CONFLICT sql statement.
      await vectorStore.addDocuments(currentDocument);
      successfulInserts.push(`${title}`);
    } catch (error) {
      errors.push(currentDocument[0].metadata.title);
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
    return new NextResponse(
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
  return new NextResponse(
    JSON.stringify({
      message: 'Documents inserted successfully',
      successfulInserts,
    }),
    { status: 200 }
  );
}
