'use client';

import { createContext } from 'react';

interface IDarkModeContextState {
  darkMode: string;
}

export const DarkModeContext = createContext<IDarkModeContextState>({
  darkMode: 'dark',
});
