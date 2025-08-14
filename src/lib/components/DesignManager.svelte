<script>
	import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher();
	
	export let isOpen = false;
	export let currentUser = null;
	export let currentDesign = null;
	
	let designName = '';
	let isPublic = false;
	let isSaving = false;
	let isLoading = false;
	let savedDesigns = [];
	let publicDesigns = [];
	let activeTab = 'save';
	let error = '';
	let success = '';
	
	// Load designs when modal opens
	$: if (isOpen && currentUser) {
		loadDesigns();
	}
	
	async function loadDesigns() {
		isLoading = true;
		error = '';
		
		try {
			// Load user's designs
			const userResponse = await fetch(`/api/designs?userId=${currentUser.id}`);
			const userData = await userResponse.json();
			
			if (userData.success) {
				savedDesigns = userData.designs;
			}
			
			// Load public designs
			const publicResponse = await fetch('/api/designs');
			const publicData = await publicResponse.json();
			
			if (publicData.success) {
				publicDesigns = publicData.designs.filter(d => d.userId !== currentUser.id);
			}
			
		} catch (err) {
			console.error('Error loading designs:', err);
			error = 'Failed to load designs';
		} finally {
			isLoading = false;
		}
	}
	
	async function saveDesign() {
		if (!designName.trim()) {
			error = 'Please enter a design name';
			return;
		}
		
		if (!currentDesign) {
			error = 'No design to save';
			return;
		}
		
		isSaving = true;
		error = '';
		success = '';
		
		try {
			const response = await fetch('/api/designs', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					designName: designName.trim(),
					designData: currentDesign,
					isPublic
				})
			});
			
			const result = await response.json();
			
			if (result.success) {
				success = 'Design saved successfully!';
				designName = '';
				isPublic = false;
				await loadDesigns();
				
				// Auto-close success message
				setTimeout(() => {
					success = '';
				}, 3000);
			} else {
				error = result.error || 'Failed to save design';
			}
			
		} catch (err) {
			console.error('Error saving design:', err);
			error = 'Network error. Please try again.';
		} finally {
			isSaving = false;
		}
	}
	
	async function loadDesign(design) {
		dispatch('load-design', design);
		closeModal();
	}
	
	async function deleteDesign(designId) {
		if (!confirm('Are you sure you want to delete this design?')) {
			return;
		}
		
		try {
			const response = await fetch(`/api/designs?id=${designId}`, {
				method: 'DELETE'
			});
			
			const result = await response.json();
			
			if (result.success) {
				await loadDesigns();
				success = 'Design deleted successfully!';
				setTimeout(() => success = '', 3000);
			} else {
				error = result.error || 'Failed to delete design';
			}
			
		} catch (err) {
			console.error('Error deleting design:', err);
			error = 'Network error. Please try again.';
		}
	}
	
	async function exportDesign() {
		if (!currentDesign) {
			error = 'No design to export';
			return;
		}
		
		try {
			// Create a canvas to render the design
			const canvas = document.createElement('canvas');
			canvas.width = 800;
			canvas.height = 600;
			const ctx = canvas.getContext('2d');
			
			// Draw background
			ctx.fillStyle = '#f8f9fa';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			
			// Draw title
			ctx.fillStyle = '#333';
			ctx.font = 'bold 24px Arial';
			ctx.textAlign = 'center';
			ctx.fillText('My Nail Design', canvas.width / 2, 40);
			
			// Draw nails
			currentDesign.nails.forEach((nail, index) => {
				const x = 100 + index * 120;
				const y = 150;
				const width = 80;
				const height = 120;
				
				// Draw nail shape
				ctx.fillStyle = nail.baseColor;
				ctx.beginPath();
				ctx.ellipse(x + width/2, y + height/2, width/2 - 5, height/2 - 5, 0, 0, 2 * Math.PI);
				ctx.fill();
				
				// Draw stickers
				nail.stickers.forEach(sticker => {
					ctx.font = `${sticker.size || 20}px Arial`;
					ctx.fillText(sticker.emoji, x + sticker.x * width/200, y + sticker.y * height/250);
				});
				
				// Draw nail name
				ctx.fillStyle = '#666';
				ctx.font = '14px Arial';
				ctx.textAlign = 'center';
				ctx.fillText(nail.name, x + width/2, y + height + 20);
			});
			
			// Convert to blob and download
			canvas.toBlob((blob) => {
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `nail-design-${Date.now()}.png`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
				
				success = 'Design exported successfully!';
				setTimeout(() => success = '', 3000);
			}, 'image/png');
			
		} catch (err) {
			console.error('Error exporting design:', err);
			error = 'Failed to export design';
		}
	}
	
	function closeModal() {
		isOpen = false;
		designName = '';
		isPublic = false;
		error = '';
		success = '';
		activeTab = 'save';
		dispatch('close');
	}
	
	function handleBackdropClick(event) {
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}
	
	function handleKeydown(event) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<div 
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
		on:click={handleBackdropClick}
		role="dialog"
		aria-modal="true"
	>
		<div class="modal max-w-4xl">
			<!-- Header -->
			<div class="bg-gradient-to-r from-primary to-secondary text-white p-6">
				<div class="flex justify-between items-center">
					<h2 class="text-xl font-bold flex items-center">
						<span class="mr-2 text-2xl">💾</span> Design Manager
					</h2>
					<button 
						class="btn btn-ghost btn-circle text-white hover:bg-white/20"
						on:click={closeModal}
					>
						✕
					</button>
				</div>
			</div>
			
			<!-- Tabs -->
			<div class="flex gap-2 p-2 bg-surface-200-700-token rounded-lg">
				<button 
					class="btn {activeTab === 'save' ? 'variant-filled-primary' : 'variant-ghost'}"
					on:click={() => activeTab = 'save'}
				>
					Save Design
				</button>
				<button 
					class="btn {activeTab === 'my-designs' ? 'variant-filled-primary' : 'variant-ghost'}"
					on:click={() => activeTab = 'my-designs'}
				>
					My Designs ({savedDesigns.length})
				</button>
				<button 
					class="btn {activeTab === 'public' ? 'variant-filled-primary' : 'variant-ghost'}"
					on:click={() => activeTab = 'public'}
				>
					Public Gallery ({publicDesigns.length})
				</button>
				<button 
					class="btn {activeTab === 'export' ? 'variant-filled-primary' : 'variant-ghost'}"
					on:click={() => activeTab = 'export'}
				>
					Export
				</button>
			</div>
			
			<!-- Content -->
			<div class="p-6 overflow-y-auto max-h-[60vh]">
				{#if error}
					<div class="alert alert-error mb-4">
						<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<span>{error}</span>
					</div>
				{/if}
				
				{#if success}
					<div class="alert alert-success mb-4">
						<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<span>{success}</span>
					</div>
				{/if}
				
				{#if activeTab === 'save'}
					<div class="space-y-4">
						<h3 class="text-lg font-semibold">Save Current Design</h3>
						
						<div>
							<label for="design-name" class="block text-sm font-medium mb-1">
								Design Name *
							</label>
							<input
								id="design-name"
								type="text"
								bind:value={designName}
								class="input input-bordered w-full"
								placeholder="Enter a name for your design"
								maxlength="50"
								disabled={isSaving}
							>
						</div>
						
						<div class="form-control">
							<label class="label cursor-pointer">
								<span class="label-text">Make this design public</span>
								<input 
									type="checkbox" 
									bind:checked={isPublic}
									class="checkbox checkbox-primary"
									disabled={isSaving}
								>
							</label>
							<div class="label">
								<span class="label-text-alt text-gray-500">
									Public designs can be viewed and used by other users
								</span>
							</div>
						</div>
						
						<button 
							class="btn btn-primary w-full"
							on:click={saveDesign}
							disabled={isSaving || !designName.trim()}
						>
							{#if isSaving}
								<span class="loading loading-spinner loading-sm"></span>
								Saving...
							{:else}
								Save Design
							{/if}
						</button>
					</div>
					
				{:else if activeTab === 'my-designs'}
					<div class="space-y-4">
						<h3 class="text-lg font-semibold">My Saved Designs</h3>
						
						{#if isLoading}
							<div class="flex justify-center py-8">
								<span class="loading loading-spinner loading-lg"></span>
							</div>
						{:else if savedDesigns.length === 0}
							<div class="text-center py-8 text-gray-500">
								<div class="text-4xl mb-2">🎨</div>
								<p>No saved designs yet</p>
								<p class="text-sm">Create and save your first design!</p>
							</div>
						{:else}
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								{#each savedDesigns as design}
									<div class="card variant-soft-surface">
										<div class="card-body p-4">
											<h4 class="card-title text-base">{design.name}</h4>
											<p class="text-sm text-gray-500">
												Created: {new Date(design.createdAt).toLocaleDateString()}
											</p>
											<div class="flex items-center gap-2 text-sm">
												{#if design.isPublic}
													<span class="badge badge-success badge-sm">Public</span>
												{:else}
													<span class="badge badge-ghost badge-sm">Private</span>
												{/if}
											</div>
											<div class="card-actions justify-end mt-2">
												<button 
													class="btn btn-sm btn-primary"
													on:click={() => loadDesign(design)}
												>
													Load
												</button>
												<button 
													class="btn btn-sm btn-error"
													on:click={() => deleteDesign(design.id)}
												>
													Delete
												</button>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
					
				{:else if activeTab === 'public'}
					<div class="space-y-4">
						<h3 class="text-lg font-semibold">Public Design Gallery</h3>
						
						{#if isLoading}
							<div class="flex justify-center py-8">
								<span class="loading loading-spinner loading-lg"></span>
							</div>
						{:else if publicDesigns.length === 0}
							<div class="text-center py-8 text-gray-500">
								<div class="text-4xl mb-2">🌟</div>
								<p>No public designs available</p>
								<p class="text-sm">Be the first to share a design!</p>
							</div>
						{:else}
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								{#each publicDesigns as design}
									<div class="card variant-soft-surface">
										<div class="card-body p-4">
											<h4 class="card-title text-base">{design.name}</h4>
											<p class="text-sm text-gray-500">
												Shared: {new Date(design.createdAt).toLocaleDateString()}
											</p>
											<div class="card-actions justify-end mt-2">
												<button 
													class="btn btn-sm btn-primary"
													on:click={() => loadDesign(design)}
												>
													Use This Design
												</button>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
					
				{:else if activeTab === 'export'}
					<div class="space-y-4">
						<h3 class="text-lg font-semibold">Export Design</h3>
						
						<div class="card variant-soft-surface p-4">
							<h4 class="font-medium mb-2">Export Options</h4>
							<p class="text-sm text-gray-600 mb-4">
								Export your current design as an image to share or print.
							</p>
							
							<button 
								class="btn btn-primary"
								on:click={exportDesign}
								disabled={!currentDesign}
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								Export as PNG
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}