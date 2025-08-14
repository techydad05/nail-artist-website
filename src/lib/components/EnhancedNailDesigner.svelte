<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import AuthModal from './AuthModal.svelte';
	import DesignManager from './DesignManager.svelte';
	
	const dispatch = createEventDispatcher();
	
	// User state
	let currentUser = null;
	let showAuthModal = false;
	let showDesignManager = false;
	
	// Designer state
	let currentNailIndex = 0;
	let nails = [
		{ id: 0, name: 'Thumb', baseColor: '#FFB6C1', design: null, stickers: [] },
		{ id: 1, name: 'Index', baseColor: '#FFB6C1', design: null, stickers: [] },
		{ id: 2, name: 'Middle', baseColor: '#FFB6C1', design: null, stickers: [] },
		{ id: 3, name: 'Ring', baseColor: '#FFB6C1', design: null, stickers: [] },
		{ id: 4, name: 'Pinky', baseColor: '#FFB6C1', design: null, stickers: [] }
	];
	
	// Design options
	let colors = [
		'#FFB6C1', '#DC143C', '#F5DEB3', '#FFD700', '#DDA0DD', '#2F2F2F',
		'#FF69B4', '#32CD32', '#00CED1', '#FF4500', '#9370DB', '#000000',
		'#FFFFFF', '#C0C0C0', '#FFA500', '#8B4513', '#006400', '#4B0082'
	];
	
	let patterns = [
		{ id: 'solid', name: 'Solid Color', preview: 'solid' },
		{ id: 'french', name: 'French Tips', preview: 'gradient' },
		{ id: 'ombre', name: 'Ombre', preview: 'gradient' },
		{ id: 'glitter', name: 'Glitter', preview: 'sparkle' },
		{ id: 'stripes', name: 'Stripes', preview: 'lines' },
		{ id: 'dots', name: 'Polka Dots', preview: 'dots' }
	];
	
	let stickers = [
		{ id: 'heart', emoji: '💖', name: 'Heart' },
		{ id: 'star', emoji: '⭐', name: 'Star' },
		{ id: 'flower', emoji: '🌸', name: 'Flower' },
		{ id: 'butterfly', emoji: '🦋', name: 'Butterfly' },
		{ id: 'diamond', emoji: '💎', name: 'Diamond' },
		{ id: 'crown', emoji: '👑', name: 'Crown' },
		{ id: 'moon', emoji: '🌙', name: 'Moon' },
		{ id: 'lightning', emoji: '⚡', name: 'Lightning' }
	];
	
	// Canvas references
	let canvasRefs = [];
	let handCanvas;
	
	// Selected tools
	let selectedColor = colors[0];
	let selectedPattern = patterns[0];
	let selectedSticker = null;
	let brushSize = 20;
	
	onMount(async () => {
		await checkAuthStatus();
		loadSavedDesign();
		setTimeout(() => initializeCanvases(), 100);
	});
	
	async function checkAuthStatus() {
		try {
			const response = await fetch('/api/auth');
			const result = await response.json();
			if (result.success && result.user) {
				currentUser = result.user;
			}
		} catch (error) {
			console.log('Not logged in');
		}
	}
	
	function loadSavedDesign() {
		const saved = localStorage.getItem('enhanced-nail-design');
		if (saved) {
			try {
				const data = JSON.parse(saved);
				nails = data.nails || nails;
			} catch (error) {
				console.log('Could not load saved design');
			}
		}
	}
	
	function saveDesign() {
		const designData = { nails, timestamp: Date.now() };
		localStorage.setItem('enhanced-nail-design', JSON.stringify(designData));
	}
	
	function initializeCanvases() {
		canvasRefs.forEach((canvas, index) => {
			if (canvas) {
				const ctx = canvas.getContext('2d');
				drawNail(ctx, nails[index], canvas.width, canvas.height);
			}
		});
		if (handCanvas) drawHandOverview();
	}
	
	function drawNail(ctx, nail, width, height) {
		ctx.clearRect(0, 0, width, height);
		
		// Draw nail shape
		ctx.fillStyle = nail.baseColor;
		ctx.beginPath();
		ctx.ellipse(width/2, height/2, width/2 - 10, height/2 - 10, 0, 0, 2 * Math.PI);
		ctx.fill();
		
		// Apply pattern
		if (nail.design && nail.design.pattern !== 'solid') {
			applyPattern(ctx, nail.design, width, height);
		}
		
		// Draw stickers
		nail.stickers.forEach(sticker => {
			ctx.font = `${sticker.size || 20}px Arial`;
			ctx.fillText(sticker.emoji, sticker.x, sticker.y);
		});
	}
	
	function applyPattern(ctx, design, width, height) {
		switch (design.pattern) {
			case 'french':
				ctx.fillStyle = design.tipColor || '#FFFFFF';
				ctx.beginPath();
				ctx.ellipse(width/2, height/4, width/2 - 10, height/4, 0, 0, Math.PI, true);
				ctx.fill();
				break;
			case 'stripes':
				ctx.strokeStyle = design.accentColor || '#000000';
				ctx.lineWidth = 2;
				for (let i = 0; i < width; i += 10) {
					ctx.beginPath();
					ctx.moveTo(i, 0);
					ctx.lineTo(i, height);
					ctx.stroke();
				}
				break;
			case 'dots':
				ctx.fillStyle = design.accentColor || '#FFFFFF';
				for (let x = 15; x < width - 15; x += 20) {
					for (let y = 15; y < height - 15; y += 20) {
						ctx.beginPath();
						ctx.arc(x, y, 3, 0, 2 * Math.PI);
						ctx.fill();
					}
				}
				break;
		}
	}
	
	function drawHandOverview() {
		const ctx = handCanvas.getContext('2d');
		const width = handCanvas.width;
		const height = handCanvas.height;
		
		ctx.clearRect(0, 0, width, height);
		
		// Draw palm
		ctx.fillStyle = '#F4C2A1';
		ctx.beginPath();
		ctx.ellipse(width/2, height - 40, 60, 40, 0, 0, 2 * Math.PI);
		ctx.fill();
		
		// Draw fingers with current nail designs
		nails.forEach((nail, index) => {
			const fingerX = 50 + index * 40;
			const fingerY = height - 80;
			
			// Finger
			ctx.fillStyle = '#F4C2A1';
			ctx.fillRect(fingerX - 8, fingerY - 40, 16, 40);
			
			// Nail
			ctx.fillStyle = nail.baseColor;
			ctx.beginPath();
			ctx.ellipse(fingerX, fingerY - 35, 8, 12, 0, 0, 2 * Math.PI);
			ctx.fill();
			
			// Highlight current nail
			if (index === currentNailIndex) {
				ctx.strokeStyle = '#8B5CF6';
				ctx.lineWidth = 3;
				ctx.stroke();
			}
		});
	}
	
	function selectNail(index) {
		currentNailIndex = index;
		drawHandOverview();
	}
	
	function applyColorToCurrentNail() {
		nails[currentNailIndex].baseColor = selectedColor;
		updateCurrentNailCanvas();
		drawHandOverview();
		saveDesign();
	}
	
	function applyPatternToCurrentNail() {
		nails[currentNailIndex].design = {
			pattern: selectedPattern.id,
			accentColor: selectedColor,
			tipColor: '#FFFFFF'
		};
		updateCurrentNailCanvas();
		drawHandOverview();
		saveDesign();
	}
	
	function updateCurrentNailCanvas() {
		const canvas = canvasRefs[currentNailIndex];
		if (canvas) {
			const ctx = canvas.getContext('2d');
			drawNail(ctx, nails[currentNailIndex], canvas.width, canvas.height);
		}
	}
	
	function handleCanvasClick(event, nailIndex) {
		if (selectedSticker && nailIndex === currentNailIndex) {
			const canvas = canvasRefs[nailIndex];
			const rect = canvas.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;
			
			const sticker = {
				id: Date.now(),
				emoji: selectedSticker.emoji,
				x: x,
				y: y,
				size: brushSize
			};
			
			nails[nailIndex].stickers.push(sticker);
			updateCurrentNailCanvas();
			saveDesign();
		}
	}
	
	function clearCurrentNail() {
		nails[currentNailIndex] = {
			...nails[currentNailIndex],
			baseColor: '#FFB6C1',
			design: null,
			stickers: []
		};
		updateCurrentNailCanvas();
		drawHandOverview();
		saveDesign();
	}
	
	function copyDesignToAll() {
		const currentDesign = { ...nails[currentNailIndex] };
		nails = nails.map(nail => ({
			...nail,
			baseColor: currentDesign.baseColor,
			design: currentDesign.design ? { ...currentDesign.design } : null,
			stickers: [...currentDesign.stickers]
		}));
		
		canvasRefs.forEach((canvas, index) => {
			if (canvas) {
				const ctx = canvas.getContext('2d');
				drawNail(ctx, nails[index], canvas.width, canvas.height);
			}
		});
		
		drawHandOverview();
		saveDesign();
	}
	
	function handleAuthSuccess(event) {
		currentUser = event.detail;
		showAuthModal = false;
	}
	
	async function logout() {
		try {
			await fetch('/api/auth', { method: 'DELETE' });
			currentUser = null;
		} catch (error) {
			console.error('Logout error:', error);
		}
	}
	
	function bookWithDesign() {
		const designData = { nails, user: currentUser };
		localStorage.setItem('appointment-design', JSON.stringify(designData));
		
		// Create a design reference with nail details
		const designSummary = nails
			.filter(nail => nail.baseColor !== '#FFB6C1' || nail.stickers.length > 0 || nail.design)
			.map(nail => `${nail.name}: ${nail.baseColor}${nail.stickers.length > 0 ? ` + ${nail.stickers.length} stickers` : ''}`)
			.join(', ');
		
		const designReference = designSummary || 'Custom Nail Art Design';
		
		window.dispatchEvent(new CustomEvent('open-appointment-modal', { 
			detail: { 
				designReference: `${designReference}${currentUser ? ` by ${currentUser.name}` : ''}` 
			}
		}));
	}
	
	function handleLoadDesign(event) {
		const design = event.detail;
		if (design.data && design.data.nails) {
			nails = [...design.data.nails];
			
			// Update all canvases
			setTimeout(() => {
				canvasRefs.forEach((canvas, index) => {
					if (canvas && nails[index]) {
						const ctx = canvas.getContext('2d');
						drawNail(ctx, nails[index], canvas.width, canvas.height);
					}
				});
				drawHandOverview();
				saveDesign();
			}, 100);
		}
		showDesignManager = false;
	}
	
	function getCurrentDesignData() {
		return {
			nails: nails,
			timestamp: Date.now(),
			version: '2.0'
		};
	}
</script>

<div class="bg-gradient-to-br from-purple-900/30 to-pink-800/30 rounded-3xl p-6 shadow-xl backdrop-blur-sm border border-white/10">
	<!-- Header -->
	<div class="flex justify-between items-center mb-6">
		<h3 class="text-2xl font-bold text-white glow-text flex items-center">
			<span class="mr-2 text-3xl">💅</span> Enhanced Nail Designer
			<span class="ml-2 text-3xl">✨</span>
		</h3>
		
		<!-- User Auth -->
		<div class="flex items-center gap-3">
			{#if currentUser}
				<div class="flex items-center gap-2">
					<div class="avatar">
						<div class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold">
							{currentUser.name.charAt(0).toUpperCase()}
						</div>
					</div>
					<div class="text-sm text-white">
						Welcome, {currentUser.name}!
					</div>
				</div>
				<button class="btn variant-ghost btn-sm text-white" on:click={logout}>
					Logout
				</button>
			{:else}
				<button class="btn variant-filled-primary btn-sm" on:click={() => showAuthModal = true}>
					Sign In
				</button>
			{/if}
		</div>
	</div>
	
	<!-- Hand Overview -->
	<div class="bg-neutral/50 rounded-2xl p-4 mb-6">
		<h4 class="font-bold text-lg mb-3 text-primary text-center">Your Hand Design</h4>
		<div class="flex justify-center">
			<canvas 
				bind:this={handCanvas}
				width="300" 
				height="200"
				class="border border-white/20 rounded-lg bg-white/10 cursor-pointer"
				on:click={(e) => {
					const rect = handCanvas.getBoundingClientRect();
					const x = e.clientX - rect.left;
					const nailIndex = Math.floor((x - 30) / 40);
					if (nailIndex >= 0 && nailIndex < 5) selectNail(nailIndex);
				}}
			></canvas>
		</div>
		<p class="text-center text-sm text-gray-400 mt-2">
			Click on a nail to edit it individually
		</p>
	</div>
	
	<!-- Individual Nail Editor -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Nail Canvas -->
		<div class="bg-neutral/50 rounded-2xl p-4">
			<h4 class="font-bold text-lg mb-3 text-primary">
				Editing: {nails[currentNailIndex].name} Finger
			</h4>
			
			<div class="flex justify-center mb-4">
				<canvas 
					bind:this={canvasRefs[currentNailIndex]}
					width="200" 
					height="250"
					class="border border-white/20 rounded-lg bg-white/10 cursor-crosshair"
					on:click={(e) => handleCanvasClick(e, currentNailIndex)}
				></canvas>
			</div>
			
			<!-- Nail Navigation -->
			<div class="flex justify-center gap-2 mb-4">
				{#each nails as nail, index}
					<button
						class="btn btn-sm {index === currentNailIndex ? 'btn-primary' : 'btn-outline'}"
						on:click={() => selectNail(index)}
					>
						{nail.name}
					</button>
				{/each}
			</div>
			
			<!-- Quick Actions -->
			<div class="flex gap-2 justify-center">
				<button class="btn btn-sm btn-secondary" on:click={copyDesignToAll}>
					Copy to All
				</button>
				<button class="btn btn-sm btn-outline" on:click={clearCurrentNail}>
					Clear
				</button>
			</div>
		</div>
		
		<!-- Design Tools -->
		<div class="space-y-4">
			<!-- Color Palette -->
			<div class="bg-neutral/50 rounded-2xl p-4">
				<h5 class="font-bold text-md mb-3 text-primary">Colors</h5>
				<div class="grid grid-cols-6 gap-2">
					{#each colors as color}
						<button
							class="w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110"
							class:border-white={selectedColor === color}
							class:border-gray-400={selectedColor !== color}
							style="background-color: {color}"
							on:click={() => {
								selectedColor = color;
								applyColorToCurrentNail();
							}}
						></button>
					{/each}
				</div>
			</div>
			
			<!-- Patterns -->
			<div class="bg-neutral/50 rounded-2xl p-4">
				<h5 class="font-bold text-md mb-3 text-primary">Patterns</h5>
				<div class="grid grid-cols-2 gap-2">
					{#each patterns as pattern}
						<button
							class="btn btn-sm {selectedPattern.id === pattern.id ? 'btn-primary' : 'btn-outline'}"
							on:click={() => {
								selectedPattern = pattern;
								applyPatternToCurrentNail();
							}}
						>
							{pattern.name}
						</button>
					{/each}
				</div>
			</div>
			
			<!-- Stickers -->
			<div class="bg-neutral/50 rounded-2xl p-4">
				<h5 class="font-bold text-md mb-3 text-primary">Stickers</h5>
				<div class="grid grid-cols-4 gap-2 mb-3">
					{#each stickers as sticker}
						<button
							class="btn btn-sm {selectedSticker?.id === sticker.id ? 'btn-primary' : 'btn-outline'} text-lg"
							on:click={() => selectedSticker = selectedSticker?.id === sticker.id ? null : sticker}
						>
							{sticker.emoji}
						</button>
					{/each}
				</div>
				
				{#if selectedSticker}
					<div class="space-y-2">
						<p class="text-sm text-gray-400">Click on the nail to place {selectedSticker.name}</p>
						<div class="flex items-center gap-2">
							<span class="text-sm text-white">Size:</span>
							<input 
								type="range" 
								min="10" 
								max="40" 
								bind:value={brushSize}
								class="range range-primary range-sm flex-1"
							>
							<span class="text-sm text-white">{brushSize}px</span>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
	
	<!-- Action Buttons -->
	<div class="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
		<button class="btn btn-secondary px-6 py-3" on:click={bookWithDesign}>
			Book with This Design
		</button>
		
		{#if currentUser}
			<button class="btn btn-accent px-6 py-3" on:click={() => showDesignManager = true}>
				Manage Designs
			</button>
		{:else}
			<button class="btn btn-outline px-6 py-3" on:click={() => showAuthModal = true}>
				Sign In to Save
			</button>
		{/if}
	</div>
</div>

<!-- Auth Modal -->
<AuthModal 
	bind:isOpen={showAuthModal}
	on:auth-success={handleAuthSuccess}
	on:close={() => showAuthModal = false}
/>

<!-- Design Manager Modal -->
<DesignManager 
	bind:isOpen={showDesignManager}
	{currentUser}
	currentDesign={getCurrentDesignData()}
	on:load-design={handleLoadDesign}
	on:close={() => showDesignManager = false}
/>

<style>
	canvas {
		image-rendering: pixelated;
	}
	
	.glow-text {
		text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
	}
</style>