import { RoomIDProvider } from '@/components/common/chat/providers';
import ChatLayout from '@/components/layouts/chat-layout';

export default function Home() {
  return (
    <RoomIDProvider roomId=''>
      <ChatLayout />
    </RoomIDProvider>
  );
}
