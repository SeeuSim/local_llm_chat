'use client';

import { useEffect, useState } from 'react';

const MEDIA_QUERY = '(prefers-color-scheme: dark)';
const MODE_KEY = 'darkMode';

export const useDarkMode = () => {
  // For toggle UI element props only
  const [darkModePreference, _setDarkModePreference] = useState('system');

  const setDarkModePreference = (newDarkModePreference: string) => {
    localStorage.setItem(MODE_KEY, newDarkModePreference);
    _setDarkModePreference(newDarkModePreference);
    if (
      (document && newDarkModePreference === 'light') ||
      (newDarkModePreference === 'system' && window && !window.matchMedia(MEDIA_QUERY).matches)
    ) {
      document.documentElement.classList.remove('dark');
    } else if (
      (document && newDarkModePreference === 'dark') ||
      (newDarkModePreference === 'system' && window && window.matchMedia(MEDIA_QUERY).matches)
    ) {
      document.documentElement.classList.add('dark');
    }
  };

  useEffect(() => {
    const darkModePreference = localStorage.getItem(MODE_KEY);
    setDarkModePreference(darkModePreference === null ? 'system' : darkModePreference);
    if (window) {
      const callback = (event: MediaQueryListEvent) => {
        if (event.matches && darkModePreference === 'system') {
          document.documentElement.classList.add('dark');
        } else if (!event.matches && darkModePreference === 'system') {
          document.documentElement.classList.remove('dark');
        }
      };
      window.matchMedia(MEDIA_QUERY).addEventListener('change', callback);

      return () => window.matchMedia(MEDIA_QUERY).removeEventListener('change', callback);
    }
  }, []);

  return {
    darkModePreference,
    setDarkModePreference,
  };
};
