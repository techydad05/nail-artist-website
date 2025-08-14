<script lang="ts">
	import { toastStore, removeToast } from '$lib/stores/toast';
	import { fly } from 'svelte/transition';
	
	$: toasts = $toastStore;
</script>

<div class="toast-container">
	{#each toasts as toast (toast.id)}
		<div
			class="toast {toast.background || 'variant-filled-surface'}"
			transition:fly={{ y: -100, duration: 300 }}
		>
			<div class="toast-message">
				{toast.message}
			</div>
			{#if toast.action}
				<button class="btn btn-sm variant-ghost" on:click={toast.action.handler}>
					{toast.action.label}
				</button>
			{/if}
			<button 
				class="btn btn-sm variant-ghost" 
				on:click={() => removeToast(toast.id)}
				aria-label="Close toast"
			>
				✕
			</button>
		</div>
	{/each}
</div>

<style>
	.toast-container {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 1000;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-width: 400px;
	}
	
	.toast {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		border-radius: 0.5rem;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
		backdrop-filter: blur(8px);
	}
	
	.toast-message {
		flex: 1;
		font-weight: 500;
	}
</style>