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
		<section class="bg-surface-50-900-token rounded-xl shadow-lg overflow-hidden">
			<header class="bg-gradient-to-r from-primary-500 to-secondary-500 px-6 py-4">
				<h2 class="text-2xl font-bold text-white">Send a Message</h2>
			</header>
			<div class="p-6">
				<form on:submit|preventDefault={handleSubmit} class="space-y-6">
					<div class="space-y-2">
						<label class="block text-sm font-medium text-surface-900-50-token">Your Name</label>
						<input 
							class="w-full px-4 py-3 rounded-lg border border-surface-300-600-token bg-surface-100-800-token text-surface-900-50-token placeholder-surface-500-400-token focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" 
							type="text" 
							bind:value={name}
							placeholder="Enter your name"
							required
						/>
					</div>
					
					<div class="space-y-2">
						<label class="block text-sm font-medium text-surface-900-50-token">Email Address</label>
						<input 
							class="w-full px-4 py-3 rounded-lg border border-surface-300-600-token bg-surface-100-800-token text-surface-900-50-token placeholder-surface-500-400-token focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" 
							type="email" 
							bind:value={email}
							placeholder="Enter your email"
							required
						/>
					</div>
					
					<div class="space-y-2">
						<label class="block text-sm font-medium text-surface-900-50-token">Your Message</label>
						<textarea 
							class="w-full px-4 py-3 rounded-lg border border-surface-300-600-token bg-surface-100-800-token text-surface-900-50-token placeholder-surface-500-400-token focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none" 
							bind:value={message}
							rows="5"
							placeholder="Tell us about your nail dreams..."
							required
						></textarea>
					</div>
					
					{#if submitError}
						<div class="bg-error-50 border border-error-200 rounded-lg p-4">
							<p class="text-error-700 text-sm">{submitError}</p>
						</div>
					{/if}
					
					{#if submitSuccess}
						<div class="bg-success-50 border border-success-200 rounded-lg p-4">
							<p class="text-success-700 text-sm">Thank you for your message! We'll get back to you soon.</p>
						</div>
					{/if}
					
					<button 
						type="submit" 
						disabled={isSubmitting}
						class="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
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
