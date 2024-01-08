'use client';

import { useEffect, useRef } from 'react';

import Room from '@/components/common/chat/Room';
import { RoomIDProvider } from '@/components/common/chat/providers';
import ChatLayout from '@/components/layouts/chat-layout';

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
        <Room />
        <div ref={lastMessageRef} className='block h-0 w-0' />
      </ChatLayout>
    </RoomIDProvider>
  );
}
