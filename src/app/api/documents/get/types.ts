import type { TChunkMetadata } from '@/lib/models/embeddings/utils';

export type TAPIDocumentsGetParams = Pick<TChunkMetadata, 'roomId'>;
