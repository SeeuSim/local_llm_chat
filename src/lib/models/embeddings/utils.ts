import type { Document } from 'langchain/document';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

type TMetadata = {
  title: string;
  fileType: string;
  totalPages: number;
  roomKeys: {
    [key: string]: boolean;
  };
};

export type TChunkMetadata = Omit<TMetadata, 'totalPages'> & { splitNumber: number };

type TProcessedDocument = Document<TMetadata>;

export type TProcessedChunk = Document<TChunkMetadata>;

/**
 *
 * @param files An array of `File` instances, one for each PDF file uploaded.
 * @returns An array of `Document` instances, one for each PDF file.
 */
export const processPDFFiles: (
  files: Array<File>,
  roomId: string
) => Promise<TProcessedDocument[]> = async (files, roomId) => {
  return (
    await Promise.all(
      files.map((file) =>
        new PDFLoader(file, { splitPages: false }).load().then((docs) =>
          docs.map((doc) => ({
            ...doc,
            metadata: {
              title: file.name,
              fileType: file.type,
              totalPages: doc['metadata']['pdf']['totalPages'],
              roomKeys: {
                [roomId]: true,
              },
            },
          }))
        )
      )
    )
  ).flatMap((files) => files);
};

/**
 *
 * @param documents
 * @returns A nested array of chunks, with each nested array pertaining to each input document.
 */
export const getTextChunks: (
  documents: Array<TProcessedDocument>
) => Promise<Array<Array<TProcessedChunk>>> = async (documents) => {
  const splitter = new RecursiveCharacterTextSplitter({ chunkOverlap: 150, chunkSize: 1500 });
  const splits = await Promise.all(
    documents.map((document) =>
      splitter.splitDocuments([document]).then((splits) =>
        splits.map((split, index) => ({
          ...split,
          metadata: {
            title: document.metadata.title,
            fileType: document.metadata.fileType,
            splitNumber: index + 1,
            roomKeys: document.metadata.roomKeys,
          },
        }))
      )
    )
  );
  return splits;
};
