<script>
	let services = [
		{ 
			id: 1,
			title: "Gel Nails", 
			description: "Long-lasting, vibrant gel manicures with premium quality polish.",
			price: "$35+",
			duration: "45-60 min",
			inclusions: ["Nail shaping", "Cuticle care", "Base coat", "Gel polish application", "Top coat with UV curing"]
		},
		{ 
			id: 2,
			title: "Acrylic Extensions", 
			description: "Beautiful acrylic nails customized to your desired length and style.",
			price: "$50+",
			duration: "60-90 min",
			inclusions: ["Nail preparation", "Acrylic application", "Shaping & filing", "Cuticle care", "Polish application"]
		},
		{ 
			id: 3,
			title: "Nail Art", 
			description: "Custom designs, from simple patterns to intricate artwork.",
			price: "$5+ per nail",
			duration: "15-30 min (add-on)",
			inclusions: ["Simple designs (dots, lines)", "Patterns & shapes", "Glitter accents", "Stickers & transfers", "Hand-painted artwork"]
		},
		{ 
			id: 4,
			title: "Spa Treatment", 
			description: "Relaxing hand and nail treatments for ultimate pampering.",
			price: "$25+",
			duration: "30-45 min",
			inclusions: ["Exfoliating scrub", "Moisturizing mask", "Extended massage", "Cuticle care", "Polish application"]
		}
	];
	
	let faqs = [
		{ 
			question: "How long do gel nails last?", 
			answer: "With proper care, gel nails can last 2-3 weeks. We recommend booking a fill appointment every 2-3 weeks to maintain their appearance."
		},
		{ 
			question: "Can I remove gel nails at home?", 
			answer: "We strongly recommend having gel nails professionally removed to prevent damage to your natural nails. Our removal process is safe and gentle."
		},
		{ 
			question: "Do you offer nail art on toes as well?", 
			answer: "Absolutely! We offer the same nail art services for both fingers and toes. Pedicure appointments include nail art options."
		},
		{ 
			question: "What should I do to prepare for my appointment?", 
			answer: "Please arrive with clean hands and nails. If you're getting nail art, it helps to have an idea of what you'd like, but we can also help you decide on the spot!"
		}
	];
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-center text-4xl font-bold mb-4 text-primary">Our Services</h1>
	<p class="text-center text-xl mb-12 text-neutral">Professional nail care with a creative twist</p>
	
	<!-- Services Grid -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
		{#each services as service}
			<div class="bg-white rounded-2xl p-8 shadow-lg border-2 border-primary/20 hover:shadow-xl transition-all duration-300">
				<div class="flex justify-between items-start mb-4">
					<h2 class="text-2xl font-bold text-primary">{service.title}</h2>
					<div class="text-right">
						<div class="text-2xl font-bold text-secondary">{service.price}</div>
						<div class="text-neutral">{service.duration}</div>
					</div>
				</div>
				
				<p class="text-lg mb-6 text-neutral">{service.description}</p>
				
				<div class="mb-6">
					<h3 class="text-xl font-bold mb-3 text-accent">What's Included:</h3>
					<ul class="space-y-2">
						{#each service.inclusions as inclusion}
							<li class="flex items-start">
								<span class="text-secondary mr-2">✓</span>
								<span class="text-neutral">{inclusion}</span>
							</li>
							{/each}
						</ul>
				</div>
				
				<button class="btn btn-primary w-full flex items-center justify-center leading-none py-2">Book {service.title}</button>
			</div>
		{/each}
	</div>
	
	<!-- FAQ Section -->
	<section class="mb-16">
		<h2 class="text-3xl font-bold mb-8 text-center text-primary">Frequently Asked Questions</h2>
		
		<div class="max-w-3xl mx-auto space-y-6">
			{#each faqs as faq}
				<div class="bg-white rounded-2xl p-6 shadow-lg border-2 border-accent/20">
					<h3 class="text-xl font-bold mb-3 text-primary">{faq.question}</h3>
					<p class="text-neutral">{faq.answer}</p>
				</div>
			{/each}
		</div>
	</section>
	
	<!-- CTA Section -->
	<section class="text-center py-12 rounded-3xl bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20">
		<h2 class="text-3xl font-bold mb-4 text-primary">Ready to Pamper Yourself?</h2>
		<p class="text-xl mb-8 max-w-2xl mx-auto text-neutral">Book an appointment today and experience the perfect blend of professionalism and creativity!</p>
		<button class="btn btn-primary text-lg px-8 py-3 flex items-center justify-center leading-none">Book an Appointment</button>
	</section>
</div>
