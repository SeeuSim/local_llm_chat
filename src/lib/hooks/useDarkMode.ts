'use client';

import { useEffect, useState } from 'react';

const MODE_KEY = 'darkMode';
const MEDIA_QUERY = '(prefers-color-scheme: dark)';

export const useDarkMode = () => {
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
    if (darkModePreference === null || darkModePreference === 'system') {
      setDarkModePreference('system');
      if (window) {
        const callback = (event: MediaQueryListEvent) => {
          if (event.matches) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        };
        window.matchMedia(MEDIA_QUERY).addEventListener('change', callback);

        return () => window.matchMedia(MEDIA_QUERY).removeEventListener('change', callback);
      }
    } else {
      setDarkModePreference(darkModePreference);
    }
  }, []);

  return {
    darkModePreference,
    setDarkModePreference,
  };
};
