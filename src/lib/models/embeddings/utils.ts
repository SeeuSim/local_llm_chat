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
) => Promise<TProcessedDocument[][]> = async (files, roomId) => {
  return await Promise.all(
    files.map((file) =>
      new PDFLoader(file, { splitPages: file.size > 500_000 }).load().then((docs) => {
        console.log(docs);
        return docs.map((doc) => ({
          ...doc,
          metadata: {
            title: file.name,
            fileType: file.type,
            totalPages: doc['metadata']['pdf']['totalPages'],
            roomKeys: {
              [roomId]: true,
            },
          },
        }));
      })
    )
  );
};

/**
 *
 * @param files
 * @returns A nested array of chunks, with each nested array pertaining to each input document.
 */
export const getTextChunks: (
  documents: Array<Array<Document>>
) => Promise<Array<Array<TProcessedChunk>>> = async (files) => {
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
  const splits = await Promise.all(
    files.map((pages) =>
      // 2D Array of splits
      Promise.all(
        pages.map(
          (page) =>
            splitter.splitDocuments([page]).then((splits) =>
              splits.map((split) => ({
                ...split,
                metadata: {
                  title: page.metadata.title,
                  fileType: page.metadata.fileType,
                  roomKeys: page.metadata.roomKeys,
                },
              }))
            )
          // 1D Array of splits
        )
      ).then((res) =>
        res
          .flatMap((pageSplits) => pageSplits)
          .map((split, splitIndex) => ({
            ...split,
            metadata: { ...split.metadata, splitNumber: splitIndex + 1 },
          }))
      )
    )
  );
  return splits;
};
