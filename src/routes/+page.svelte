<script>
	import { onMount } from 'svelte';
	import EnhancedSlider from '../lib/components/EnhancedSlider.svelte';
	import ScrollAnimator from '../lib/components/ScrollAnimator.svelte';
	import EnhancedNailDesigner from '../lib/components/EnhancedNailDesigner.svelte';
	import DesignShowcase from '../lib/components/DesignShowcase.svelte';
	import AppointmentModal from '../lib/components/AppointmentModal.svelte';
	
	// Modal state
	let showAppointmentModal = false;
	let designReference = '';
	
	// Listen for nail designer events
	onMount(() => {
		const handleOpenModal = (event) => {
			designReference = event.detail?.designReference || '';
			showAppointmentModal = true;
		};
		
		window.addEventListener('open-appointment-modal', handleOpenModal);
		
		return () => {
			window.removeEventListener('open-appointment-modal', handleOpenModal);
		};
	});
	
	let services = [
		{ 
			title: "Gel Nails", 
			description: "Long-lasting, vibrant gel manicures with premium quality polish.",
			icon: "💅",
			color: "from-pink-500 to-rose-500"
		},
		{ 
			title: "Acrylic Extensions", 
			description: "Beautiful acrylic nails customized to your desired length and style.",
			icon: "✨",
			color: "from-purple-500 to-indigo-500"
		},
		{ 
			title: "Nail Art", 
			description: "Custom designs, from simple patterns to intricate artwork.",
			icon: "🎨",
			color: "from-blue-500 to-cyan-500"
		},
		{ 
			title: "Spa Treatment", 
			description: "Relaxing hand and nail treatments for ultimate pampering.",
			icon: "🌸",
			color: "from-green-500 to-emerald-500"
		},
		{ 
			title: "Nail Repair", 
			description: "Expert repair services for damaged or broken nails.",
			icon: "🔧",
			color: "from-amber-500 to-orange-500"
		},
		{ 
			title: "Luxury Package", 
			description: "Complete pampering experience with all our premium services.",
			icon: "💎",
			color: "from-yellow-500 to-amber-500"
		}
	];
	
	let testimonials = [
		{ 
			name: "Sarah M.", 
			text: "Amazing nail art! My nails looked like tiny masterpieces.",
			stars: 5,
			avatar: "S"
		},
		{ 
			name: "Jessica L.", 
			text: "Best nail salon in town! Professional and fun atmosphere.",
			stars: 5,
			avatar: "J"
		},
		{ 
			name: "Emma K.", 
			text: "My nails lasted for weeks and looked perfect the whole time.",
			stars: 5,
			avatar: "E"
		},
		{ 
			name: "Mia T.", 
			text: "The virtual designer helped me choose the perfect style!",
			stars: 5,
			avatar: "M"
		}
	];

	// Enhanced slider images using placeholder images
	let sliderImages = [
		{
			url: 'https://picsum.photos/1200/600?random=1',
			alt: 'Beautiful nail art designs',
			title: 'Stunning Nail Art',
			description: 'Custom designs that make a statement'
		},
		{
			url: 'https://picsum.photos/1200/600?random=2',
			alt: 'Professional manicure service',
			title: 'Professional Care',
			description: 'Expert attention to detail'
		},
		{
			url: 'https://picsum.photos/1200/600?random=3',
			alt: 'Colorful gel nails',
			title: 'Vibrant Colors',
			description: 'Endless color possibilities'
		},
		{
			url: 'https://picsum.photos/1200/600?random=4',
			alt: 'Spa treatment',
			title: 'Relaxing Spa Experience',
			description: 'Pamper yourself with our luxury treatments'
		}
	];
</script>

<div class="container mx-auto px-4 py-4 md:py-8">
    <!-- Hero Section -->
    <ScrollAnimator animationType="fade" delay="200">
        <section class="text-center py-8 md:py-12 mb-8 md:mb-12 rounded-2xl md:rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 relative overflow-hidden">
            <div class="relative z-10 px-4">
                <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 glow-text flex items-center justify-center">
                    <span class="mr-3">💅</span> Polished Perfection <span class="ml-3">✨</span>
                </h1>
                <p class="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 max-w-2xl mx-auto text-gray-100 leading-relaxed">
                    Professional nail art with a fun, creative twist! Let's make your nails sparkle!
                </p>
                <div class="flex flex-col sm:flex-row justify-center gap-4">
                    <button 
                        class="btn btn-primary text-base md:text-lg px-6 md:px-8 py-2 flex items-center justify-center leading-none"
                        on:click={() => showAppointmentModal = true}
                    >
                        Book an Appointment
                    </button>
                    <button class="btn btn-secondary text-base md:text-lg px-6 md:px-8 py-2 flex items-center justify-center leading-none">
                        Try Virtual Designer
                    </button>
                </div>
            </div>
        </section>
    </ScrollAnimator>

    <!-- Enhanced Image Slider -->
    <ScrollAnimator animationType="slide-up" delay="400">
        <div class="mb-8 md:mb-12">
            <EnhancedSlider images={sliderImages} autoPlay={true} autoPlayInterval={7000} />
        </div>
    </ScrollAnimator>

    <!-- Services Section -->
    <ScrollAnimator animationType="slide-up" delay="200">
        <section class="py-12 mb-12">
            <h2 class="text-center mb-12 text-4xl font-bold text-white glow-text flex items-center justify-center">
                <span class="mr-3">💅</span> Our Services <span class="ml-3">✨</span>
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {#each services as service, i}
                    <ScrollAnimator animationType="slide-up" delay="{100 * (i + 1)}" once={true}>
                        <div class="bg-neutral text-white hover-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center bg-gradient-to-br {service.color} border border-white/10 flex flex-col h-full">
                            <div class="text-5xl mb-4">{service.icon}</div>
                            <h3 class="text-2xl font-bold mb-3 text-white">{service.title}</h3>
                            <p class="text-gray-200 grow">{service.description}</p>
                            <button class="mt-4 btn btn-sm btn-outline text-white border-white hover:bg-white hover:text-primary mt-auto flex items-center justify-center leading-none py-2">
                                Learn More
                            </button>
                        </div>
                    </ScrollAnimator>
                {/each}
            </div>
        </section>
    </ScrollAnimator>

    <!-- Testimonials Section -->
    <ScrollAnimator animationType="fade" delay="300">
        <section class="py-12 mb-12 bg-gradient-to-r from-accent to-secondary rounded-3xl px-6 relative overflow-hidden">
            <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjAuNSIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')] opacity-20"></div>
            <div class="relative z-10">
                <h2 class="text-center mb-12 text-4xl font-bold text-white glow-text flex items-center justify-center">
                    <span class="mr-3">💬</span> Happy Clients <span class="ml-3">🌟</span>
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {#each testimonials as testimonial, i}
                        <ScrollAnimator animationType="slide-up" delay="{150 * (i + 1)}" once={true}>
                            <div class="bg-neutral/80 backdrop-blur-sm text-white hover-card rounded-2xl p-6 shadow-lg border border-white/10 hover:border-primary/50 transition-all duration-300">
                                <div class="flex items-center mb-4">
                                    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-lg mr-3">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <h4 class="font-bold">{testimonial.name}</h4>
                                        <div class="flex">
                                            {#each Array(testimonial.stars) as _}
                                                <span class="text-warning text-lg">★</span>
                                            {/each}
                                        </div>
                                    </div>
                                </div>
                                <p class="text-lg italic text-gray-200">"{testimonial.text}"</p>
                            </div>
                        </ScrollAnimator>
                    {/each}
                </div>
            </div>
        </section>
    </ScrollAnimator>

    <!-- Community Designs Showcase -->
    <ScrollAnimator animationType="slide-up" delay="200">
        <DesignShowcase />
    </ScrollAnimator>

    <!-- Virtual Nail Designer Section -->
    <ScrollAnimator animationType="slide-up" delay="200">
        <section id="nail-designer" class="py-12 mb-12">
            <div class="max-w-4xl mx-auto text-center mb-12">
                <h2 class="text-4xl font-bold text-white glow-text mb-6 flex items-center justify-center">
                    <span class="mr-3">💅</span> Virtual Nail Designer <span class="ml-3">✨</span>
                </h2>
                <p class="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                    Create, save, and share your perfect nail art designs with our interactive designer!
                </p>
            </div>
            
            <div class="max-w-6xl mx-auto">
                <EnhancedNailDesigner />
            </div>
        </section>
    </ScrollAnimator>

    <!-- Special Offers Section -->
    <ScrollAnimator animationType="fade" delay="400">
        <section class="py-12 mb-12 bg-gradient-to-r from-primary to-purple-700 rounded-3xl px-6 text-center">
            <div class="max-w-4xl mx-auto">
                <h2 class="text-4xl font-bold text-white glow-text mb-6 flex items-center justify-center">
                    <span class="mr-3">🎉</span> Special Offers <span class="ml-3">💎</span>
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 hover-card border border-white/20 hover:border-white/40 transition-all duration-300">
                        <div class="text-4xl mb-4">🎉</div>
                        <h3 class="text-2xl font-bold text-white mb-3">New Client Special</h3>
                        <p class="text-gray-200 mb-4">Get 20% off your first nail service! Perfect time to try our premium treatments.</p>
                        <button class="btn btn-accent">Claim Offer</button>
                    </div>
                    <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 hover-card border border-white/20 hover:border-white/40 transition-all duration-300">
                        <div class="text-4xl mb-4">💅</div>
                        <h3 class="text-2xl font-bold text-white mb-3">Mani-Pedi Combo</h3>
                        <p class="text-gray-200 mb-4">Book both services together and save $15! Includes complimentary hand massage.</p>
                        <button 
                            class="btn btn-accent"
                            on:click={() => showAppointmentModal = true}
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </ScrollAnimator>

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

<!-- Appointment Modal -->
<AppointmentModal 
    bind:isOpen={showAppointmentModal}
    {designReference}
    on:close={() => { showAppointmentModal = false; designReference = ''; }}
/>

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
