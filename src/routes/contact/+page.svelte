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

<div class="container mx-auto px-4 py-8">
	<h1 class="text-center text-4xl font-bold mb-12 text-primary">Get in Touch</h1>
	
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
		<!-- Contact Form -->
		<section class="card">
			<header class="card-header">
				<h2 class="h2">Send a Message</h2>
			</header>
			<section class="p-4">
			
			<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				<label class="label">
					<span>Your Name</span>
					<input 
						class="input" 
						type="text" 
						bind:value={name}
						placeholder="Enter your name"
						required
					/>
				</label>
				
				<label class="label">
					<span>Email Address</span>
					<input 
						class="input" 
						type="email" 
						bind:value={email}
						placeholder="Enter your email"
						required
					/>
				</label>
				
				<label class="label">
					<span>Your Message</span>
					<textarea 
						class="textarea" 
						bind:value={message}
						rows="5"
						placeholder="Tell us about your nail dreams..."
						required
					></textarea>
				</label>
				
				{#if submitError}
					<aside class="alert variant-filled-error">
						<div class="alert-message">
							<p>{submitError}</p>
						</div>
					</aside>
				{/if}
				
				{#if submitSuccess}
					<aside class="alert variant-filled-success">
						<div class="alert-message">
							<p>Thank you for your message! We'll get back to you soon.</p>
						</div>
					</aside>
				{/if}
				
				<button 
					type="submit" 
					disabled={isSubmitting}
					class="btn variant-filled-primary w-full"
				>
					{#if isSubmitting}
						<div class="flex items-center gap-2">
							<div class="progress-bar w-4 h-4">
								<div class="progress-bar-filled bg-white animate-pulse"></div>
							</div>
							<span>Sending...</span>
						</div>
					{:else}
						<span>Send Message ✨</span>
					{/if}
				</button>
			</form>
			</section>
		</section>
		
		<!-- Contact Information -->
		<section>
			<h2 class="text-3xl font-bold mb-6 text-primary">Visit Our Studio</h2>
			
			<div class="space-y-6">
				{#each contactInfo as info}
					<div class="card">
						<section class="p-4 flex items-start">
							<div class="text-3xl mr-4">{info.icon}</div>
							<div>
								<h3 class="h3 mb-2">{info.title}</h3>
								<p class="whitespace-pre-line">{info.details}</p>
							</div>
						</section>
					</div>
				{/each}
			</div>
			
			<!-- Map Placeholder -->
			<div class="mt-12 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center border-2 border-dashed border-primary/30">
				<div class="text-5xl mb-4">🗺️</div>
				<h3 class="text-2xl font-bold mb-2 text-primary">Studio Location</h3>
				<p class="text-neutral mb-4">Interactive map coming soon!</p>
				<div class="bg-gray-200 border-2 border-dashed border-gray-300 rounded-xl w-full h-64 flex items-center justify-center text-gray-500">
					Map Placeholder
				</div>
			</div>
		</section>
	</div>
</div>
