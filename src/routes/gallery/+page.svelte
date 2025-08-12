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
				class="btn px-6 py-3 rounded-full transition-all duration-300 {activeCategory === category.id ? 'btn-primary' : 'btn-outline border-2 border-primary text-primary hover:bg-primary/10'}"
				on:click={() => activeCategory = category.id}
			>
				{category.name}
			</button>
		{/each}
	</div>
	
	<!-- Gallery Grid -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
		{#each filteredPieces as piece}
			<div class="bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-primary/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
				<!-- Placeholder for nail art image -->
				<div class="bg-gradient-to-br from-primary/20 to-accent/20 h-64 flex items-center justify-center text-6xl">
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
				<div class="p-6">
					<h3 class="text-xl font-bold mb-2 text-primary">{piece.title}</h3>
					<p class="text-neutral mb-4">{piece.description}</p>
					<button class="btn btn-secondary btn-sm flex items-center justify-center leading-none py-2">Book This Design</button>
				</div>
			</div>
		{/each}
	</div>
	
	<!-- CTA Section -->
	<section class="text-center py-12 rounded-3xl bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20">
		<h2 class="text-3xl font-bold mb-4 text-primary">Ready to Transform Your Nails?</h2>
		<p class="text-xl mb-8 max-w-2xl mx-auto text-neutral">Book an appointment today and let's create your perfect nail art!</p>
		<div class="flex flex-col sm:flex-row justify-center gap-4">
			<button class="btn btn-primary text-lg px-8 py-3 flex items-center justify-center leading-none">Book an Appointment</button>
			<button class="btn btn-outline border-2 border-accent text-accent hover:bg-accent/10 text-lg px-8 py-3 flex items-center justify-center leading-none">View Services</button>
		</div>
	</section>
</div>
