'use client';

'use client';

import { roomIDContext } from '@/lib/contexts/chatRoomIdContext';
import { useQuery } from '@tanstack/react-query';
import { useContext, useState } from 'react';

const Room = () => {
  const { roomId } = useContext(roomIDContext);

  const { data: initialMessages } = useQuery({ queryKey: ['chat', 'messages', roomId] });

  const [messages, setMessages] = useState([]);

  return <div />;
};

export default Room;
