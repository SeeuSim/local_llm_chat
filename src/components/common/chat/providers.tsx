'use client';
import { searchParamsRoomIdContext } from '@/lib/contexts/chatRoomSearchParamsContext';
import { type IChatRoomContext, chatRoomContext } from '@/lib/contexts/chatRoomContext';

export const RoomIDProvider = ({
  roomId,
  children,
}: {
  roomId: string;
  children?: React.ReactNode;
}) => {
  return (
    <searchParamsRoomIdContext.Provider value={{ roomId }}>
      {children}
    </searchParamsRoomIdContext.Provider>
  );
};

export const ChatRoomMessagesProvider = ({
  children,
  ...props
}: { children?: React.ReactNode } & IChatRoomContext) => (
  <chatRoomContext.Provider value={props}>{children}</chatRoomContext.Provider>
);
