<script>
	import { onMount } from 'svelte';
	import { showSuccess, showError } from '$lib/stores/toast';
	
	let name = '';
	let email = '';
	let message = '';
	let isSubmitting = false;
	let submitSuccess = false;
	let submitError = '';
	
	async function handleSubmit() {
		isSubmitting = true;
		submitError = '';
		
		// Form validation
		if (!name || !email || !message) {
			showError('Please fill in all fields.');
			isSubmitting = false;
			return;
		}
		
		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			showError('Please enter a valid email address.');
			isSubmitting = false;
			return;
		}
		
		// In a real implementation, we would send the form data to a backend service
		// For now, we'll just simulate a successful submission
		try {
			// Simulate API call delay
			await new Promise(resolve => setTimeout(resolve, 1000));
			showSuccess('Thank you for your message! We\'ll get back to you soon.');
			// Reset form
			name = '';
			email = '';
			message = '';
			submitSuccess = true;
		} catch (error) {
			showError('Oops! Something went wrong. Please try again later.');
		} finally {
			isSubmitting = false;
		}
	}
	
	let contactInfo = [
		{ 
			title: "Studio Location", 
			details: "123 Beauty Street, Nail District, ND 12345",
			icon: "📍"
		},
		{ 
			title: "Phone", 
			details: "(555) 123-4567",
			icon: "📞"
		},
		{ 
			title: "Email", 
			details: "hello@polishedperfection.com",
			icon: "✉️"
		},
		{ 
			title: "Hours", 
			details: "Tuesday - Saturday: 10am - 7pm\nSunday - Monday: Closed",
			icon: "⏰"
		}
	];
</script>

<div class="container mx-auto px-4 py-12">
	<div class="text-center mb-16">
		<h1 class="text-5xl font-bold mb-6 text-surface-900-50-token">Get in Touch</h1>
		<p class="text-xl text-surface-600-300-token max-w-2xl mx-auto">Ready to book your appointment or have questions? We'd love to hear from you.</p>
	</div>
	
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
		<!-- Contact Form -->
		<section class="card bg-surface-50-900-token">
			<header class="card-header bg-gradient-to-r from-primary-500 to-secondary-500">
				<h2 class="text-2xl font-bold text-white">Send a Message</h2>
			</header>
			<div class="p-6">
				<form on:submit|preventDefault={handleSubmit} class="space-y-6">
					<label class="label">
						<span class="text-surface-900-50-token">Your Name</span>
						<input 
							class="input bg-surface-100-800-token text-surface-900-50-token border-surface-300-600-token focus:border-primary-500" 
							type="text" 
							bind:value={name}
							placeholder="Enter your name"
							required
						/>
					</label>
					
					<label class="label">
						<span class="text-surface-900-50-token">Email Address</span>
						<input 
							class="input bg-surface-100-800-token text-surface-900-50-token border-surface-300-600-token focus:border-primary-500" 
							type="email" 
							bind:value={email}
							placeholder="Enter your email"
							required
						/>
					</label>
					
					<label class="label">
						<span class="text-surface-900-50-token">Your Message</span>
						<textarea 
							class="textarea bg-surface-100-800-token text-surface-900-50-token border-surface-300-600-token focus:border-primary-500" 
							bind:value={message}
							rows="5"
							placeholder="Tell us about your nail dreams..."
							required
						></textarea>
					</label>
					
					{#if submitError}
						<aside class="alert variant-filled-error">
							<p>{submitError}</p>
						</aside>
					{/if}
					
					{#if submitSuccess}
						<aside class="alert variant-filled-success">
							<p>Thank you for your message! We'll get back to you soon.</p>
						</aside>
					{/if}
					
					<button 
						type="submit" 
						disabled={isSubmitting}
						class="btn variant-filled-primary w-full"
					>
						{#if isSubmitting}
							<div class="flex items-center justify-center gap-2">
								<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								<span>Sending...</span>
							</div>
						{:else}
							<span>Send Message ✨</span>
						{/if}
					</button>
				</form>
			</div>
		</section>
		
		<!-- Contact Information -->
		<section>
			<h2 class="text-3xl font-bold mb-6 text-primary-500">Visit Our Studio</h2>
			
			<div class="space-y-4">
				{#each contactInfo as info}
					<div class="card bg-surface-50-900-token hover:shadow-lg transition-shadow">
						<div class="p-6 flex items-start">
							<div class="text-3xl mr-4 flex-shrink-0">{info.icon}</div>
							<div>
								<h3 class="text-lg font-semibold text-surface-900-50-token mb-2">{info.title}</h3>
								<p class="text-surface-600-300-token whitespace-pre-line">{info.details}</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
			
			<!-- Map Placeholder -->
			<div class="mt-8 card bg-surface-100-800-token border-2 border-dashed border-primary-500/30">
				<div class="p-6 text-center">
					<div class="text-4xl mb-3">🗺️</div>
					<h3 class="text-xl font-bold mb-2 text-primary-500">Studio Location</h3>
					<p class="text-surface-600-300-token mb-4">Interactive map coming soon!</p>
					<div class="bg-surface-200-700-token border-2 border-dashed border-surface-300-600-token rounded-lg w-full h-48 flex items-center justify-center text-surface-500-400-token">
						<div class="text-center">
							<div class="text-2xl mb-2">📍</div>
							<p>Map Placeholder</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</div>
