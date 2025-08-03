<script>
	import { onMount } from 'svelte';
	
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
			submitError = 'Please fill in all fields.';
			isSubmitting = false;
			return;
		}
		
		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			submitError = 'Please enter a valid email address.';
			isSubmitting = false;
			return;
		}
		
		// In a real implementation, we would send the form data to a backend service
		// For now, we'll just simulate a successful submission
		try {
			// Simulate API call delay
			await new Promise(resolve => setTimeout(resolve, 1000));
			submitSuccess = true;
			// Reset form
			name = '';
			email = '';
			message = '';
		} catch (error) {
			submitError = 'Oops! Something went wrong. Please try again later.';
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
		<section class="bg-white rounded-2xl p-8 shadow-lg border-2 border-primary/20">
			<h2 class="text-3xl font-bold mb-6 text-primary">Send a Message</h2>
			
			<form on:submit|preventDefault={handleSubmit}>
				<div class="mb-6">
					<label for="name" class="block text-lg font-medium mb-2 text-neutral">Your Name</label>
					<input 
						id="name" 
						type="text" 
						bind:value={name}
						class="w-full px-4 py-3 rounded-xl border-2 border-primary/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
						placeholder="Enter your name"
					>
				</div>
				
				<div class="mb-6">
					<label for="email" class="block text-lg font-medium mb-2 text-neutral">Email Address</label>
					<input 
						id="email" 
						type="email" 
						bind:value={email}
						class="w-full px-4 py-3 rounded-xl border-2 border-primary/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
						placeholder="Enter your email"
					>
				</div>
				
				<div class="mb-6">
					<label for="message" class="block text-lg font-medium mb-2 text-neutral">Your Message</label>
					<textarea 
						id="message" 
						bind:value={message}
						rows="5"
						class="w-full px-4 py-3 rounded-xl border-2 border-primary/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
						placeholder="Tell us about your nail dreams..."
					></textarea>
				</div>
				
				{#if submitError}
					<div class="mb-4 p-4 bg-error/20 text-error rounded-xl">
						{submitError}
					</div>
				{/if}
				
				{#if submitSuccess}
					<div class="mb-4 p-4 bg-success/20 text-success rounded-xl">
						Thank you for your message! We'll get back to you soon.
					</div>
				{/if}
				
				<button 
					type="submit" 
					disabled={isSubmitting}
					class="btn btn-primary w-full text-lg py-3 disabled:opacity-70 disabled:cursor-not-allowed"
				>
					{#if isSubmitting}
						Sending...
					{:else}
						Send Message ✨
					{/if}
				</button>
			</form>
		</section>
		
		<!-- Contact Information -->
		<section>
			<h2 class="text-3xl font-bold mb-6 text-primary">Visit Our Studio</h2>
			
			<div class="space-y-6">
				{#each contactInfo as info}
					<div class="bg-white rounded-2xl p-6 shadow-lg border-2 border-accent/20 flex items-start">
						<div class="text-3xl mr-4">{info.icon}</div>
						<div>
							<h3 class="text-xl font-bold mb-2 text-primary">{info.title}</h3>
							<p class="text-neutral whitespace-pre-line">{info.details}</p>
						</div>
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
