<script>
	import { createEventDispatcher } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { showSuccess, showError } from '$lib/stores/toast';
	
	const dispatch = createEventDispatcher();
	
	export let isOpen = false;
	export let designReference = '';
	
	// Form data
	let customerName = '';
	let customerEmail = '';
	let customerPhone = '';
	let selectedService = '';
	let selectedDate = '';
	let selectedTime = '';
	let specialRequests = '';
	let isSubmitting = false;
	let currentStep = 1;
	
	// Services data
	let services = [
		{ id: 'gel', name: 'Gel Manicure', price: '$35', duration: '45 min' },
		{ id: 'art', name: 'Nail Art', price: '$15+', duration: '30 min' },
		{ id: 'acrylic', name: 'Acrylic Extensions', price: '$50', duration: '60 min' },
		{ id: 'spa', name: 'Spa Treatment', price: '$25', duration: '30 min' }
	];
	
	// Available time slots
	let availableSlots = [
		'9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
		'1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
		'4:00 PM', '4:30 PM', '5:00 PM'
	];
	
	function closeModal() {
		isOpen = false;
		resetForm();
		dispatch('close');
	}
	
	function resetForm() {
		customerName = '';
		customerEmail = '';
		customerPhone = '';
		selectedService = '';
		selectedDate = '';
		selectedTime = '';
		specialRequests = '';
		currentStep = 1;
		isSubmitting = false;
	}
	
	function nextStep() {
		if (currentStep < 3) {
			currentStep++;
		}
	}
	
	function prevStep() {
		if (currentStep > 1) {
			currentStep--;
		}
	}
	
	function getMinDate() {
		const today = new Date();
		return today.toISOString().split('T')[0];
	}
	
	function getMaxDate() {
		const maxDate = new Date();
		maxDate.setDate(maxDate.getDate() + 60);
		return maxDate.toISOString().split('T')[0];
	}
	
	async function handleSubmit() {
		if (!customerName || !customerEmail || !selectedService || !selectedDate || !selectedTime) {
			showError('Please fill in all required fields');
			return;
		}
		
		isSubmitting = true;
		
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 2000));
			
			showSuccess('Appointment booked successfully! We\'ll send you a confirmation email.');
			closeModal();
		} catch (error) {
			showError('Failed to book appointment. Please try again.');
		} finally {
			isSubmitting = false;
		}
	}
	
	function handleBackdropClick(event) {
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}
	
	// Handle escape key
	function handleKeydown(event) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<!-- Backdrop -->
	<div 
		class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-end"
		transition:fade={{ duration: 300 }}
		on:click={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby="appointment-modal-title"
	>
		<!-- Slide-in Panel -->
		<div 
			class="bg-surface-50-900-token w-full max-w-2xl h-full overflow-y-auto shadow-2xl"
			transition:fly={{ x: 500, duration: 400, opacity: 1 }}
		>
			<!-- Header -->
			<div class="sticky top-0 bg-surface-50-900-token border-b border-surface-300-600-token p-6 z-10">
				<div class="flex items-center justify-between">
					<div>
						<h2 id="appointment-modal-title" class="text-2xl font-bold text-surface-900-50-token">
							Book Appointment
						</h2>
						<p class="text-surface-600-300-token mt-1">Step {currentStep} of 3</p>
					</div>
					<button 
						class="btn btn-sm variant-ghost-surface"
						on:click={closeModal}
						aria-label="Close modal"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				</div>
				
				<!-- Progress Bar -->
				<div class="mt-4">
					<div class="flex space-x-2">
						{#each [1, 2, 3] as step}
							<div class="flex-1 h-2 rounded-full {step <= currentStep ? 'bg-primary-500' : 'bg-surface-300-600-token'}"></div>
						{/each}
					</div>
				</div>
			</div>
			
			<!-- Content -->
			<div class="p-6">
				{#if currentStep === 1}
					<!-- Step 1: Service Selection -->
					<div class="space-y-6">
						<div>
							<h3 class="text-xl font-semibold mb-4 text-surface-900-50-token">Choose Your Service</h3>
							<div class="grid gap-4">
								{#each services as service}
									<label class="cursor-pointer">
										<input 
											type="radio" 
											bind:group={selectedService} 
											value={service.id}
											class="sr-only"
										>
										<div class="card p-4 border-2 transition-all {selectedService === service.id ? 'border-primary-500 bg-primary-500/10' : 'border-surface-300-600-token hover:border-primary-300'}">
											<div class="flex justify-between items-center">
												<div>
													<h4 class="font-semibold text-surface-900-50-token">{service.name}</h4>
													<p class="text-sm text-surface-600-300-token">{service.duration}</p>
												</div>
												<div class="font-bold text-primary-500">{service.price}</div>
											</div>
										</div>
									</label>
								{/each}
							</div>
						</div>
						
						{#if designReference}
							<div class="card p-4 bg-tertiary-50">
								<h4 class="font-semibold text-tertiary-700 mb-2">Design Reference</h4>
								<p class="text-sm text-tertiary-600">{designReference}</p>
							</div>
						{/if}
					</div>
				{:else if currentStep === 2}
					<!-- Step 2: Date & Time Selection -->
					<div class="space-y-6">
						<div>
							<h3 class="text-xl font-semibold mb-4 text-surface-900-50-token">Select Date & Time</h3>
							
							<!-- Date Selection -->
							<div class="mb-6">
								<label class="label">
									<span class="font-medium">Preferred Date</span>
									<input 
										type="date" 
										class="input"
										bind:value={selectedDate}
										min={getMinDate()}
										max={getMaxDate()}
									>
								</label>
							</div>
							
							<!-- Time Selection -->
							{#if selectedDate}
								<div>
									<label class="label">
										<span class="font-medium">Available Times</span>
									</label>
									<div class="grid grid-cols-3 gap-2 mt-2">
										{#each availableSlots as slot}
											<button
												type="button"
												class="btn btn-sm {selectedTime === slot ? 'variant-filled-primary' : 'variant-outline-surface'}"
												on:click={() => selectedTime = slot}
											>
												{slot}
											</button>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					</div>
				{:else if currentStep === 3}
					<!-- Step 3: Contact Information -->
					<div class="space-y-6">
						<div>
							<h3 class="text-xl font-semibold mb-4 text-surface-900-50-token">Your Information</h3>
							
							<div class="space-y-4">
								<label class="label">
									<span class="font-medium">Full Name *</span>
									<input 
										type="text" 
										class="input"
										bind:value={customerName}
										placeholder="Enter your full name"
										required
									>
								</label>
								
								<label class="label">
									<span class="font-medium">Email Address *</span>
									<input 
										type="email" 
										class="input"
										bind:value={customerEmail}
										placeholder="your.email@example.com"
										required
									>
								</label>
								
								<label class="label">
									<span class="font-medium">Phone Number</span>
									<input 
										type="tel" 
										class="input"
										bind:value={customerPhone}
										placeholder="(555) 123-4567"
									>
								</label>
								
								<label class="label">
									<span class="font-medium">Special Requests</span>
									<textarea 
										class="textarea"
										bind:value={specialRequests}
										placeholder="Any special requests or design ideas..."
										rows="3"
									></textarea>
								</label>
							</div>
						</div>
						
						<!-- Booking Summary -->
						<div class="card p-4 bg-surface-100-800-token">
							<h4 class="font-semibold mb-3 text-surface-900-50-token">Booking Summary</h4>
							<div class="space-y-2 text-sm">
								<div class="flex justify-between">
									<span class="text-surface-600-300-token">Service:</span>
									<span class="font-medium">{services.find(s => s.id === selectedService)?.name || 'Not selected'}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-surface-600-300-token">Date:</span>
									<span class="font-medium">{selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString() : 'Not selected'}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-surface-600-300-token">Time:</span>
									<span class="font-medium">{selectedTime || 'Not selected'}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-surface-600-300-token">Price:</span>
									<span class="font-medium text-primary-500">{services.find(s => s.id === selectedService)?.price || 'TBD'}</span>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
			
			<!-- Footer -->
			<div class="sticky bottom-0 bg-surface-50-900-token border-t border-surface-300-600-token p-6">
				<div class="flex justify-between">
					<div>
						{#if currentStep > 1}
							<button 
								class="btn variant-outline-surface"
								on:click={prevStep}
								disabled={isSubmitting}
							>
								Previous
							</button>
						{/if}
					</div>
					
					<div class="flex space-x-3">
						<button 
							class="btn variant-ghost-surface"
							on:click={closeModal}
							disabled={isSubmitting}
						>
							Cancel
						</button>
						
						{#if currentStep < 3}
							<button 
								class="btn variant-filled-primary"
								on:click={nextStep}
								disabled={currentStep === 1 && !selectedService || currentStep === 2 && (!selectedDate || !selectedTime)}
							>
								Next
							</button>
						{:else}
							<button 
								class="btn variant-filled-primary"
								on:click={handleSubmit}
								disabled={isSubmitting || !customerName || !customerEmail || !selectedService || !selectedDate || !selectedTime}
							>
								{#if isSubmitting}
									<svg class="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Booking...
								{:else}
									Book Appointment
								{/if}
							</button>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Custom scrollbar for the modal */
	.overflow-y-auto::-webkit-scrollbar {
		width: 6px;
	}
	
	.overflow-y-auto::-webkit-scrollbar-track {
		background: rgb(var(--color-surface-200));
	}
	
	.overflow-y-auto::-webkit-scrollbar-thumb {
		background: rgb(var(--color-surface-400));
		border-radius: 3px;
	}
	
	.overflow-y-auto::-webkit-scrollbar-thumb:hover {
		background: rgb(var(--color-surface-500));
	}
</style>