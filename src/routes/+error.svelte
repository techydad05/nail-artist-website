<script>
	import { page } from '$app/stores';
</script>

<div class="container mx-auto px-4 py-8 text-center">
	<h1 class="text-4xl font-bold mb-4 text-error">Oops! Something went wrong.</h1>
	<p class="text-xl mb-6">We're sorry, but an error occurred while loading this page.</p>
	
	{#if $page.error}
		<div class="bg-error/10 border border-error/30 rounded-xl p-6 mb-8 text-left max-w-2xl mx-auto">
			<h2 class="text-2xl font-bold mb-3 text-error">Error Details:</h2>
			<p class="mb-2"><strong>Message:</strong> {$page.error.message}</p>
			<p class="mb-2"><strong>Stack:</strong></p>
			<pre class="bg-black/10 p-4 rounded-lg overflow-x-auto text-sm">{$page.error.stack}</pre>
		</div>
	{/if}
	
	<div class="flex flex-col sm:flex-row justify-center gap-4">
		<button 
			class="btn variant-filled-primary"
			on:click={() => window.location.reload()}
		>
			Try Again
		</button>
		<a href="/" class="btn variant-filled-secondary">
			Go Home
		</a>
	</div>
</div>
