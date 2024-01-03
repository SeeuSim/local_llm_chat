import { ChatMessage } from '@/components/common/chat/ChatMessage';
import ChatLayout from '@/components/layouts/chat-layout';

export default function Home() {
  return (
    <ChatLayout>
      <div className='flex flex-col gap-4'>
        <>
          {Array(10)
            .fill(['user', 'system'] as const)
            .flatMap((v) => [...v])
            .map((v, index) => (
              <ChatMessage key={index} role={v} content='sjfndkjfgndfkvndkjb dnfkjbndfkjn' />
            ))}
        </>
      </div>
    </ChatLayout>
  );
}
