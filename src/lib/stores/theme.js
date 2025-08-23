import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Default settings - matching skeleton.dev defaults
const defaultTheme = 'skeleton';
const defaultDarkMode = true;

// Create stores
export const currentTheme = writable(defaultTheme);
export const darkMode = writable(defaultDarkMode);

// Initialize theme system
export function initializeTheme() {
	if (!browser) return;

	// Get saved preferences or use defaults
	const savedTheme = localStorage.getItem('skeleton-theme') || defaultTheme;
	const savedDarkMode = localStorage.getItem('skeleton-dark-mode');
	const isDark = savedDarkMode !== null ? savedDarkMode === 'true' : defaultDarkMode;

	// Set initial values
	currentTheme.set(savedTheme);
	darkMode.set(isDark);

	// Apply theme immediately
	applyTheme(savedTheme, isDark);
}

// Apply theme to DOM - exactly like skeleton.dev
export function applyTheme(theme, isDark) {
	if (!browser) return;

	const html = document.documentElement;
	const body = document.body;

	// Set theme attribute on both html and body
	html.setAttribute('data-theme', theme);
	body.setAttribute('data-theme', theme);

	// Set dark mode class - skeleton.dev uses 'dark' class on html
	if (isDark) {
		html.classList.add('dark');
		html.classList.remove('light');
	} else {
		html.classList.add('light');
		html.classList.remove('dark');
	}

	// Save to localStorage
	localStorage.setItem('skeleton-theme', theme);
	localStorage.setItem('skeleton-dark-mode', isDark.toString());
}

// Set theme
export function setTheme(theme) {
	if (!browser) return;

	currentTheme.set(theme);
	
	// Get current dark mode state and apply theme
	let currentDarkMode;
	const unsubscribe = darkMode.subscribe(value => {
		currentDarkMode = value;
	});
	unsubscribe();
	
	applyTheme(theme, currentDarkMode);
}

// Toggle dark/light mode
export function toggleDarkMode() {
	if (!browser) return;

	darkMode.update(isDark => {
		const newDarkMode = !isDark;
		
		// Get current theme and apply with new mode
		let currentThemeValue;
		const unsubscribe = currentTheme.subscribe(value => {
			currentThemeValue = value;
		});
		unsubscribe();
		
		applyTheme(currentThemeValue, newDarkMode);
		
		return newDarkMode;
	});
}