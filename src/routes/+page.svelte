<script>
	import Logo from '../lib/components/Logo.svelte';
	
	function openAppointmentModal() {
		window.dispatchEvent(new CustomEvent('open-appointment-modal'));
	}
	
	let services = [
		{ 
			title: "Gel Manicures", 
			description: "Long-lasting, chip-resistant gel polish that keeps your nails looking perfect for weeks.",
			price: "From $35",
			icon: "💅"
		},
		{ 
			title: "Nail Art", 
			description: "Custom designs from simple elegance to intricate masterpieces.",
			price: "From $15",
			icon: "🎨"
		},
		{ 
			title: "Acrylic Extensions", 
			description: "Durable extensions in any length and shape you desire.",
			price: "From $50",
			icon: "✨"
		},
		{ 
			title: "Spa Treatments", 
			description: "Relaxing hand and cuticle care with premium moisturizing treatments.",
			price: "From $25",
			icon: "🌸"
		}
	];
	
	let testimonials = [
		{ 
			name: "Sarah M.", 
			text: "Absolutely love my nails! The attention to detail is incredible.",
			rating: 5
		},
		{ 
			name: "Jessica L.", 
			text: "Best nail salon experience I've ever had. So professional!",
			rating: 5
		},
		{ 
			name: "Emma K.", 
			text: "My gel manicure lasted 3 weeks and still looked perfect.",
			rating: 5
		}
	];
</script>

<svelte:head>
	<title>Fallons - Professional Nail Artistry</title>
	<meta name="description" content="Professional nail services with artistic flair. Book your appointment today for premium manicures, nail art, and spa treatments." />
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden min-h-screen">
	<!-- Background Video -->
	<div class="absolute inset-0 w-full h-full">
		<video 
			class="w-full h-full object-cover hero-video" 
			autoplay 
			muted 
			loop 
			playsinline
		>
			<source src="/doing-nails.mp4" type="video/mp4">
			<!-- Fallback for browsers that don't support video -->
			<div class="w-full h-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20"></div>
		</video>
		
		<!-- Video Overlay - makes it subtle -->
		<div class="absolute inset-0 bg-surface-50-900-token/85"></div>
		
		<!-- Additional subtle overlay for better text contrast -->
		<div class="absolute inset-0 bg-gradient-to-r from-surface-50-900-token/60 via-transparent to-surface-50-900-token/60"></div>
	</div>
	
	<!-- Content -->
	<div class="relative z-10 container mx-auto px-4 py-12 sm:py-16 lg:py-32">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-center">
			<!-- Text Content -->
			<div class="space-y-6 sm:space-y-8 text-center lg:text-left lg:pr-4 order-2 lg:order-1">
				<div class="space-y-4">
					<h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
						<span class="bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone">
							Beautiful Nails,<br>Perfectly Crafted
						</span>
					</h1>
					<p class="text-lg sm:text-xl text-surface-600-300-token max-w-2xl mx-auto lg:mx-0 lg:max-w-none">
						Experience professional nail artistry where creativity meets precision. Every detail matters.
					</p>
				</div>
				
				<div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
					<button 
						class="btn variant-filled-primary"
						on:click={openAppointmentModal}
					>
						<span>📅</span>
						<span>Book Appointment</span>
					</button>
					<a href="/gallery" class="btn variant-outline-primary">
						<span>🎨</span>
						<span>View Gallery</span>
					</a>
				</div>
			</div>
			
			<!-- Logo Showcase -->
			<!-- <div class="flex justify-center lg:justify-start lg:pl-4 order-1 lg:order-2">
				<div class="scale-90 sm:scale-100">
					<Logo size="large" showBackground={true} />
				</div>
			</div> -->
		</div>
	</div>
</section>

<!-- Services Section -->
<section class="container mx-auto px-4 py-20">
	<div class="text-center space-y-10">
		<div class="space-y-4">
			<h2 class="h2 font-bold">Our Services</h2>
			<p class="text-xl text-surface-600-300-token max-w-2xl mx-auto">
				From classic manicures to intricate nail art, we offer a full range of professional nail services.
			</p>
		</div>
		
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each services as service}
				<div class="card card-hover p-6 text-center space-y-4">
					<div class="text-4xl">{service.icon}</div>
					<div class="space-y-2">
						<h3 class="h3 font-bold">{service.title}</h3>
						<p class="text-surface-600-300-token">{service.description}</p>
						<div class="text-primary-500 font-semibold">{service.price}</div>
					</div>
					<button class="btn variant-outline-primary btn-sm w-full">
						Learn More
					</button>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Features Section -->
<section class="py-20">
	<div class="container mx-auto px-4">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
			<div>
				<h2 class="text-4xl lg:text-5xl font-bold mb-6">Why Choose Fallons?</h2>
				<div class="space-y-6">
					<div class="flex items-start space-x-4">
						<div class="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
							</svg>
						</div>
						<div>
							<h3 class="text-xl font-semibold mb-2">Expert Artistry</h3>
							<p class="text-surface-600-300-token">Our skilled technicians bring years of experience and artistic vision to every service.</p>
						</div>
					</div>
					
					<div class="flex items-start space-x-4">
						<div class="w-12 h-12 bg-secondary-500 rounded-lg flex items-center justify-center flex-shrink-0">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
							</svg>
						</div>
						<div>
							<h3 class="text-xl font-semibold mb-2">Premium Products</h3>
							<p class="text-surface-600-300-token">We use only the highest quality, professional-grade products for lasting results.</p>
						</div>
					</div>
					
					<div class="flex items-start space-x-4">
						<div class="w-12 h-12 bg-tertiary-500 rounded-lg flex items-center justify-center flex-shrink-0">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
							</svg>
						</div>
						<div>
							<h3 class="text-xl font-semibold mb-2">Personalized Care</h3>
							<p class="text-surface-600-300-token">Every client receives individual attention and customized service tailored to their needs.</p>
						</div>
					</div>
				</div>
			</div>
			
			<div class="relative">
				<div class="aspect-square bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-2xl flex items-center justify-center">
					<div class="text-8xl">💅</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Testimonials Section -->
<section class="py-20 bg-surface-100-800-token">
	<div class="container mx-auto px-4">
		<div class="text-center mb-16">
			<h2 class="text-4xl lg:text-5xl font-bold mb-4">What Our Clients Say</h2>
			<p class="text-xl text-surface-600-300-token">
				Don't just take our word for it - hear from our satisfied clients.
			</p>
		</div>
		
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
			{#each testimonials as testimonial}
				<div class="card bg-surface-50-900-token p-6">
					<div class="flex items-center mb-4">
						<div class="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
							{testimonial.name.charAt(0)}
						</div>
						<div>
							<h4 class="font-semibold">{testimonial.name}</h4>
							<div class="flex">
								{#each Array(testimonial.rating) as _}
									<svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
									</svg>
								{/each}
							</div>
						</div>
					</div>
					<p class="text-surface-600-300-token italic">"{testimonial.text}"</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="container mx-auto px-4 py-20">
	<div class="card p-8 text-center space-y-6 bg-gradient-to-br variant-gradient-primary-secondary">
		<div class="space-y-4">
			<h2 class="h2 font-bold text-on-primary-token">
				Ready for Beautiful Nails?
			</h2>
			<p class="text-xl text-on-primary-token/90 max-w-2xl mx-auto">
				Book your appointment today and experience the difference professional nail artistry makes.
			</p>
		</div>
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<button 
				class="btn variant-filled-surface"
				on:click={openAppointmentModal}
			>
				<span>📅</span>
				<span>Book Now</span>
			</button>
			<a href="/contact" class="btn variant-outline border-on-primary-token text-on-primary-token hover:variant-filled-surface">
				<span>📞</span>
				<span>Contact Us</span>
			</a>
		</div>
	</div>
</section>