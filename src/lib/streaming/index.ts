import type { IterableReadableStream } from '@langchain/core/utils/stream';
import type { Callbacks } from '@langchain/core/callbacks/manager';

export function iteratorToStream<T>(iterator: IterableReadableStream<T>) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

export const getStreamingUtils = () => {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const callbacks: Callbacks = [
    {
      async handleLLMEnd() {
        await writer.ready;
        await writer.close();
      },
    },
    {
      handleLLMNewToken: async (token, _idx, _runId, _parentRunId) => {
        await writer.ready;
        await writer.write(encoder.encode(token));
      },
    },
  ];

  return {
    callbacks,
    stream: stream.readable,
  };
};
