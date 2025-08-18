<script>
	import { onMount } from 'svelte';
	
	let currentTheme = 'skeleton';
	let mounted = false;
	
	// Theme color mappings (matches our theme selector)
	const themeColors = {
		skeleton: { primary: '#0ea5e9', secondary: '#84cc16', accent: '#06b6d4' },
		wintry: { primary: '#0ea5e9', secondary: '#06b6d4', accent: '#0891b2' },
		modern: { primary: '#6366f1', secondary: '#8b5cf6', accent: '#a855f7' },
		rocket: { primary: '#f97316', secondary: '#ef4444', accent: '#f59e0b' },
		seafoam: { primary: '#10b981', secondary: '#06b6d4', accent: '#059669' },
		vintage: { primary: '#d97706', secondary: '#dc2626', accent: '#b45309' },
		sahara: { primary: '#f59e0b', secondary: '#f97316', accent: '#d97706' },
		hamlindigo: { primary: '#8b5cf6', secondary: '#a855f7', accent: '#9333ea' },
		'gold-nouveau': { primary: '#f59e0b', secondary: '#eab308', accent: '#d97706' },
		crimson: { primary: '#dc2626', secondary: '#ef4444', accent: '#b91c1c' }
	};
	
	onMount(() => {
		mounted = true;
		currentTheme = document.documentElement.getAttribute('data-theme') || 'skeleton';
		
		// Listen for theme changes
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
					currentTheme = document.documentElement.getAttribute('data-theme') || 'skeleton';
				}
			});
		});
		
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme']
		});
		
		return () => observer.disconnect();
	});
	
	$: colors = themeColors[currentTheme] || themeColors.skeleton;
</script>

{#if mounted}
	<div class="nail-mascot">
		<svg 
			width="200" 
			height="200" 
			viewBox="0 0 100 100" 
			class="transition-all duration-500 ease-in-out hover:scale-105 w-full h-auto max-w-[200px]"
		>
			<!-- Defs for gradients -->
			<defs>
				<linearGradient id="polishGradient" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" style="stop-color:{colors.secondary}; stop-opacity:1" />
					<stop offset="100%" style="stop-color:{colors.primary}; stop-opacity:1" />
				</linearGradient>
				<linearGradient id="capGradient" x1="0%" y1="0%" x2="100%" y2="0%">
					<stop offset="0%" style="stop-color:#4B5563; stop-opacity:1" />
					<stop offset="50%" style="stop-color:#1F2937; stop-opacity:1" />
					<stop offset="100%" style="stop-color:#4B5563; stop-opacity:1" />
				</linearGradient>
				<linearGradient id="glassShine" x1="0%" y1="0%" x2="100%" y2="0%">
					<stop offset="0%" style="stop-color:white; stop-opacity:0.5" />
					<stop offset="100%" style="stop-color:white; stop-opacity:0" />
				</linearGradient>
				<radialGradient id="backgroundGradient" cx="50%" cy="50%" r="50%">
					<stop offset="0%" style="stop-color:{colors.primary}; stop-opacity:0.1" />
					<stop offset="100%" style="stop-color:{colors.secondary}; stop-opacity:0.05" />
				</radialGradient>
			</defs>
			
			<!-- Background circle -->
			<circle cx="50" cy="50" r="45" fill="url(#backgroundGradient)" class="background-circle transition-colors duration-500"/>
			
			<!-- Decorative dots -->
			<circle cx="20" cy="25" r="1.5" fill={colors.primary} opacity="0.3" class="dot-1 transition-colors duration-500"/>
			<circle cx="80" cy="30" r="1" fill={colors.secondary} opacity="0.4" class="dot-2 transition-colors duration-500"/>
			<circle cx="15" cy="70" r="1.2" fill={colors.accent} opacity="0.3" class="dot-3 transition-colors duration-500"/>
			<circle cx="85" cy="75" r="0.8" fill={colors.primary} opacity="0.5" class="dot-4 transition-colors duration-500"/>
			
			<!-- Cap -->
			<rect x="35" y="0" width="30" height="40" rx="4" fill="url(#capGradient)" />
			
			<!-- Bottle Neck -->
			<rect x="40" y="40" width="20" height="5" fill="#D1D5DB" />
			
			<!-- Bottle Body -->
			<rect x="25" y="45" width="50" height="50" rx="8" fill="url(#polishGradient)" />
			
			<!-- Glass Highlight -->
			<path d="M 30 50 C 35 65, 35 80, 30 90" fill="none" stroke="url(#glassShine)" stroke-width="4" stroke-linecap="round"/>
		</svg>
	</div>
{/if}

<style>
	.nail-mascot {
		display: inline-block;
		filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.15));
	}
	
	.polish-liquid {
		animation: polish-shimmer 3s ease-in-out infinite alternate;
	}
	
	.bottle-shine {
		animation: shine-pulse 2s ease-in-out infinite;
	}
	
	.label {
		animation: label-float 4s ease-in-out infinite;
	}
	
	.drip {
		animation: drip-fall 3s ease-in-out infinite;
		transform-origin: top;
	}
	
	.sparkles {
		animation: sparkle-float 3s ease-in-out infinite;
	}
	
	.sparkle-1 {
		animation: sparkle-twinkle 1.5s ease-in-out infinite;
		transform-origin: center;
	}
	
	.sparkle-2 {
		animation: sparkle-twinkle 2s ease-in-out infinite 0.5s;
		transform-origin: center;
	}
	
	.sparkle-3 {
		animation: sparkle-twinkle 1.8s ease-in-out infinite 1s;
		transform-origin: center;
	}
	
	.sparkle-4 {
		animation: sparkle-twinkle 2.2s ease-in-out infinite 1.5s;
		transform-origin: center;
	}
	
	.background-circle {
		animation: background-pulse 4s ease-in-out infinite;
	}
	
	.dot-1 {
		animation: dot-float 3s ease-in-out infinite;
	}
	
	.dot-2 {
		animation: dot-float 3.5s ease-in-out infinite 0.5s;
	}
	
	.dot-3 {
		animation: dot-float 4s ease-in-out infinite 1s;
	}
	
	.dot-4 {
		animation: dot-float 3.2s ease-in-out infinite 1.5s;
	}
	
	@keyframes background-pulse {
		0%, 100% { transform: scale(1); opacity: 0.8; }
		50% { transform: scale(1.05); opacity: 1; }
	}
	
	@keyframes dot-float {
		0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
		50% { transform: translateY(-3px) scale(1.2); opacity: 0.7; }
	}
	
	/* Hover effects */
	.nail-mascot:hover .background-circle {
		animation-duration: 2s;
		transform: scale(1.1);
	}
	
	.nail-mascot:hover .dot-1,
	.nail-mascot:hover .dot-2,
	.nail-mascot:hover .dot-3,
	.nail-mascot:hover .dot-4 {
		animation-duration: 1.5s;
		opacity: 0.8;
	}
</style>