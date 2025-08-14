<script>
	import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher();
	
	export let isOpen = false;
	
	let isLogin = true;
	let email = '';
	let name = '';
	let isSubmitting = false;
	let error = '';
	
	// Form validation
	function validateEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}
	
	async function handleSubmit() {
		error = '';
		
		if (!email || !validateEmail(email)) {
			error = 'Please enter a valid email address';
			return;
		}
		
		if (!isLogin && (!name || name.trim().length < 2)) {
			error = 'Name must be at least 2 characters';
			return;
		}
		
		isSubmitting = true;
		
		try {
			const response = await fetch('/api/auth', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: email.trim(),
					name: name.trim(),
					action: isLogin ? 'login' : 'signup'
				})
			});
			
			const result = await response.json();
			
			if (result.success) {
				dispatch('auth-success', result.user);
				closeModal();
			} else {
				error = result.error || 'Authentication failed';
			}
		} catch (err) {
			console.error('Auth error:', err);
			error = 'Network error. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}
	
	function closeModal() {
		isOpen = false;
		email = '';
		name = '';
		error = '';
		isLogin = true;
		dispatch('close');
	}
	
	function toggleMode() {
		isLogin = !isLogin;
		error = '';
	}
	
	// Handle escape key
	function handleKeydown(event) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}
	
	// Close modal when clicking outside
	function handleBackdropClick(event) {
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<div 
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
		on:click={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby="auth-modal-title"
	>
		<div class="bg-base-100 rounded-2xl shadow-2xl max-w-md w-full">
			<!-- Modal Header -->
			<div class="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-t-2xl">
				<div class="flex justify-between items-center">
					<h2 id="auth-modal-title" class="text-xl font-bold flex items-center">
						<span class="mr-2 text-2xl">👤</span> 
						{isLogin ? 'Welcome Back!' : 'Join Us!'}
					</h2>
					<button 
						class="btn btn-ghost btn-circle text-white hover:bg-white/20"
						on:click={closeModal}
						aria-label="Close modal"
					>
						✕
					</button>
				</div>
			</div>
			
			<!-- Modal Content -->
			<div class="p-6">
				<p class="text-center text-base-content/70 mb-6">
					{isLogin ? 'Sign in to save your nail designs' : 'Create an account to save and share your designs'}
				</p>
				
				<form on:submit|preventDefault={handleSubmit} class="space-y-4">
					{#if !isLogin}
						<div>
							<label for="name" class="block text-sm font-medium text-base-content mb-1">
								Full Name *
							</label>
							<input
								id="name"
								type="text"
								bind:value={name}
								class="input input-bordered w-full bg-base-200 text-base-content"
								placeholder="Enter your full name"
								required={!isLogin}
								disabled={isSubmitting}
							>
						</div>
					{/if}
					
					<div>
						<label for="email" class="block text-sm font-medium text-base-content mb-1">
							Email Address *
						</label>
						<input
							id="email"
							type="email"
							bind:value={email}
							class="input input-bordered w-full bg-base-200 text-base-content"
							placeholder="your.email@example.com"
							required
							disabled={isSubmitting}
						>
					</div>
					
					{#if error}
						<div class="alert alert-error">
							<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span>{error}</span>
						</div>
					{/if}
					
					<div class="flex flex-col gap-3 pt-4">
						<button
							type="submit"
							class="btn btn-primary w-full"
							disabled={isSubmitting}
						>
							{#if isSubmitting}
								<span class="loading loading-spinner loading-sm"></span>
								{isLogin ? 'Signing In...' : 'Creating Account...'}
							{:else}
								{isLogin ? 'Sign In' : 'Create Account'}
							{/if}
						</button>
						
						<button
							type="button"
							class="btn btn-ghost w-full"
							on:click={toggleMode}
							disabled={isSubmitting}
						>
							{isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
						</button>
					</div>
				</form>
				
				<div class="mt-6 text-center">
					<p class="text-xs text-base-content/50">
						By continuing, you agree to save your designs locally and optionally share them with our nail technicians.
					</p>
				</div>
			</div>
		</div>
	</div>
{/if}