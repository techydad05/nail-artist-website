<script>
	import '../app.css';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { initializeStores, Drawer, getDrawerStore } from '@skeletonlabs/skeleton';
	import Navigation from '../lib/components/Navigation.svelte';
	import FunMessage from '../lib/components/FunMessage.svelte';
	import ThemeToggle from '../lib/components/ThemeToggle.svelte';
	import ToastContainer from '../lib/components/ToastContainer.svelte';
	
	initializeStores();
	const drawerStore = getDrawerStore();
	
	function drawerOpen() {
		drawerStore.open();
	}
</script>

<!-- Drawer -->
<Drawer>
	<h2 class="p-4 text-xl font-bold">Navigation</h2>
	<hr />
	<Navigation />
</Drawer>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<div class="flex items-center">
					<button
						class="btn btn-sm mr-4 lg:hidden"
						on:click={drawerOpen}
					>
						<span>
							<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
								<rect width="100" height="20"></rect>
								<rect y="30" width="100" height="20"></rect>
								<rect y="60" width="100" height="20"></rect>
							</svg>
						</span>
					</button>
					<strong class="text-xl uppercase glow-text flex items-center">
						<span class="mr-2">💅</span> Polished Perfection <span class="ml-2">✨</span>
					</strong>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<div class="hidden lg:block">
					<Navigation />
				</div>
				<ThemeToggle />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	
	<!-- Page Route Content -->
	<div class="container mx-auto p-8 space-y-8">
		<slot />
		<FunMessage />
	</div>
	
	<svelte:fragment slot="pageFooter">
		<footer class="bg-surface-100-800-token border-t border-surface-500/30 py-12 mt-12">
			<div class="container mx-auto px-4">
				<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div class="text-center md:text-left">
						<p class="text-2xl font-bold mb-4 glow-text flex items-center">
							<span class="mr-2">💅</span> Polished Perfection <span class="ml-2">✨</span>
						</p>
						<p class="text-surface-600-300-token mb-4">Where creativity meets professionalism</p>
						<div class="flex justify-center md:justify-start space-x-4">
							<div class="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center hover-card cursor-pointer transition-transform hover:scale-110">
								<span class="text-xl">📱</span>
							</div>
							<div class="w-10 h-10 bg-secondary-500 rounded-full flex items-center justify-center hover-card cursor-pointer transition-transform hover:scale-110">
								<span class="text-xl">📷</span>
							</div>
							<div class="w-10 h-10 bg-tertiary-500 rounded-full flex items-center justify-center hover-card cursor-pointer transition-transform hover:scale-110">
								<span class="text-xl">💬</span>
							</div>
						</div>
					</div>
					<div class="text-center">
						<h3 class="text-lg font-bold text-primary-500 mb-4 flex items-center justify-center md:justify-start">
							<span class="mr-2">🔗</span> Quick Links
						</h3>
						<div class="space-y-2">
							<a href="/" class="block text-surface-600-300-token hover:text-primary-500 transition-colors hover:translate-x-1">Home</a>
							<a href="/services" class="block text-surface-600-300-token hover:text-primary-500 transition-colors hover:translate-x-1">Services</a>
							<a href="/gallery" class="block text-surface-600-300-token hover:text-primary-500 transition-colors hover:translate-x-1">Gallery</a>
							<a href="/contact" class="block text-surface-600-300-token hover:text-primary-500 transition-colors hover:translate-x-1">Contact</a>
						</div>
					</div>
					<div class="text-center md:text-right">
						<h3 class="text-lg font-bold text-primary-500 mb-4 flex items-center justify-center md:justify-end">
							<span class="mr-2">📬</span> Contact Info
						</h3>
						<div class="space-y-2 text-surface-600-300-token">
							<p class="flex items-center justify-center md:justify-end"><span class="mr-2">📍</span> 123 Beauty Lane, City</p>
							<p class="flex items-center justify-center md:justify-end"><span class="mr-2">📞</span> (555) 123-NAIL</p>
							<p class="flex items-center justify-center md:justify-end"><span class="mr-2">✉️</span> hello@polishedperfection.com</p>
						</div>
					</div>
				</div>
				<div class="border-t border-surface-500/30 mt-8 pt-8 text-center">
					<p class="text-sm text-surface-600-300-token">© 2024 Polished Perfection Nail Studio. All rights reserved.</p>
				</div>
			</div>
		</footer>
	</svelte:fragment>
</AppShell>

<!-- Toast Container -->
<ToastContainer />

<style>
	:global(body) {
		font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}
</style>
