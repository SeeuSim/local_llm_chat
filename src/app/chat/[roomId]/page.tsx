'use client';

import { ChatMessage } from '@/components/common/chat/ChatMessage';
import { RoomIDProvider } from '@/components/common/chat/providers';
import ChatLayout from '@/components/layouts/chat-layout';
import { useEffect, useRef } from 'react';

export default function ChatRoom({ params: { roomId } }: { params: { roomId: string } }) {
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastMessageRef.current !== null) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <RoomIDProvider {...{ roomId }}>
      <ChatLayout>
        <>
          {Array(10)
            .fill(['user', 'system'] as const)
            .flatMap((v) => [...v])
            .map((v, index) => (
              <ChatMessage key={index} role={v} content='sjfndkjfgndfkvndkjb dnfkjbndfkjn' />
            ))}
          <div ref={lastMessageRef} className='block h-0 w-0' />
        </>
      </ChatLayout>
    </RoomIDProvider>
  );
}
