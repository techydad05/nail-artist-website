<script>
	import { onMount } from 'svelte';
	import emailjs from '@emailjs/browser';
	
	// Animation states
	let isVisible = false;
	let isSending = false;
	let isSent = false;
	let isError = false;
	let errorMessage = '';
	
	// Form data
	let name = '';
	let email = '';
	let message = '';
	let theme = 'nail-art';
	
	// Fun message themes
	const themes = [
		{ id: 'nail-art', name: 'Nail Art', emoji: '💅', color: 'from-pink-500 to-purple-500' },
		{ id: 'spa-day', name: 'Spa Day', emoji: '🌸', color: 'from-green-400 to-blue-500' },
		{ id: 'glitter', name: 'Glitter', emoji: '✨', color: 'from-yellow-400 to-red-500' },
		{ id: 'cute', name: 'Cute', emoji: '💖', color: 'from-pink-400 to-rose-500' }
	];
	
	// Current theme
	$: currentTheme = themes.find(t => t.id === theme);
	
	// Animation elements
	let container;
	let messageElements = [];
	
	// Initialize animation
	function showForm() {
		isVisible = true;
	}
	
	function hideForm() {
		isVisible = false;
		// Reset form after closing
		setTimeout(() => {
			if (!isVisible) {
				name = '';
				email = '';
				message = '';
				isSent = false;
				isError = false;
			}
		}, 300);
	}
	
	// Send message function
	async function sendMessage() {
		if (!name || !email || !message) {
			isError = true;
			errorMessage = 'Please fill in all fields!';
			return;
		}
		
		// Simple email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			isError = true;
			errorMessage = 'Please enter a valid email address!';
			return;
		}
		
		isSending = true;
		isError = false;
		
		try {
			// Using EmailJS to send the message
			// You'll need to replace these with your actual EmailJS credentials
			const templateParams = {
				from_name: name,
				from_email: email,
				message: message,
				theme: currentTheme.name,
				to_email: 'nailartist@example.com' // Replace with actual email
			};
			
			// This would normally use your EmailJS service
			// For demo purposes, we'll simulate a successful send
			await new Promise(resolve => setTimeout(resolve, 1500));
			
			// In a real implementation, you would use:
			// await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_PUBLIC_KEY');
			
			isSending = false;
			isSent = true;
			
			// Reset form after success
			setTimeout(() => {
				isSent = false;
				isVisible = false;
				name = '';
				email = '';
				message = '';
			}, 3000);
		} catch (error) {
			isSending = false;
			isError = true;
			errorMessage = 'Oops! Failed to send message. Please try again later.';
			console.error('EmailJS error:', error);
		}
	}
	
	// Fun animations for the message elements
	function triggerSparkle() {
		if (!container) return;
		
		const sparkle = document.createElement('div');
		sparkle.innerHTML = '✨';
		sparkle.className = 'absolute text-2xl animate-bounce';
		
		// Random position
		const x = Math.random() * 100;
		const y = Math.random() * 100;
		sparkle.style.left = `${x}%`;
		sparkle.style.top = `${y}%`;
		
		container.appendChild(sparkle);
		
		// Remove after animation
		setTimeout(() => {
			if (sparkle.parentNode) {
				sparkle.parentNode.removeChild(sparkle);
			}
		}, 2000);
	}
	
	let sparkleInterval;
	
	const updateInterval = () => {
		if (isVisible) {
			sparkleInterval = setInterval(triggerSparkle, 300);
		} else {
			if (sparkleInterval) clearInterval(sparkleInterval);
		}
	};
	
	// Reactive update for sparkle interval
	$: {
		if (isVisible) {
			updateInterval();
		} else {
			if (sparkleInterval) clearInterval(sparkleInterval);
		}
	}
	
	onMount(() => {
		// Initial call
		updateInterval();
		
		return () => {
			if (sparkleInterval) clearInterval(sparkleInterval);
		};
	});
</script>

<!-- Fun Message Trigger Button -->
<button 
	class="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/50"
	class:animate-bounce={!isVisible}
	on:click={isVisible ? hideForm : showForm}
	aria-label={isVisible ? 'Close message form' : 'Send us a fun message'}
>
	{#if isVisible}
		✕
	{:else}
		💬
	{/if}
</button>

<!-- Fun Message Form -->
{#if isVisible}
	<div 
		class="fixed bottom-24 right-8 z-40 w-80 bg-neutral text-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-out"
		class:translate-x-0={isVisible}
		class:translate-x-full={!isVisible}
		bind:this={container}
	>
		<!-- Header with theme selector -->
		<div class="p-4 bg-gradient-to-r {currentTheme?.color || 'from-pink-500 to-purple-500'}">
			<h3 class="text-xl font-bold flex items-center">
				<span class="mr-2 text-2xl">{currentTheme?.emoji || '💬'}</span>
				Send a Fun Message!
			</h3>
			
			<!-- Theme selector -->
			<div class="flex flex-wrap gap-2 mt-3">
				{#each themes as t}
					<button
						class={`px-2 py-1 text-xs rounded-full flex items-center transition-all duration-200 ${t.id === theme ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}
						on:click={() => theme = t.id}
					>
						<span class="mr-1">{t.emoji}</span>
						{t.name}
					</button>
				{/each}
			</div>
		</div>
		
		<!-- Form -->
		<div class="p-4">
			{#if isSent}
				<div class="text-center py-6">
					<div class="text-4xl mb-3">🎉</div>
					<h4 class="text-xl font-bold text-primary mb-2">Message Sent!</h4>
					<p class="text-gray-300">Thanks for your {currentTheme?.name.toLowerCase()} message! We'll get back to you soon.</p>
				</div>
			{:else}
				<div class="space-y-4">
					<div>
						<label for="name-input" class="block text-sm font-medium mb-1">Your Name</label>
						<input 
							id="name-input"
							type="text" 
							bind:value={name}
							class="input"
							placeholder="Sparkle McSparkles"
						>
					</div>
					
					<div>
						<label for="email-input" class="block text-sm font-medium mb-1">Your Email</label>
						<input 
							id="email-input"
							type="email" 
							bind:value={email}
							class="input"
							placeholder="sparkle@example.com"
						>
					</div>
					
					<div>
						<label for="message-input" class="block text-sm font-medium mb-1">Your {currentTheme?.name} Message</label>
						<textarea 
							id="message-input"
							bind:value={message}
							class="textarea h-24"
							placeholder="Tell us about your {currentTheme?.name.toLowerCase()} dreams..."
						></textarea>
					</div>
					
					{#if isError}
						<div class="text-warning text-sm p-2 bg-warning/10 rounded-lg flex items-center">
							<span class="mr-2">⚠️</span>
							{errorMessage}
						</div>
					{/if}
					
					<button 
						class="w-full py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary disabled:opacity-80 disabled:cursor-not-allowed"
						on:click={sendMessage}
						disabled={isSending}
					>
						{#if isSending}
							<span class="flex items-center">
								<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Sending...
							</span>
						{:else}
							<span class="flex items-center">
								<span class="mr-2">{currentTheme?.emoji || '💬'}</span>
								Send Message
							</span>
						{/if}
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	/* Add any additional styles here */
</style>
