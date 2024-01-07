'use client';

import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';

const Room = () => {
  const {
    mutate: query,
    isPending,
    isSuccess,
    isError,
  } = useMutation<any>({
    mutationKey: ['Summarise'],
    mutationFn: async () => {
      return fetch('/api/summarise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage: 'Hello World',
          systemMessage: "Go away - I don't want to talk to you",
        }),
      });
    },
  });

  return (
    <div>
      <Button onClick={() => query()}>
        <span>Send request</span>
      </Button>
    </div>
  );
};

export default Room;
