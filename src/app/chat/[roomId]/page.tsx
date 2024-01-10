import Room from '@/components/common/chat/Room';
import { RoomIDProvider } from '@/components/common/chat/providers';
import ChatLayout from '@/components/layouts/chat-layout';

export default function ChatRoom({ params: { roomId } }: { params: { roomId: string } }) {
  return (
    <RoomIDProvider {...{ roomId }}>
      <ChatLayout>
        <Room />
      </ChatLayout>
    </RoomIDProvider>
  );
}
