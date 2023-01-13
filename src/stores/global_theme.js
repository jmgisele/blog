import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const theme = writable((browser && window.localStorage.getItem('theme')) || 'dark-theme');

theme.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('theme', value);
	}
});

export function toggleTheme(e) {
	e.target.checked ? theme.set('light-theme') : theme.set('dark-theme');
}
