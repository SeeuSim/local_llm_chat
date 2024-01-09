'use client';

import { createContext } from 'react';

interface IRoomIDState {
  roomId: string;
}

export const roomIDContext = createContext<IRoomIDState>({
  roomId: '',
});
