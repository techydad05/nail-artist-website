<script lang="ts">
	import { page } from '$app/stores';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	
	const drawerStore = getDrawerStore();
	
	function drawerClose() {
		drawerStore.close();
	}
	
	$: currentPath = $page.url.pathname;
	
	const navItems = [
		{ href: '/', label: 'Home', icon: '🏠' },
		{ href: '/services', label: 'Services', icon: '💅' },
		{ href: '/gallery', label: 'Gallery', icon: '🖼️' },
		{ href: '/contact', label: 'Contact', icon: '📞' },
		{ href: '/admin', label: 'Admin', icon: '⚙️' }
	];
</script>

<nav class="list-nav">
	<ul>
		{#each navItems as item}
			<li>
				<a
					href={item.href}
					class="flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-surface-hover-token"
					class:bg-primary-active-token={currentPath === item.href}
					class:text-on-primary-token={currentPath === item.href}
					on:click={drawerClose}
				>
					<span class="text-lg">{item.icon}</span>
					<span class="font-medium">{item.label}</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>