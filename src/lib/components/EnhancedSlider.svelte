<script>
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	
	export let images = [];
	export let autoPlay = true;
	export let autoPlayInterval = 5000;
	export let showThumbnails = true;
	export let showCaptions = true;
	export let enableKeyboardNav = true;
	
	let currentSlide = 0;
	let interval;
	let sliderContainer;
	let isHovering = false;
	
	function nextSlide() {
		currentSlide = (currentSlide + 1) % images.length;
	}
	
	function prevSlide() {
		currentSlide = (currentSlide - 1 + images.length) % images.length;
	}
	
	function goToSlide(index) {
		currentSlide = index;
	}
	
	function handleKeyDown(e) {
		if (!enableKeyboardNav) return;
		
		if (e.key === 'ArrowRight') {
			nextSlide();
		} else if (e.key === 'ArrowLeft') {
			prevSlide();
		} else if (e.key === 'Escape') {
			currentSlide = 0;
		}
	}
	
	function handleWheel(e) {
		if (isHovering) {
			e.preventDefault();
			if (e.deltaY > 0) {
				nextSlide();
			} else {
				prevSlide();
			}
		}
	}
	
	$: if (autoPlay && !isHovering) {
		if (interval) clearInterval(interval);
		interval = setInterval(nextSlide, autoPlayInterval);
	} else {
		if (interval) clearInterval(interval);
	}
	
	$: if (images.length > 0 && currentSlide >= images.length) {
		currentSlide = 0;
	}
	
	onMount(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('keydown', handleKeyDown);
			if (sliderContainer) {
				sliderContainer.addEventListener('wheel', handleWheel, { passive: false });
			}
		}
	});
	
	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', handleKeyDown);
			if (sliderContainer) {
				sliderContainer.removeEventListener('wheel', handleWheel);
			}
		}
		if (interval) clearInterval(interval);
	});
</script>

<div 
	class="relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl cursor-pointer"
	bind:this={sliderContainer}
	on:mouseenter={() => isHovering = true}
	on:mouseleave={() => isHovering = false}
	role="region"
	aria-label="Image slider"
>
	<!-- Main Slider Area -->
	<div class="relative h-64 sm:h-80 md:h-96 lg:h-[500px]">
		{#each images as image, index}
			<div 
				class="absolute inset-0 transition-all duration-700 ease-in-out transform"
				class:translate-x-0={index === currentSlide}
				class:-translate-x-full={index < currentSlide}
				class:translate-x-full={index > currentSlide}
				class:opacity-100={index === currentSlide}
				class:opacity-0={index !== currentSlide}
			>
				<div 
					class="w-full h-full bg-cover bg-center relative"
					style="background-image: url('{image.url}');"
				>
					<!-- Overlay -->
					<div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
					
					<!-- Caption -->
					{#if showCaptions && image.title}
						<div 
							class="absolute bottom-6 left-6 right-6 text-white"
							in:fly={{ x: -100, duration: 500 }}
							out:fade={{ duration: 300 }}
						>
							<h3 class="text-2xl md:text-3xl font-bold mb-2 glow-text">{image.title}</h3>
							{#if image.description}
								<p class="text-lg md:text-xl">{image.description}</p>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		{/each}
		
		<!-- Navigation Arrows -->
		<button 
			class="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-secondary hover:bg-secondary/90 text-white rounded-full flex items-center justify-center z-20 opacity-75 hover:opacity-100 transition-all text-sm md:text-base shadow-lg hover:scale-110" 
			on:click={prevSlide}
			aria-label="Previous slide"
		>
			❮
		</button>
		<button 
			class="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-secondary hover:bg-secondary/90 text-white rounded-full flex items-center justify-center z-20 opacity-75 hover:opacity-100 transition-all text-sm md:text-base shadow-lg hover:scale-110" 
			on:click={nextSlide}
			aria-label="Next slide"
		>
			❯
		</button>
		
		<!-- Progress Bar -->
		<div class="absolute top-0 left-0 right-0 h-1 bg-white/20">
			<div 
				class="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-1000 ease-linear"
				style="width: {autoPlay && !isHovering ? (100 * (autoPlayInterval / 1000)) + '%' : '0%'}"
			></div>
		</div>
	</div>
	
	<!-- Thumbnails -->
	{#if showThumbnails && images.length > 1}
		<div class="flex justify-center py-4 bg-neutral">
			<div class="flex space-x-2 overflow-x-auto px-4 max-w-4xl mx-auto">
				{#each images as image, index}
					<button 
						class="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300"
						class:border-primary={index === currentSlide}
						class:border-transparent={index !== currentSlide}
						class:ring-2={index === currentSlide}
						class:ring-primary={index === currentSlide}
						on:click={() => goToSlide(index)}
						aria-label={`Go to slide ${index + 1}`}
					>
						<div 
							class="w-full h-full bg-cover bg-center"
							style={`background-image: url('${image.url}');`}
						></div>
					</button>
				{/each}
			</div>
		</div>
	{/if}
	
	<!-- Dots Indicator -->
	<div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
		{#each images as _, index}
			<button 
				class={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-primary scale-125' : 'bg-white/50 hover:bg-white/75'}`}
				on:click={() => goToSlide(index)}
				aria-label="Go to slide {index + 1}"
			>
			</button>
		{/each}
	</div>
</div>

<style>
	.shadow-3xl {
		box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
	}
</style>
