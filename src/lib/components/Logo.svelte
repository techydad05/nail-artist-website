<script>
	import { onMount } from "svelte";

	let currentTheme = "skeleton";
	let mounted = false;

	// Theme color mappings (matches our theme selector)
	const themeColors = {
		skeleton: {
			primary: "#0ea5e9",
			secondary: "#84cc16",
			accent: "#06b6d4",
		},
		wintry: { primary: "#0ea5e9", secondary: "#06b6d4", accent: "#0891b2" },
		modern: { primary: "#6366f1", secondary: "#8b5cf6", accent: "#a855f7" },
		rocket: { primary: "#f97316", secondary: "#ef4444", accent: "#f59e0b" },
		seafoam: {
			primary: "#10b981",
			secondary: "#06b6d4",
			accent: "#059669",
		},
		vintage: {
			primary: "#d97706",
			secondary: "#dc2626",
			accent: "#b45309",
		},
		sahara: { primary: "#f59e0b", secondary: "#f97316", accent: "#d97706" },
		hamlindigo: {
			primary: "#8b5cf6",
			secondary: "#a855f7",
			accent: "#9333ea",
		},
		"gold-nouveau": {
			primary: "#f59e0b",
			secondary: "#eab308",
			accent: "#d97706",
		},
		crimson: {
			primary: "#dc2626",
			secondary: "#ef4444",
			accent: "#b91c1c",
		},
	};

	export let size = "large"; // 'large', 'medium', 'small'
	export let showBackground = true;

	onMount(() => {
		mounted = true;
		currentTheme =
			document.documentElement.getAttribute("data-theme") || "skeleton";

		// Listen for theme changes
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (
					mutation.type === "attributes" &&
					mutation.attributeName === "data-theme"
				) {
					currentTheme =
						document.documentElement.getAttribute("data-theme") ||
						"skeleton";
				}
			});
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-theme"],
		});

		return () => observer.disconnect();
	});

	$: colors = themeColors[currentTheme] || themeColors.skeleton;

	// Size configurations
	$: sizeConfig = {
		large: {
			container: "p-8 sm:p-10",
			bottle: "w-32 h-32",
			text: "text-6xl",
			subtext: "text-xs"
		},
		medium: {
			container: "p-6",
			bottle: "w-24 h-24",
			text: "text-6xl",
			subtext: "text-xs"
		},
		small: {
			container: "p-2 sm:p-3",
			bottle: "w-12 h-12 sm:w-16 sm:h-16",
			text: "text-6xl",
			subtext: "text-xs"
		},
	}[size];
</script>

{#if mounted}
	<div
		class="{showBackground
			? 'bg-surface-50-900-token shadow-lg'
			: ''} {sizeConfig.container} rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 {showBackground
			? 'hover:shadow-2xl'
			: ''}"
	>
		<div class="flex justify-center items-center">
			<!-- SVG Nail Polish Bottle -->
			<div class="{sizeConfig.bottle} -mr-3 z-10 flex-shrink-0">
				<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<linearGradient
							id="polishGradient-{currentTheme}"
							x1="0%"
							y1="0%"
							x2="100%"
							y2="100%"
						>
							<stop
								offset="0%"
								style="stop-color:{colors.secondary};"
								class="transition-colors duration-500"
							/>
							<stop
								offset="50%"
								style="stop-color:{colors.primary};"
								class="transition-colors duration-500"
							/>
							<stop
								offset="100%"
								style="stop-color:{colors.accent};"
								class="transition-colors duration-500"
							/>
						</linearGradient>
						<radialGradient
							id="capGradient-{currentTheme}"
							cx="50%"
							cy="50%"
							r="50%"
							fx="50%"
							fy="50%"
						>
							<stop offset="0%" style="stop-color:#6B7280;" />
							<stop offset="70%" style="stop-color:#374151;" />
							<stop offset="95%" style="stop-color:#111827;" />
						</radialGradient>
						<linearGradient
							id="glassShine-{currentTheme}"
							x1="0%"
							y1="0%"
							x2="100%"
							y2="0%"
						>
							<stop
								offset="0%"
								style="stop-color:white; stop-opacity:0.6"
							/>
							<stop
								offset="100%"
								style="stop-color:white; stop-opacity:0"
							/>
						</linearGradient>
						<!-- Filter for the ground shadow -->
						<filter id="groundShadow-{currentTheme}">
							<feGaussianBlur
								in="SourceAlpha"
								stdDeviation="3"
								result="blur"
							/>
							<feOffset
								in="blur"
								dx="0"
								dy="2"
								result="offsetBlur"
							/>
							<feMerge>
								<feMergeNode in="offsetBlur" />
								<feMergeNode in="SourceGraphic" />
							</feMerge>
						</filter>
					</defs>

					<!-- Ground Shadow Ellipse -->
					<ellipse
						cx="50"
						cy="95"
						rx="25"
						ry="4"
						fill="#000"
						fill-opacity="0.25"
						filter="url(#groundShadow-{currentTheme})"
					/>

					<!-- Bottle Group -->
					<g>
						<!-- Cap -->
						<rect
							x="35"
							y="0"
							width="30"
							height="40"
							rx="4"
							fill="url(#capGradient-{currentTheme})"
						/>

						<!-- Bottle Neck -->
						<rect
							x="40"
							y="40"
							width="20"
							height="5"
							fill="#B0B4BA"
						/>

						<!-- Bottle Body -->
						<rect
							x="25"
							y="45"
							width="50"
							height="50"
							rx="8"
							fill="url(#polishGradient-{currentTheme})"
							class="transition-colors duration-500"
						/>
					</g>

					<!-- Cap Highlight -->
					<path
						d="M 38 5 C 50 5, 50 5, 62 5"
						fill="none"
						stroke="white"
						stroke-width="2"
						stroke-linecap="round"
						stroke-opacity="0.3"
					/>

					<!-- Glass Highlight -->
					<path
						d="M 32 52 C 40 65, 38 80, 33 92"
						fill="none"
						stroke="url(#glassShine-{currentTheme})"
						stroke-width="5"
						stroke-linecap="round"
					/>
					<path
						d="M 68 52 C 65 60, 65 70, 68 80"
						fill="none"
						stroke="white"
						stroke-width="2"
						stroke-linecap="round"
						stroke-opacity="0.2"
					/>
				</svg>
			</div>

			<!-- Text Content -->
			<div class="text-center">
				<h2
					class="logo-script {sizeConfig.text} text-surface-900-50-token transition-colors duration-500 leading-none"
					style="text-shadow: 2px 3px 4px rgba(var(--color-surface-400) / 0.4);"
				>
					Fallon's
				</h2>
				<p
					class="logo-sans font-semibold {sizeConfig.subtext} text-surface-600-300-token uppercase transition-colors duration-500 -mt-1"
					style="letter-spacing: {sizeConfig.letterSpacing};"
				>
					Flawless Features
				</p>
			</div>
		</div>
	</div>
{/if}
