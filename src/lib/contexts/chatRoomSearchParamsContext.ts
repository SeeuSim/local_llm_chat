'use client';

import { createContext } from 'react';

interface IRoomIDSearchParams {
  roomId: string;
}

export const searchParamsRoomIdContext = createContext<IRoomIDSearchParams>({
  roomId: '',
});
