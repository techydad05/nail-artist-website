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
	<div class="modal-backdrop">
		<div class="modal max-w-md">
			<header class="modal-header bg-gradient-to-r from-primary-500 to-secondary-500 text-on-primary-token">
				<h2 class="modal-title">
					<span class="mr-2 text-2xl">👤</span> 
					{isLogin ? 'Welcome Back!' : 'Join Us!'}
				</h2>
			</header>
			
			<section class="modal-body">
				<p class="text-center text-base-content/70 mb-6">
					{isLogin ? 'Sign in to save your nail designs' : 'Create an account to save and share your designs'}
				</p>
				
				<form on:submit|preventDefault={handleSubmit} class="space-y-4">
					{#if !isLogin}
						<label class="label">
							<span>Full Name *</span>
							<input
								class="input"
								type="text"
								bind:value={name}
								placeholder="Enter your full name"
								required={!isLogin}
								disabled={isSubmitting}
							/>
						</label>
					{/if}
					
					<label class="label">
						<span>Email Address *</span>
						<input
							class="input"
							type="email"
							bind:value={email}
							placeholder="your.email@example.com"
							required
							disabled={isSubmitting}
						/>
					</label>
					
					{#if error}
						<aside class="alert variant-filled-error">
							<div class="alert-message">
								<p>{error}</p>
							</div>
						</aside>
					{/if}
					
					<div class="flex flex-col gap-3 pt-4">
						<button
							type="submit"
							class="btn variant-filled-primary w-full"
							disabled={isSubmitting}
						>
							{#if isSubmitting}
								<div class="flex items-center gap-2">
									<div class="progress-bar w-4 h-4">
										<div class="progress-bar-filled bg-white animate-pulse"></div>
									</div>
									{isLogin ? 'Signing In...' : 'Creating Account...'}
								</div>
							{:else}
								{isLogin ? 'Sign In' : 'Create Account'}
							{/if}
						</button>
						
						<button
							type="button"
							class="btn variant-ghost w-full"
							on:click={toggleMode}
							disabled={isSubmitting}
						>
							{isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
						</button>
					</div>
				</form>
				
				<div class="mt-6 text-center">
					<p class="text-xs opacity-50">
						By continuing, you agree to save your designs locally and optionally share them with our nail technicians.
					</p>
				</div>
			</section>
			
			<footer class="modal-footer">
				<button class="btn variant-ghost-surface" on:click={closeModal}>Cancel</button>
			</footer>
		</div>
	</div>
{/if}