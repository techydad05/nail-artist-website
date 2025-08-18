import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Theme store for managing light/dark mode
export const theme = writable('nail-artist');

// Initialize theme from localStorage or default
if (browser) {
	const storedTheme = localStorage.getItem('theme') || 'nail-artist';
	theme.set(storedTheme);
	
	// Apply theme to document immediately with higher priority
	document.documentElement.setAttribute('data-theme', storedTheme);
	document.body.setAttribute('data-theme', storedTheme);
	document.documentElement.style.setProperty('--color-primary-500', '236 72 153');
	document.documentElement.style.setProperty('--color-primary-600', '212 65 138');
}

// Subscribe to theme changes and persist to localStorage
theme.subscribe((value) => {
	if (browser) {
		localStorage.setItem('theme', value);
		document.documentElement.setAttribute('data-theme', value);
		document.body.setAttribute('data-theme', value);
	}
});

// Theme switching functions
export function toggleTheme() {
	theme.update(current => {
		return current === 'nail-artist' ? 'skeleton' : 'nail-artist';
	});
}

export function setTheme(newTheme) {
	theme.set(newTheme);
}