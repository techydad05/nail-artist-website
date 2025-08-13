<script>
	import { onMount } from 'svelte';
	
	// Enhanced nail designs with more realistic options
	let designs = [
		{ 
			id: 'classic-french', 
			name: 'Classic French', 
			baseColor: '#FFB6C1', 
			tipColor: '#FFFFFF', 
			pattern: 'french',
			description: 'Timeless elegance with white tips' 
		},
		{ 
			id: 'solid-red', 
			name: 'Classic Red', 
			baseColor: '#DC143C', 
			tipColor: '#DC143C', 
			pattern: 'solid',
			description: 'Bold and confident red' 
		},
		{ 
			id: 'nude-pink', 
			name: 'Nude Pink', 
			baseColor: '#F5DEB3', 
			tipColor: '#F5DEB3', 
			pattern: 'solid',
			description: 'Natural and sophisticated' 
		},
		{ 
			id: 'glitter-gold', 
			name: 'Gold Glitter', 
			baseColor: '#FFD700', 
			tipColor: '#FFA500', 
			pattern: 'glitter',
			description: 'Sparkle and shine' 
		},
		{ 
			id: 'ombre-purple', 
			name: 'Purple Ombre', 
			baseColor: '#DDA0DD', 
			tipColor: '#8A2BE2', 
			pattern: 'ombre',
			description: 'Gradient beauty' 
		},
		{ 
			id: 'black-matte', 
			name: 'Matte Black', 
			baseColor: '#2F2F2F', 
			tipColor: '#2F2F2F', 
			pattern: 'solid',
			description: 'Modern and edgy' 
		}
	];
	
	// Enhanced nail shapes
	let shapes = [
		{ id: 'oval', name: 'Oval', description: 'Classic and flattering' },
		{ id: 'square', name: 'Square', description: 'Clean and modern' },
		{ id: 'round', name: 'Round', description: 'Natural and comfortable' },
		{ id: 'stiletto', name: 'Stiletto', description: 'Dramatic and bold' },
		{ id: 'coffin', name: 'Coffin', description: 'Trendy and chic' },
		{ id: 'almond', name: 'Almond', description: 'Elegant and elongating' }
	];
	
	// Length options
	let lengths = [
		{ id: 'short', name: 'Short', description: 'Practical and neat' },
		{ id: 'medium', name: 'Medium', description: 'Perfect balance' },
		{ id: 'long', name: 'Long', description: 'Glamorous and striking' }
	];
	
	// Current selections
	let selectedDesign = designs[0];
	let selectedShape = shapes[0];
	let selectedLength = lengths[1]; // Default to medium
	let selectedFingers = [false, false, false, false, false]; // Single hand - 5 fingers
	
	// Animation states
	let isAnimating = false;
	let showResult = false;
	
	// Load saved design from localStorage
	onMount(() => {
		const savedDesign = localStorage.getItem('nail-designer-state');
		if (savedDesign) {
			try {
				const state = JSON.parse(savedDesign);
				selectedDesign = designs.find(d => d.id === state.designId) || designs[0];
				selectedShape = shapes.find(s => s.id === state.shapeId) || shapes[0];
				selectedLength = lengths.find(l => l.id === state.lengthId) || lengths[1];
				selectedFingers = state.selectedFingers || [false, false, false, false, false];
			} catch (error) {
				console.log('Could not load saved design');
			}
		}
	});
	
	// Save design state to localStorage
	function saveDesignState() {
		const state = {
			designId: selectedDesign.id,
			shapeId: selectedShape.id,
			lengthId: selectedLength.id,
			selectedFingers: selectedFingers
		};
		localStorage.setItem('nail-designer-state', JSON.stringify(state));
	}
	
	// Apply design to selected fingers
	function applyDesign() {
		if (selectedFingers.every(f => !f)) {
			alert('Please select at least one finger to apply the design!');
			return;
		}
		
		isAnimating = true;
		saveDesignState();
		
		// Simulate processing time
		setTimeout(() => {
			isAnimating = false;
			showResult = true;
			
			// Auto-hide result after 4 seconds
			setTimeout(() => {
				showResult = false;
			}, 4000);
		}, 1200);
	}
	
	// Toggle finger selection
	function toggleFinger(index) {
		selectedFingers[index] = !selectedFingers[index];
		selectedFingers = [...selectedFingers]; // Trigger reactivity
	}
	
	// Select all fingers
	function selectAll() {
		selectedFingers = [true, true, true, true, true];
	}
	
	// Deselect all fingers
	function deselectAll() {
		selectedFingers = [false, false, false, false, false];
	}
	
	// Get nail style based on shape and length
	function getNailStyle(shape, length, isSelected, design) {
		const baseWidth = length.id === 'short' ? 16 : length.id === 'medium' ? 20 : 24;
		const baseHeight = length.id === 'short' ? 24 : length.id === 'medium' ? 32 : 40;
		
		let clipPath = '';
		switch (shape.id) {
			case 'oval':
				clipPath = 'ellipse(50% 50% at 50% 50%)';
				break;
			case 'square':
				clipPath = 'polygon(0 0, 100% 0, 100% 85%, 85% 100%, 15% 100%, 0 85%)';
				break;
			case 'round':
				clipPath = 'circle(50% at 50% 60%)';
				break;
			case 'stiletto':
				clipPath = 'polygon(50% 0%, 100% 100%, 0% 100%)';
				break;
			case 'coffin':
				clipPath = 'polygon(20% 0%, 80% 0%, 100% 70%, 85% 100%, 15% 100%, 0% 70%)';
				break;
			case 'almond':
				clipPath = 'ellipse(45% 50% at 50% 60%)';
				break;
		}
		
		let background = design.baseColor;
		if (design.pattern === 'french') {
			background = `linear-gradient(to top, ${design.baseColor} 70%, ${design.tipColor} 70%)`;
		} else if (design.pattern === 'ombre') {
			background = `linear-gradient(to top, ${design.baseColor}, ${design.tipColor})`;
		} else if (design.pattern === 'glitter') {
			background = `${design.baseColor}`;
		}
		
		return {
			width: `${baseWidth}px`,
			height: `${baseHeight}px`,
			background: isSelected ? background : '#F8F8FF',
			clipPath,
			border: isSelected ? '2px solid #8B5CF6' : '1px solid #D1D5DB',
			boxShadow: isSelected ? '0 0 10px rgba(139, 92, 246, 0.5)' : 'none',
			position: 'relative',
			overflow: 'hidden'
		};
	}
	
	// Book appointment with current design
	function bookWithDesign() {
		const designData = {
			design: selectedDesign,
			shape: selectedShape,
			length: selectedLength,
			selectedFingers: selectedFingers
		};
		
		// Save design for appointment booking
		localStorage.setItem('appointment-design', JSON.stringify(designData));
		
		// Dispatch event to open appointment modal
		window.dispatchEvent(new CustomEvent('open-appointment-modal', { 
			detail: { designReference: `${selectedDesign.name} - ${selectedShape.name} - ${selectedLength.name}` }
		}));
	}
</script>

<div class="bg-gradient-to-br from-purple-900/30 to-pink-800/30 rounded-3xl p-6 shadow-xl backdrop-blur-sm border border-white/10">
	<h3 class="text-2xl font-bold text-center mb-6 text-white glow-text flex items-center justify-center">
		<span class="mr-2 text-3xl">💅</span> Virtual Nail Designer
		<span class="ml-2 text-3xl">✨</span>
	</h3>
	
	<p class="text-center text-gray-300 mb-6">Design your perfect nails and save them for your appointment!</p>
	
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Design Selection -->
		<div class="bg-neutral/50 rounded-2xl p-4">
			<h4 class="font-bold text-lg mb-3 text-primary">Choose Design</h4>
			<div class="space-y-2">
				{#each designs as design}
					<button
						class={`w-full p-3 rounded-xl flex items-center transition-all duration-300 border-2 ${selectedDesign.id === design.id ? 'border-primary bg-white/10' : 'border-transparent hover:bg-white/5'}`}
						on:click={() => selectedDesign = design}
					>
						<div 
							class="w-8 h-10 rounded-lg mr-3 flex-shrink-0"
							style="background: {design.pattern === 'french' ? `linear-gradient(to top, ${design.baseColor} 70%, ${design.tipColor} 70%)` : design.pattern === 'ombre' ? `linear-gradient(to top, ${design.baseColor}, ${design.tipColor})` : design.baseColor}; {design.pattern === 'glitter' ? 'background-image: radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px); background-size: 4px 4px;' : ''}"
						></div>
						<div class="text-left">
							<div class="text-sm font-medium text-white">{design.name}</div>
							<div class="text-xs text-gray-400">{design.description}</div>
						</div>
					</button>
				{/each}
			</div>
		</div>
		
		<!-- Shape & Length Selection -->
		<div class="bg-neutral/50 rounded-2xl p-4">
			<h4 class="font-bold text-lg mb-3 text-primary">Shape & Length</h4>
			
			<!-- Shape Selection -->
			<div class="mb-4">
				<h5 class="text-sm font-medium text-gray-300 mb-2">Nail Shape</h5>
				<div class="grid grid-cols-2 gap-2">
					{#each shapes as shape}
						<button
							class={`p-2 rounded-lg text-xs transition-all duration-300 border ${selectedShape.id === shape.id ? 'border-primary bg-white/10 text-white' : 'border-gray-600 hover:bg-white/5 text-gray-300'}`}
							on:click={() => selectedShape = shape}
						>
							{shape.name}
						</button>
					{/each}
				</div>
			</div>
			
			<!-- Length Selection -->
			<div>
				<h5 class="text-sm font-medium text-gray-300 mb-2">Nail Length</h5>
				<div class="grid grid-cols-3 gap-2">
					{#each lengths as length}
						<button
							class={`p-2 rounded-lg text-xs transition-all duration-300 border ${selectedLength.id === length.id ? 'border-primary bg-white/10 text-white' : 'border-gray-600 hover:bg-white/5 text-gray-300'}`}
							on:click={() => selectedLength = length}
						>
							{length.name}
						</button>
					{/each}
				</div>
			</div>
		</div>
		
		<!-- Hand Visualization -->
		<div class="bg-neutral/50 rounded-2xl p-4">
			<h4 class="font-bold text-lg mb-3 text-primary">Select Fingers</h4>
			<div class="flex justify-between mb-4">
				<button class="btn btn-xs btn-secondary" on:click={selectAll}>All</button>
				<button class="btn btn-xs btn-outline" on:click={deselectAll}>None</button>
			</div>
			
			<!-- Single Hand Visualization -->
			<div class="relative h-64 flex items-end justify-center">
				<!-- Palm -->
				<div class="absolute bottom-0 w-20 h-16 bg-gradient-to-t from-pink-300 to-pink-200 rounded-t-3xl"></div>
				
				<!-- Fingers -->
				{#each selectedFingers as isSelected, i}
					<div 
						class="absolute cursor-pointer transition-all duration-300 hover:scale-110"
						style="
							bottom: 60px;
							left: {20 + i * 15}px;
							transform: rotate({(i - 2) * 8}deg);
							transform-origin: bottom center;
						"
						on:click={() => toggleFinger(i)}
						on:keydown={(e) => e.key === 'Enter' || e.key === ' ' ? toggleFinger(i) : null}
						role="button"
						tabindex="0"
						aria-label="Toggle finger {i + 1} selection"
					>
						<!-- Finger -->
						<div class="w-4 h-12 bg-gradient-to-t from-pink-400 to-pink-200 rounded-t-full"></div>
						
						<!-- Nail -->
						<div 
							class="absolute -top-1 left-1/2 transform -translate-x-1/2 transition-all duration-300 cursor-pointer"
							style={Object.entries(getNailStyle(selectedShape, selectedLength, isSelected, selectedDesign)).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`).join('; ')}
						>
							{#if selectedDesign.pattern === 'glitter' && isSelected}
								<div class="absolute inset-0 opacity-60" style="background-image: radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px); background-size: 3px 3px;"></div>
							{/if}
						</div>
						
						<!-- Selection indicator -->
						{#if isSelected}
							<div class="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse"></div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
	
	<!-- Current Design Summary -->
	<div class="mt-6 bg-neutral/30 rounded-2xl p-4">
		<h4 class="font-bold text-lg mb-2 text-primary">Current Design</h4>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
			<div>
				<span class="text-gray-400">Design:</span>
				<span class="text-white ml-2">{selectedDesign.name}</span>
			</div>
			<div>
				<span class="text-gray-400">Shape:</span>
				<span class="text-white ml-2">{selectedShape.name}</span>
			</div>
			<div>
				<span class="text-gray-400">Length:</span>
				<span class="text-white ml-2">{selectedLength.name}</span>
			</div>
		</div>
		<div class="mt-2">
			<span class="text-gray-400">Selected Fingers:</span>
			<span class="text-white ml-2">
				{selectedFingers.filter(f => f).length} of 5
				{#if selectedFingers.filter(f => f).length > 0}
					({selectedFingers.map((f, i) => f ? `${i + 1}` : '').filter(Boolean).join(', ')})
				{/if}
			</span>
		</div>
	</div>
	
	<!-- Action Buttons -->
	<div class="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
		<button 
			class="btn btn-primary px-6 py-3 text-lg font-bold flex-1 sm:flex-none"
			class:loading={isAnimating}
			on:click={applyDesign}
			disabled={isAnimating}
		>
			{#if isAnimating}
				<span class="loading loading-spinner loading-sm mr-2"></span>
				Applying Design...
			{:else}
				Apply Design
			{/if}
		</button>
		
		<button 
			class="btn btn-secondary px-6 py-3 text-lg font-bold flex-1 sm:flex-none"
			on:click={bookWithDesign}
			disabled={selectedFingers.every(f => !f)}
		>
			Book with This Design
		</button>
	</div>
	
	<!-- Result Animation -->
	{#if showResult}
		<div class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
			<div class="bg-black/80 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full mx-4 border border-primary/50">
				<div class="text-center">
					<div class="text-6xl mb-4">💅✨</div>
					<h3 class="text-2xl font-bold text-primary mb-2">Design Applied!</h3>
					<p class="text-gray-300 mb-4">
						Your {selectedDesign.name} design with {selectedShape.name} shape ({selectedLength.name} length) looks amazing!
					</p>
					<p class="text-sm text-gray-400 mb-4">Design saved to your browser for booking.</p>
					<button 
						class="btn btn-primary btn-sm"
						on:click={bookWithDesign}
					>
						Book Appointment Now
					</button>
				</div>
			</div>
		</div>
		
		<!-- Sparkle effect -->
		{#each Array(30) as _, i}
			<div 
				class="fixed w-1 h-1 rounded-full animate-ping pointer-events-none"
				style="
					background-color: hsl({Math.random() * 60 + 280}, 100%, 70%);
					top: {20 + Math.random() * 60}%;
					left: {20 + Math.random() * 60}%;
					animation-delay: {Math.random() * 2}s;
					animation-duration: {0.5 + Math.random() * 1}s;
					z-index: 51;
				"
			></div>
		{/each}
	{/if}
</div>

<style>
	/* Custom animations for nail designer */
	@keyframes sparkle {
		0%, 100% { opacity: 0; transform: scale(0); }
		50% { opacity: 1; transform: scale(1); }
	}
	
	.sparkle {
		animation: sparkle 1.5s ease-in-out infinite;
	}
	
	/* Smooth transitions for nail selection */
	.nail-transition {
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
	
	/* Hover effects */
	.finger-hover:hover {
		transform: scale(1.1);
		filter: brightness(1.1);
	}
</style>
