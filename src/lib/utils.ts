import type { IterableReadableStream } from '@langchain/core/utils/stream';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function iteratorToStream<T>(iterator: Promise<IterableReadableStream<T>>) {
  return iterator.then(
    (it) =>
      new ReadableStream({
        async pull(controller) {
          const { value, done } = await it.next();
          if (done) {
            controller.close();
          } else {
            controller.enqueue(value);
          }
        },
      })
  );
}
