<script>
	import '../app.css';
	import Navbar from '../lib/components/Navbar.svelte';
	import FunMessage from '../lib/components/FunMessage.svelte';
</script>

<div class="min-h-screen flex flex-col bg-base-100">
	<Navbar />
	<main class="flex-grow relative">
		<slot />
		<FunMessage />
	</main>
	<footer class="bg-gradient-to-r from-neutral to-base-300 text-white py-12 mt-12">
		<div class="container mx-auto px-4">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div class="text-center md:text-left">
					<p class="text-2xl font-bold mb-4 glow-text flex items-center">
						<span class="mr-2">💅</span> Polished Perfection <span class="ml-2">✨</span>
					</p>
					<p class="text-gray-300 mb-4">Where creativity meets professionalism</p>
					<div class="flex justify-center md:justify-start space-x-4">
						<div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover-card cursor-pointer transition-transform hover:scale-110">
							<span class="text-xl">📱</span>
						</div>
						<div class="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover-card cursor-pointer transition-transform hover:scale-110">
							<span class="text-xl">📷</span>
						</div>
						<div class="w-10 h-10 bg-accent rounded-full flex items-center justify-center hover-card cursor-pointer transition-transform hover:scale-110">
							<span class="text-xl">💬</span>
						</div>
					</div>
				</div>
				<div class="text-center">
					<h3 class="text-lg font-bold text-primary mb-4 flex items-center justify-center md:justify-start">
						<span class="mr-2">🔗</span> Quick Links
					</h3>
					<div class="space-y-2">
						<a href="/" class="block text-gray-300 hover:text-primary transition-colors hover:translate-x-1">Home</a>
						<a href="/services" class="block text-gray-300 hover:text-primary transition-colors hover:translate-x-1">Services</a>
						<a href="/gallery" class="block text-gray-300 hover:text-primary transition-colors hover:translate-x-1">Gallery</a>
						<a href="/contact" class="block text-gray-300 hover:text-primary transition-colors hover:translate-x-1">Contact</a>
					</div>
				</div>
				<div class="text-center md:text-right">
					<h3 class="text-lg font-bold text-primary mb-4 flex items-center justify-center md:justify-end">
						<span class="mr-2">📬</span> Contact Info
					</h3>
					<div class="space-y-2 text-gray-300">
						<p class="flex items-center justify-center md:justify-end"><span class="mr-2">📍</span> 123 Beauty Lane, City</p>
						<p class="flex items-center justify-center md:justify-end"><span class="mr-2">📞</span> (555) 123-NAIL</p>
						<p class="flex items-center justify-center md:justify-end"><span class="mr-2">✉️</span> hello@polishedperfection.com</p>
					</div>
				</div>
			</div>
			<div class="border-t border-gray-600 mt-8 pt-8 text-center">
				<p class="text-sm text-gray-400">© 2024 Polished Perfection Nail Studio. All rights reserved.</p>
			</div>
		</div>
	</footer>
</div>

<style>
	:global(body) {
		font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}
</style>
