<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	
	// Redirect to login - this page is now just a redirect
	onMount(() => {
		goto('/admin/login');
	});
</script>

<!-- This page redirects to login -->