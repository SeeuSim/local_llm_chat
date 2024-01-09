'use client';
import { roomIDContext } from '@/lib/contexts/chatRoomIdContext';
import {
  type IChatRoomMessagesContext,
  chatRoomMessagesContext,
} from '@/lib/contexts/chatRoomMessagesContext';

export const RoomIDProvider = ({
  roomId,
  children,
}: {
  roomId: string;
  children?: React.ReactNode;
}) => {
  return <roomIDContext.Provider value={{ roomId }}>{children}</roomIDContext.Provider>;
};

export const ChatRoomMessagesProvider = ({
  children,
  ...props
}: { children?: React.ReactNode } & IChatRoomMessagesContext) => (
  <chatRoomMessagesContext.Provider value={props}>{children}</chatRoomMessagesContext.Provider>
);
