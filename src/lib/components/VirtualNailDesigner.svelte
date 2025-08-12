<script>
	import { onMount } from 'svelte';
	
	// Nail designs
	let designs = [
		{ id: 'classic', name: 'Classic French', color: 'white', accent: 'pink', description: 'Timeless elegance' },
		{ id: 'glitter', name: 'Glitter Glam', color: 'silver', accent: 'gold', description: 'Sparkle and shine' },
		{ id: 'ombre', name: 'Ombre Effect', color: 'purple', accent: 'blue', description: 'Gradient beauty' },
		{ id: 'floral', name: 'Floral Art', color: 'pink', accent: 'green', description: 'Nature-inspired' },
		{ id: 'geometric', name: 'Geometric', color: 'black', accent: 'white', description: 'Modern and bold' },
		{ id: 'animal', name: 'Animal Print', color: 'brown', accent: 'black', description: 'Wild and fierce' }
	];
	
	// Current selections
	let selectedDesign = designs[0];
	let selectedFingers = [true, true, true, true, true, true, true, true, true, true]; // 10 fingers
	
	// Animation states
	let isAnimating = false;
	let showResult = false;
	
	// Nail shape options
	let shapes = [
		{ id: 'oval', name: 'Oval' },
		{ id: 'square', name: 'Square' },
		{ id: 'round', name: 'Round' },
		{ id: 'stiletto', name: 'Stiletto' }
	];
	
	let selectedShape = shapes[0];
	
	// Apply design to selected fingers
	function applyDesign() {
		isAnimating = true;
		
		// Simulate processing time
		setTimeout(() => {
			isAnimating = false;
			showResult = true;
			
			// Auto-hide result after 5 seconds
			setTimeout(() => {
				showResult = false;
			}, 5000);
		}, 1500);
	}
	
	// Toggle finger selection
	function toggleFinger(index) {
		selectedFingers[index] = !selectedFingers[index];
	}
	
	// Select all fingers
	function selectAll() {
		selectedFingers = selectedFingers.map(() => true);
	}
	
	// Deselect all fingers
	function deselectAll() {
		selectedFingers = selectedFingers.map(() => false);
	}
	
	// Get design by ID
	function getDesignById(id) {
		return designs.find(d => d.id === id) || designs[0];
	}
</script>

<div class="bg-gradient-to-br from-purple-900/30 to-pink-800/30 rounded-3xl p-6 shadow-xl backdrop-blur-sm border border-white/10">
	<h3 class="text-2xl font-bold text-center mb-6 text-white glow-text flex items-center justify-center">
		<span class="mr-2 text-3xl">💅</span> Virtual Nail Designer
		<span class="ml-2 text-3xl">✨</span>
	</h3>
	
	<p class="text-center text-gray-300 mb-6">Visualize your perfect nail art before your appointment!</p>
	
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<!-- Design Selection -->
		<div class="bg-neutral/50 rounded-2xl p-4">
			<h4 class="font-bold text-lg mb-3 text-primary">Choose a Design</h4>
			<div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
				{#each designs as design}
					<button
						class={`p-3 rounded-xl flex flex-col items-center transition-all duration-300 border-2 ${selectedDesign.id === design.id ? 'border-primary bg-white/10' : 'border-transparent hover:bg-white/5'}`}
						on:click={() => selectedDesign = design}
					>
						<div class="w-12 h-16 rounded-lg mb-2 flex items-center justify-center text-2xl relative overflow-hidden">
							<div class="absolute inset-0 bg-gradient-to-b from-pink-400 to-pink-600"></div>
							<div class="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-pink-300 to-transparent"></div>
							<div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-pink-300"></div>
						</div>
						<span class="text-sm font-medium">{design.name}</span>
					</button>
				{/each}
			</div>
		</div>
		
		<!-- Shape Selection -->
		<div class="bg-neutral/50 rounded-2xl p-4">
			<h4 class="font-bold text-lg mb-3 text-primary">Nail Shape</h4>
			<div class="grid grid-cols-2 gap-3">
				{#each shapes as shape}
					<button
						class={`p-3 rounded-xl flex flex-col items-center transition-all duration-300 border-2 ${selectedShape.id === shape.id ? 'border-primary bg-white/10' : 'border-transparent hover:bg-white/5'}`}
						on:click={() => selectedShape = shape}
					>
						<div class="w-16 h-12 mb-2 flex items-end justify-center">
							{#if shape.id === 'oval'}
								<div class="w-10 h-16 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full"></div>
							{:else if shape.id === 'square'}
								<div class="w-10 h-14 bg-gradient-to-b from-pink-400 to-pink-600 border-t-4 border-pink-300"></div>
							{:else if shape.id === 'round'}
								<div class="w-12 h-12 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full"></div>
							{:else if shape.id === 'stiletto'}
								<div class="w-6 h-16 bg-gradient-to-b from-pink-400 to-pink-600 clip-stiletto"></div>
							{/if}
						</div>
						<span class="text-sm font-medium">{shape.name}</span>
					</button>
				{/each}
			</div>
		</div>
	</div>
	
	<!-- Finger Selection -->
	<div class="mt-6 bg-neutral/50 rounded-2xl p-4">
		<h4 class="font-bold text-lg mb-3 text-primary">Select Fingers</h4>
		<div class="flex justify-between mb-3">
			<button class="btn btn-sm btn-secondary flex items-center justify-center leading-none py-2" on:click={selectAll}>Select All</button>
			<button class="btn btn-sm btn-outline flex items-center justify-center leading-none py-2" on:click={deselectAll}>Deselect All</button>
		</div>
		
		<!-- Hand visualization -->
		<div class="relative h-40 sm:h-48 mx-auto">
			<!-- Palm -->
			<div class="absolute inset-x-1/4 bottom-0 h-24 sm:h-32 w-1/2 bg-gradient-to-b from-pink-300 to-pink-500 rounded-t-3xl"></div>
			
			<!-- Fingers -->
			{#each selectedFingers as isSelected, i}
				<div 
					class="absolute w-6 sm:w-8 h-16 sm:h-20 bg-gradient-to-b from-pink-200 to-pink-400 rounded-t-full cursor-pointer transition-all duration-200"
					class:ring-4={isSelected}
					class:ring-primary={isSelected}
					class:hover:opacity-80={true}
					on:click={() => toggleFinger(i)}
					on:keydown={(e) => e.key === 'Enter' || e.key === ' ' ? toggleFinger(i) : null}
					role="button"
					tabindex="0"
					aria-label="Toggle finger {i + 1} selection"
					style="
						bottom: {i < 5 ? '50%' : '40%'};
						left: {15 + i * 11}%;
						transform: rotate({i < 5 ? (i - 2) * 5 : (i - 7) * 5}deg);
						z-index: {10 - Math.abs(i - 4)};
					"
				>
					<!-- Nail area -->
						<div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 sm:w-6 h-6 sm:h-8 rounded-t-full bg-white flex items-center justify-center text-sm sm:text-xl">
							{#if isSelected}
								<span class="text-pink-500">💅</span>
							{:else}
								<span class="text-gray-400 text-xs sm:text-lg">-</span>
							{/if}
						</div>
				</div>
			{/each}
		</div>
	</div>
	
	<!-- Action Button -->
	<div class="mt-6 text-center">
		<button 
			class="btn btn-primary px-8 py-3 text-lg font-bold"
			class:loading={isAnimating}
			on:click={applyDesign}
			disabled={isAnimating}
		>
			{#if isAnimating}
				Designing Your Nails...
			{:else}
				Apply Design
			{/if}
		</button>
	</div>
	
	<!-- Result Animation -->
	{#if showResult}
		<div class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
			<div class="bg-black/70 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full mx-4 border border-primary/50 animate-pulse">
				<div class="text-center">
					<div class="text-6xl mb-4">💅✨</div>
					<h3 class="text-2xl font-bold text-primary mb-2">Perfect Nails!</h3>
					<p class="text-gray-300 mb-4">Your {selectedDesign.name} design with {selectedShape.name} shape looks amazing!</p>
					<p class="text-sm text-gray-400">Book an appointment to make this a reality!</p>
				</div>
			</div>
		</div>
		
		<!-- Confetti effect -->
		{#each Array(50) as _, i}
			<div 
				class="fixed w-2 h-2 rounded-full animate-bounce"
				style="
					background-color: hsl({Math.random() * 360}, 100%, 70%);
					top: {Math.random() * 100}%;
					left: {Math.random() * 100}%;
					animation-delay: {Math.random() * 2}s;
					animation-duration: {1 + Math.random() * 2}s;
					z-index: 51;
				"
			></div>
		{/each}
	{/if}
</div>

<style>
	.clip-stiletto {
		clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
	}
</style>
