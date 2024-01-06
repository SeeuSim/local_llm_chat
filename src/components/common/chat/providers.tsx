'use client';
import { roomIDContext } from '@/lib/contexts/chatRoomIdContext';

export const RoomIDProvider = ({
  roomId,
  children,
}: {
  roomId: string;
  children?: React.ReactNode;
}) => {
  return <roomIDContext.Provider value={{ roomId }}>{children}</roomIDContext.Provider>;
};
