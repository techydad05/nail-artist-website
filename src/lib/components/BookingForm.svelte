<script>
	import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher();
	
	// Form data props
	export let customerName = '';
	export let customerEmail = '';
	export let customerPhone = '';
	export let selectedService = '';
	export let specialRequests = '';
	export let services = [];
	export let isSubmitting = false;
	
	// Validation state
	let errors = {};
	let touched = {};
	
	// Validation functions
	function validateEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}
	
	function validatePhone(phone) {
		if (!phone) return true; // Phone is optional
		const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
		const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
		return phoneRegex.test(cleanPhone);
	}
	
	function validateName(name) {
		return name && name.trim().length >= 2;
	}
	
	// Real-time validation
	function validateField(field, value) {
		switch (field) {
			case 'customerName':
				return validateName(value) ? '' : 'Name must be at least 2 characters';
			case 'customerEmail':
				return validateEmail(value) ? '' : 'Please enter a valid email address';
			case 'customerPhone':
				return validatePhone(value) ? '' : 'Please enter a valid phone number';
			case 'selectedService':
				return value ? '' : 'Please select a service';
			default:
				return '';
		}
	}
	
	// Handle input changes with validation
	function handleInput(field, value) {
		touched[field] = true;
		errors[field] = validateField(field, value);
		
		// Dispatch the updated value
		dispatch('update', { field, value });
	}
	
	// Validate all fields
	function validateAll() {
		const fields = ['customerName', 'customerEmail', 'customerPhone', 'selectedService'];
		let isValid = true;
		
		fields.forEach(field => {
			const value = field === 'customerName' ? customerName :
						  field === 'customerEmail' ? customerEmail :
						  field === 'customerPhone' ? customerPhone :
						  field === 'selectedService' ? selectedService : '';
			
			errors[field] = validateField(field, value);
			if (errors[field]) isValid = false;
		});
		
		return isValid;
	}
	
	// Handle form submission
	function handleSubmit() {
		// Mark all fields as touched
		touched = {
			customerName: true,
			customerEmail: true,
			customerPhone: true,
			selectedService: true
		};
		
		if (validateAll()) {
			dispatch('submit', {
				customerName: customerName.trim(),
				customerEmail: customerEmail.toLowerCase().trim(),
				customerPhone: customerPhone.trim(),
				selectedService,
				specialRequests: specialRequests.trim()
			});
		}
	}
	
	// Check if form is valid
	$: isFormValid = customerName && customerEmail && selectedService && 
					 !errors.customerName && !errors.customerEmail && 
					 !errors.customerPhone && !errors.selectedService;
</script>

<div class="space-y-4">
	<h3 class="text-xl font-semibold text-base-content">Your Information</h3>
	
	<form on:submit|preventDefault={handleSubmit} class="space-y-4">
		<!-- Customer Name -->
		<div>
			<label for="customer-name" class="block text-sm font-medium text-base-content mb-1">
				Full Name *
			</label>
			<input
				id="customer-name"
				type="text"
				bind:value={customerName}
				on:input={(e) => handleInput('customerName', e.target.value)}
				on:blur={() => touched.customerName = true}
				class="input input-bordered w-full bg-base-200 text-base-content"
				class:input-error={touched.customerName && errors.customerName}
				placeholder="Enter your full name"
				required
				disabled={isSubmitting}
			>
			{#if touched.customerName && errors.customerName}
				<p class="text-error text-sm mt-1">{errors.customerName}</p>
			{/if}
		</div>
		
		<!-- Customer Email -->
		<div>
			<label for="customer-email" class="block text-sm font-medium text-base-content mb-1">
				Email Address *
			</label>
			<input
				id="customer-email"
				type="email"
				bind:value={customerEmail}
				on:input={(e) => handleInput('customerEmail', e.target.value)}
				on:blur={() => touched.customerEmail = true}
				class="input input-bordered w-full bg-base-200 text-base-content"
				class:input-error={touched.customerEmail && errors.customerEmail}
				placeholder="your.email@example.com"
				required
				disabled={isSubmitting}
			>
			{#if touched.customerEmail && errors.customerEmail}
				<p class="text-error text-sm mt-1">{errors.customerEmail}</p>
			{/if}
		</div>
		
		<!-- Customer Phone -->
		<div>
			<label for="customer-phone" class="block text-sm font-medium text-base-content mb-1">
				Phone Number
			</label>
			<input
				id="customer-phone"
				type="tel"
				bind:value={customerPhone}
				on:input={(e) => handleInput('customerPhone', e.target.value)}
				on:blur={() => touched.customerPhone = true}
				class="input input-bordered w-full bg-base-200 text-base-content"
				class:input-error={touched.customerPhone && errors.customerPhone}
				placeholder="(555) 123-4567"
				disabled={isSubmitting}
			>
			{#if touched.customerPhone && errors.customerPhone}
				<p class="text-error text-sm mt-1">{errors.customerPhone}</p>
			{/if}
		</div>
		
		<!-- Service Selection -->
		<div>
			<label for="service-select" class="block text-sm font-medium text-base-content mb-1">
				Select Service *
			</label>
			<select
				id="service-select"
				bind:value={selectedService}
				on:change={(e) => handleInput('selectedService', e.target.value)}
				on:blur={() => touched.selectedService = true}
				class="select select-bordered w-full bg-base-200 text-base-content"
				class:select-error={touched.selectedService && errors.selectedService}
				required
				disabled={isSubmitting}
			>
				<option value="">Choose a service...</option>
				{#each services as service}
					<option value={service.id}>
						{service.name} - {service.duration}min ({service.price})
					</option>
				{/each}
			</select>
			{#if touched.selectedService && errors.selectedService}
				<p class="text-error text-sm mt-1">{errors.selectedService}</p>
			{/if}
		</div>
		
		<!-- Special Requests -->
		<div>
			<label for="special-requests" class="block text-sm font-medium text-base-content mb-1">
				Special Requests
			</label>
			<textarea
				id="special-requests"
				bind:value={specialRequests}
				rows="3"
				class="textarea textarea-bordered w-full bg-base-200 text-base-content resize-none"
				placeholder="Any special requests or preferences..."
				disabled={isSubmitting}
			></textarea>
		</div>
		
		<!-- Form Actions -->
		<div class="flex gap-3 pt-4">
			<button
				type="button"
				class="btn btn-ghost flex-1"
				on:click={() => dispatch('cancel')}
				disabled={isSubmitting}
			>
				Cancel
			</button>
			<button
				type="submit"
				class="btn btn-primary flex-1"
				disabled={!isFormValid || isSubmitting}
			>
				{#if isSubmitting}
					<span class="loading loading-spinner loading-sm"></span>
					Booking...
				{:else}
					Book Appointment
				{/if}
			</button>
		</div>
	</form>
</div>