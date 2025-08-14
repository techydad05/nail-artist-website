<script>
	import { theme, toggleTheme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	
	let mounted = false;
	let isDark = false;
	
	onMount(() => {
		mounted = true;
		// Check if we're in dark mode
		isDark = document.documentElement.getAttribute('data-theme') === 'dark' || 
		         document.body.classList.contains('dark');
	});
	
	function handleToggle() {
		isDark = !isDark;
		if (isDark) {
			document.documentElement.setAttribute('data-theme', 'dark');
			document.body.classList.add('dark');
		} else {
			document.documentElement.setAttribute('data-theme', 'light');
			document.body.classList.remove('dark');
		}
	}
</script>

{#if mounted}
	<button
		class="btn btn-sm variant-ghost-surface p-2"
		on:click={handleToggle}
		title="Toggle theme"
		aria-label="Toggle between light and dark themes"
	>
		{#if isDark}
			<!-- Sun icon for switching to light theme -->
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
			</svg>
		{:else}
			<!-- Moon icon for switching to dark theme -->
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
			</svg>
		{/if}
	</button>
{/if}