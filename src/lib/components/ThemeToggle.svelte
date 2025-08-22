<script>
	import { onMount } from "svelte";
	import { fly } from "svelte/transition";

	let mounted = false;
	let currentTheme = "skeleton";
	let isOpen = false;

	// Skeleton.dev's exact theme configuration
	const themes = [
		{
			name: "skeleton",
			label: "Skeleton",
			icon: "💀",
			colors: ["#0ea5e9", "#84cc16"],
		},
		{
			name: "wintry",
			label: "Wintry",
			icon: "🌨️",
			colors: ["#0ea5e9", "#06b6d4"],
		},
		{
			name: "modern",
			label: "Modern",
			icon: "🤖",
			colors: ["#6366f1", "#8b5cf6"],
		},
		{
			name: "rocket",
			label: "Rocket",
			icon: "🚀",
			colors: ["#f97316", "#ef4444"],
		},
		{
			name: "seafoam",
			label: "Seafoam",
			icon: "🧜‍♀️",
			colors: ["#10b981", "#06b6d4"],
		},
		{
			name: "vintage",
			label: "Vintage",
			icon: "📻",
			colors: ["#d97706", "#dc2626"],
		},
		{
			name: "sahara",
			label: "Sahara",
			icon: "🏜️",
			colors: ["#f59e0b", "#f97316"],
		},
		{
			name: "hamlindigo",
			label: "Hamlindigo",
			icon: "🎭",
			colors: ["#8b5cf6", "#a855f7"],
		},
		{
			name: "gold-nouveau",
			label: "Gold Nouveau",
			icon: "✨",
			colors: ["#f59e0b", "#eab308"],
		},
		{
			name: "crimson",
			label: "Crimson",
			icon: "🌹",
			colors: ["#dc2626", "#ef4444"],
		},
	];

	onMount(() => {
		mounted = true;
		currentTheme =
			document.documentElement.getAttribute("data-theme") || "modern";
	});

	function setTheme(themeName) {
		currentTheme = themeName;
		document.documentElement.setAttribute("data-theme", themeName);
		document.body.setAttribute("data-theme", themeName);
		isOpen = false;
	}

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function handleClickOutside(event) {
		if (!event.target.closest(".theme-selector")) {
			isOpen = false;
		}
	}

	$: if (mounted) {
		if (isOpen) {
			document.addEventListener("click", handleClickOutside);
		} else {
			document.removeEventListener("click", handleClickOutside);
		}
	}

	$: currentThemeData =
		themes.find((t) => t.name === currentTheme) || themes[0];
</script>

{#if mounted}
	<div class="theme-selector relative">
		<button
			class="btn btn-sm variant-ghost-surface"
			on:click={toggleDropdown}
			title="Theme"
		>
			<span class="text-base">{currentThemeData.icon}</span>
		</button>

		{#if isOpen}
			<div
				class="card p-4 w-60 shadow-xl absolute top-full right-0 mt-2 z-[999]"
				transition:fly={{ y: -10, duration: 150 }}
			>
				<div class="space-y-4">
					<header class="text-center">
						<h6 class="h6">Themes</h6>
					</header>
					<nav class="list-nav">
						<ul>
							{#each themes as theme}
								<li>
									<button
										class="option w-full {currentTheme ===
										theme.name
											? '!variant-filled-primary'
											: ''}"
										on:click={() => setTheme(theme.name)}
									>
										<span
											class="flex-auto text-left flex items-center gap-4"
										>
											<span class="text-lg"
												>{theme.icon}</span
											>
											<span class="flex-auto"
												>{theme.label}</span
											>
										</span>
										<div class="flex gap-1">
											{#each theme.colors as color}
												<div
													class="w-4 h-4 rounded-full border border-surface-400-500-token"
													style="background-color: {color};"
												></div>
											{/each}
										</div>
									</button>
								</li>
							{/each}
						</ul>
					</nav>
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	.option {
		@apply flex items-center space-x-4 px-4 py-3 rounded-token text-sm;
		@apply hover:variant-soft-primary;
		@apply focus:variant-soft-primary focus:outline-none;
		@apply transition-colors duration-150;
	}
</style>
