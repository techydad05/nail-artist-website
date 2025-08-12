<script>
	import { onMount } from 'svelte';
	
	let isMenuOpen = false;
	
	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<header class="bg-neutral shadow-md sticky top-0 z-50 border-b-4 border-primary">
	<div class="container mx-auto px-4">
		<div class="flex justify-between items-center h-16 md:h-20">
			<!-- Logo -->
			<div class="flex items-center">
				<img src="/logo.png" alt="Polished Perfection Logo" class="h-10 md:h-14 w-auto mr-3" />
				<h1 class="text-lg md:text-2xl font-bold text-primary glow-text hidden md:block">Polished Perfection</h1>
			</div>
			
			<!-- Desktop Navigation -->
			<nav class="hidden md:flex space-x-8">
				<a href="/" class="text-lg font-medium text-white hover:text-primary transition-colors">Home</a>
				<a href="/gallery" class="text-lg font-medium text-white hover:text-primary transition-colors">Gallery</a>
				<a href="/services" class="text-lg font-medium text-white hover:text-primary transition-colors">Services</a>
				<a href="/contact" class="text-lg font-medium text-white hover:text-primary transition-colors">Contact</a>
			</nav>
			
			<!-- Mobile Menu Button -->
			<button 
				class="md:hidden text-2xl text-primary focus:outline-none p-2 rounded-lg hover:bg-primary hover:bg-opacity-20 transition-colors"
				on:click={toggleMenu}
			>
				{#if isMenuOpen}
					✕
				{:else}
					☰
				{/if}
			</button>
		</div>
	</div>
	
	<!-- Mobile Navigation Menu -->
	{#if isMenuOpen}
		<nav class="md:hidden bg-neutral border-t-2 border-primary/50 py-6 px-4 absolute w-full shadow-xl backdrop-blur-sm">
			<div class="container mx-auto flex flex-col space-y-4">
				<a href="/" class="text-lg font-medium text-white hover:text-primary py-3 px-4 rounded-lg hover:bg-primary hover:bg-opacity-20 transition-all" on:click={toggleMenu}>🏠 Home</a>
				<a href="/gallery" class="text-lg font-medium text-white hover:text-primary py-3 px-4 rounded-lg hover:bg-primary hover:bg-opacity-20 transition-all" on:click={toggleMenu}>🎨 Gallery</a>
				<a href="/services" class="text-lg font-medium text-white hover:text-primary py-3 px-4 rounded-lg hover:bg-primary hover:bg-opacity-20 transition-all" on:click={toggleMenu}>💅 Services</a>
				<a href="/contact" class="text-lg font-medium text-white hover:text-primary py-3 px-4 rounded-lg hover:bg-primary hover:bg-opacity-20 transition-all" on:click={toggleMenu}>📞 Contact</a>
			</div>
		</nav>
	{/if}
</header>
