'use client';

import { useEffect, useState } from 'react';

const MODE_KEY = 'darkMode';
const MEDIA_QUERY = '(prefers-color-scheme: dark)';

export const useToggleDarkMode = () => {
	const [darkModePreference, setDarkModePreference] = useState('system');

	const toggleDarkMode = (newDarkModePreference: string) => {
		localStorage.setItem(MODE_KEY, newDarkModePreference);
		setDarkModePreference(newDarkModePreference);
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
			toggleDarkMode('system');
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
			toggleDarkMode(darkModePreference);
		}
	}, []);

	return {
		darkModePreference,
		toggleDarkMode,
	};
};
