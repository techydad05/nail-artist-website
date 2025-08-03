<script>
	import { onMount } from 'svelte';
	
	let services = [
		{ 
			title: "Gel Nails", 
			description: "Long-lasting, vibrant gel manicures with premium quality polish.",
			icon: "💅"
		},
		{ 
			title: "Acrylic Extensions", 
			description: "Beautiful acrylic nails customized to your desired length and style.",
			icon: "✨"
		},
		{ 
			title: "Nail Art", 
			description: "Custom designs, from simple patterns to intricate artwork.",
			icon: "🎨"
		},
		{ 
			title: "Spa Treatment", 
			description: "Relaxing hand and nail treatments for ultimate pampering.",
			icon: "🌸"
		}
	];
	
	let testimonials = [
		{ 
			name: "Sarah M.", 
			text: "Amazing nail art! My nails looked like tiny masterpieces.",
			stars: 5
		},
		{ 
			name: "Jessica L.", 
			text: "Best nail salon in town! Professional and fun atmosphere.",
			stars: 5
		},
		{ 
			name: "Emma K.", 
			text: "My nails lasted for weeks and looked perfect the whole time.",
			stars: 5
		}
	];

	// Slider functionality
	let currentSlide = 0;
	let sliderImages = [
		{
			url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&h=400&fit=crop',
			alt: 'Beautiful nail art designs',
			title: 'Stunning Nail Art'
		},
		{
			url: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800&h=400&fit=crop',
			alt: 'Professional manicure service',
			title: 'Professional Care'
		},
		{
			url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=400&fit=crop',
			alt: 'Colorful gel nails',
			title: 'Vibrant Colors'
		}
	];

	function nextSlide() {
		currentSlide = (currentSlide + 1) % sliderImages.length;
	}

	function prevSlide() {
		currentSlide = (currentSlide - 1 + sliderImages.length) % sliderImages.length;
	}

	function goToSlide(index) {
		currentSlide = index;
	}

	// Auto-advance slider
	onMount(() => {
		const interval = setInterval(nextSlide, 5000);
		return () => clearInterval(interval);
	});
</script>

<div class="container mx-auto px-4 py-4 md:py-8">
    <!-- Hero Section with Slider -->
    <section class="text-center py-8 md:py-12 mb-8 md:mb-12 rounded-2xl md:rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 relative overflow-hidden">
        <div class="relative z-10 px-4">
            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 glow-text">
                Polished Perfection
            </h1>
            <p class="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 max-w-2xl mx-auto text-gray-100 leading-relaxed">
                Professional nail art with a fun, creative twist! Let's make your nails sparkle!
            </p>
            <button class="btn btn-primary text-base md:text-lg px-6 md:px-8 py-3">
                Book an Appointment
            </button>
        </div>
    </section>

    <!-- Image Slider -->
    <div class="relative overflow-hidden rounded-lg md:rounded-xl mt-6 md:mt-8 mb-8 md:mb-12 shadow-2xl">
        <div class="relative h-64 sm:h-72 md:h-80 lg:h-96">
            {#each sliderImages as image, index}
                <div 
                    class="absolute inset-0 transition-opacity duration-500 ease-in-out {index === currentSlide ? 'opacity-100' : 'opacity-0'}"
                    style="background-image: url('{image.url}'); background-size: cover; background-position: center;"
                >
                    <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4">
                        <h3 class="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold glow-text text-center">{image.title}</h3>
                    </div>
                </div>
            {/each}
            
            <!-- Navigation buttons -->
            <button 
                class="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-secondary hover:bg-secondary/90 text-white rounded-full flex items-center justify-center z-20 opacity-75 hover:opacity-100 transition-all text-sm md:text-base" 
                on:click={prevSlide}
            >
                ❮
            </button>
            <button 
                class="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-secondary hover:bg-secondary/90 text-white rounded-full flex items-center justify-center z-20 opacity-75 hover:opacity-100 transition-all text-sm md:text-base" 
                on:click={nextSlide}
            >
                ❯
            </button>
            
            <!-- Dots indicator -->
            <div class="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {#each sliderImages as _, index}
                    <button 
                        class="w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 {index === currentSlide ? 'bg-primary scale-125' : 'bg-white bg-opacity-50 hover:bg-opacity-75'}"
                        on:click={() => goToSlide(index)}
                    >
                    </button>
                {/each}
            </div>
        </div>
    </div>

    <!-- Services Section -->
    <section class="py-12 mb-12">
        <h2 class="text-center mb-12 text-4xl font-bold text-white glow-text">Our Services</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {#each services as service}
                <div class="bg-neutral text-white hover-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center">
                    <div class="text-5xl mb-4">{service.icon}</div>
                    <h3 class="text-2xl font-bold mb-3 text-primary">{service.title}</h3>
                    <p class="text-gray-300">{service.description}</p>
                </div>
            {/each}
        </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-12 mb-12 bg-gradient-to-r from-accent to-secondary rounded-3xl px-6">
        <h2 class="text-center mb-12 text-4xl font-bold text-white glow-text">Happy Clients</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {#each testimonials as testimonial}
                <div class="bg-neutral text-white hover-card rounded-2xl p-6 shadow-lg">
                    <div class="flex mb-3">
                        {#each Array(testimonial.stars) as _}
                            <span class="text-warning text-xl">★</span>
                        {/each}
                    </div>
                    <p class="text-lg italic mb-4 text-gray-300">"{testimonial.text}"</p>
                    <p class="font-bold text-primary">— {testimonial.name}</p>
                </div>
            {/each}
        </div>
    </section>

    <!-- Special Offers Section -->
    <section class="py-12 mb-12 bg-gradient-to-r from-primary to-purple-700 rounded-3xl px-6 text-center">
        <div class="max-w-4xl mx-auto">
            <h2 class="text-4xl font-bold text-white glow-text mb-6">Special Offers</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 hover-card">
                    <div class="text-4xl mb-4">🎉</div>
                    <h3 class="text-2xl font-bold text-white mb-3">New Client Special</h3>
                    <p class="text-gray-200 mb-4">Get 20% off your first nail service! Perfect time to try our premium treatments.</p>
                    <button class="btn btn-accent">Claim Offer</button>
                </div>
                <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 hover-card">
                    <div class="text-4xl mb-4">💅</div>
                    <h3 class="text-2xl font-bold text-white mb-3">Mani-Pedi Combo</h3>
                    <p class="text-gray-200 mb-4">Book both services together and save $15! Includes complimentary hand massage.</p>
                    <button class="btn btn-accent">Book Now</button>
                </div>
            </div>
        </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="py-12 mb-12">
        <h2 class="text-center mb-12 text-4xl font-bold text-white glow-text">Why Choose Us?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div class="text-center">
                <div class="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-3xl animate-float">
                    ✨
                </div>
                <h3 class="text-xl font-bold text-white mb-3">Premium Quality</h3>
                <p class="text-gray-300">We use only the finest nail products and tools to ensure lasting beauty and health.</p>
            </div>
            <div class="text-center">
                <div class="w-20 h-20 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-4 text-3xl animate-sparkle">
                    💯
                </div>
                <h3 class="text-xl font-bold text-white mb-3">Expert Artists</h3>
                <p class="text-gray-300">Our skilled nail technicians are trained in the latest techniques and trends.</p>
            </div>
            <div class="text-center">
                <div class="w-20 h-20 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-4 text-3xl animate-float">
                    💜
                </div>
                <h3 class="text-xl font-bold text-white mb-3">Clean & Safe</h3>
                <p class="text-gray-300">We maintain the highest standards of cleanliness and sanitation for your safety.</p>
            </div>
        </div>
    </section>

    <!-- Fun Elements -->
    <div class="text-center py-8">
        <div class="inline-block animate-float mr-4 text-4xl">💅</div>
        <div class="inline-block animate-sparkle mr-4 text-4xl">✨</div>
        <div class="inline-block animate-float text-4xl">🎨</div>
    </div>
</div>

<style>
	@keyframes float {
		0% { transform: translateY(0px); }
		50% { transform: translateY(-10px); }
		100% { transform: translateY(0px); }
	}
	
	:global(.animate-float) {
		animation: float 3s ease-in-out infinite;
	}
</style>
