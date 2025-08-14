<script>
	import { onMount } from 'svelte';
	
	let publicDesigns = [];
	let isLoading = true;
	
	onMount(async () => {
		await loadPublicDesigns();
	});
	
	async function loadPublicDesigns() {
		try {
			const response = await fetch('/api/designs');
			const result = await response.json();
			
			if (result.success) {
				publicDesigns = result.designs.slice(0, 6); // Show only first 6
			}
		} catch (error) {
			console.error('Error loading public designs:', error);
		} finally {
			isLoading = false;
		}
	}
	
	function useDesign(design) {
		// Save design to localStorage for the nail designer
		localStorage.setItem('enhanced-nail-design', JSON.stringify({
			nails: design.data.nails,
			timestamp: Date.now()
		}));
		
		// Scroll to nail designer section
		const designerSection = document.querySelector('#nail-designer');
		if (designerSection) {
			designerSection.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

{#if !isLoading && publicDesigns.length > 0}
	<section class="py-12 mb-12">
		<h2 class="text-center mb-12 text-4xl font-bold text-white glow-text flex items-center justify-center">
			<span class="mr-3">🎨</span> Community Designs <span class="ml-3">✨</span>
		</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each publicDesigns as design}
				<div class="bg-neutral/50 rounded-2xl p-4 hover:bg-neutral/70 transition-all duration-300 border border-white/10">
					<h3 class="text-lg font-semibold text-white mb-2">{design.name}</h3>
					
					<!-- Mini nail preview -->
					<div class="flex justify-center gap-2 mb-4">
						{#each design.data.nails || [] as nail, index}
							<div 
								class="w-6 h-8 rounded-full border border-white/20"
								style="background-color: {nail.baseColor}"
								title="{nail.name}: {nail.baseColor}"
							></div>
						{/each}
					</div>
					
					<div class="text-sm text-gray-400 mb-3">
						Shared {new Date(design.createdAt).toLocaleDateString()}
					</div>
					
					<button 
						class="btn btn-primary btn-sm w-full"
						on:click={() => useDesign(design)}
					>
						Try This Design
					</button>
				</div>
			{/each}
		</div>
		
		<div class="text-center mt-8">
			<p class="text-gray-400 text-sm">
				Create your own design and share it with the community!
			</p>
		</div>
	</section>
{/if}

<style>
	.glow-text {
		text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
	}
</style>