<script>
	let categories = [
		{ id: 'all', name: 'All Designs' },
		{ id: 'glitter', name: 'Glitter' },
		{ id: 'floral', name: 'Floral' },
		{ id: 'abstract', name: 'Abstract' },
		{ id: 'holiday', name: 'Holiday' }
	];
	
	let activeCategory = 'all';
	
	let nailArtPieces = [
		{ id: 1, category: 'glitter', title: 'Rainbow Sparkle', description: 'Multi-colored glitter with rainbow accents' },
		{ id: 2, category: 'floral', title: 'Spring Blossoms', description: 'Delicate cherry blossoms in pastel colors' },
		{ id: 3, category: 'abstract', title: 'Geometric Patterns', description: 'Modern geometric designs with metallic finishes' },
		{ id: 4, category: 'holiday', title: 'Festive Snowflakes', description: 'Winter-themed snowflake designs with silver accents' },
		{ id: 5, category: 'glitter', title: 'Gold Rush', description: 'Luxurious gold glitter with rose gold details' },
		{ id: 6, category: 'floral', title: 'Tropical Paradise', description: 'Vibrant tropical flowers with green accents' },
		{ id: 7, category: 'abstract', title: 'Galaxy Dreams', description: 'Cosmic-inspired designs with deep blues and purples' },
		{ id: 8, category: 'holiday', title: 'Hearts & Cupids', description: 'Romantic Valentine\'s Day heart designs' },
	];
	
	$: filteredPieces = activeCategory === 'all' 
		? nailArtPieces 
		: nailArtPieces.filter(piece => piece.category === activeCategory);
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-center text-4xl font-bold mb-4 text-primary">Nail Art Gallery</h1>
	<p class="text-center text-xl mb-12 text-neutral">Inspiring designs for your next appointment</p>
	
	<!-- Category Filters -->
	<div class="flex flex-wrap justify-center gap-4 mb-12">
		{#each categories as category}
			<button 
				class="btn {activeCategory === category.id ? 'variant-filled-primary' : 'variant-outline-primary'}"
				on:click={() => activeCategory = category.id}
			>
				{category.name}
			</button>
		{/each}
	</div>
	
	<!-- Gallery Grid -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
		{#each filteredPieces as piece}
			<div class="card card-hover overflow-hidden animate-fade-in hover-card">
				<!-- Placeholder for nail art image -->
				<header class="card-header">
					<div class="bg-gradient-to-br from-primary-500/20 to-tertiary-500/20 h-64 flex items-center justify-center text-6xl">
						{#if piece.category === 'glitter'}
							✨
						{:else if piece.category === 'floral'}
							🌸
						{:else if piece.category === 'abstract'}
							🎨
						{:else if piece.category === 'holiday'}
							🎉
						{:else}
							💅
						{/if}
					</div>
				</header>
				<section class="p-4">
					<div class="flex justify-between items-start mb-2">
						<h3 class="h3">{piece.title}</h3>
						<span class="badge variant-soft-primary capitalize">{piece.category}</span>
					</div>
					<p class="mb-4">{piece.description}</p>
				</section>
				<footer class="card-footer">
					<button class="btn variant-filled-secondary btn-sm">Book This Design</button>
				</footer>
			</div>
		{/each}
	</div>
	
	<!-- CTA Section -->
	<section class="text-center py-12 rounded-3xl bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20">
		<h2 class="text-3xl font-bold mb-4 text-primary">Ready to Transform Your Nails?</h2>
		<p class="text-xl mb-8 max-w-2xl mx-auto text-neutral">Book an appointment today and let's create your perfect nail art!</p>
		<div class="flex flex-col sm:flex-row justify-center gap-4">
			<button class="btn variant-filled-primary">Book an Appointment</button>
			<button class="btn variant-outline-tertiary">View Services</button>
		</div>
	</section>
</div>
