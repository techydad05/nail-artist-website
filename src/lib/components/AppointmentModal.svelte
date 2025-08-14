<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import DatePicker from './DatePicker.svelte';
	import TimeSlotPicker from './TimeSlotPicker.svelte';
	import BookingForm from './BookingForm.svelte';
	
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
	let isLoading = false;
	
	// Services and appointments data
	let services = [];
	let bookedAppointments = [];
	let availabilityData = new Map(); // Store all availability data
	
	// Load services and appointments from API
	async function loadServicesAndAppointments() {
		isLoading = true;
		try {
			// Load services
			const servicesResponse = await fetch('/api/services');
			const servicesData = await servicesResponse.json();
			if (servicesData.success) {
				services = servicesData.services;
			}
			
			// Load appointments
			const appointmentsResponse = await fetch('/api/appointments');
			const appointmentsData = await appointmentsResponse.json();
			if (appointmentsData.success) {
				bookedAppointments = appointmentsData.appointments.map(apt => ({
					id: apt.id,
					date: apt.appointmentDate,
					time: apt.appointmentTime,
					customer: apt.customerName,
					service: apt.service
				}));
			}
			
			// Pre-load availability for the next 60 days
			await loadAvailabilityData();
		} catch (error) {
			console.error('Error loading data:', error);
		} finally {
			isLoading = false;
		}
	}
	
	// Load availability data for multiple dates at once
	async function loadAvailabilityData() {
		const today = new Date();
		const endDate = new Date();
		endDate.setDate(today.getDate() + 60); // Next 60 days
		
		// Generate date range
		const dates = [];
		for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
			// Skip weekends (assuming business is closed)
			if (d.getDay() !== 0 && d.getDay() !== 6) {
				dates.push(d.toISOString().split('T')[0]);
			}
		}
		
		// Load availability for all dates in batches to avoid overwhelming the server
		const batchSize = 10;
		for (let i = 0; i < dates.length; i += batchSize) {
			const batch = dates.slice(i, i + batchSize);
			await Promise.all(batch.map(async (date) => {
				try {
					const response = await fetch(`/api/appointments/availability?date=${date}`);
					const data = await response.json();
					if (data.success) {
						availabilityData.set(date, data.availableSlots || getLocalAvailableSlots(date));
					} else {
						// Fallback to local calculation
						availabilityData.set(date, getLocalAvailableSlots(date));
					}
				} catch (error) {
					// Fallback to local calculation
					availabilityData.set(date, getLocalAvailableSlots(date));
				}
			}));
			
			// Small delay between batches to be nice to the server
			if (i + batchSize < dates.length) {
				await new Promise(resolve => setTimeout(resolve, 100));
			}
		}
	}
	
	// Local availability calculation as fallback
	function getLocalAvailableSlots(date) {
		const allTimeSlots = [
			'9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
			'12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
			'3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'
		];
		
		const bookedTimes = bookedAppointments
			.filter(apt => apt.date === date)
			.map(apt => apt.time);
		
		return allTimeSlots.filter(time => !bookedTimes.includes(time));
	}
	
	// Event handlers
	function handleDateSelected(event) {
		selectedDate = event.detail.date;
		selectedTime = ''; // Reset time selection when date changes
	}
	
	function handleTimeSelected(event) {
		selectedTime = event.detail.time;
	}
	
	function handleFormUpdate(event) {
		const { field, value } = event.detail;
		switch (field) {
			case 'customerName':
				customerName = value;
				break;
			case 'customerEmail':
				customerEmail = value;
				break;
			case 'customerPhone':
				customerPhone = value;
				break;
			case 'selectedService':
				selectedService = value;
				break;
			case 'specialRequests':
				specialRequests = value;
				break;
		}
	}
	
	function closeModal() {
		isOpen = false;
		dispatch('close');
		resetForm();
	}
	
	function resetForm() {
		customerName = '';
		customerEmail = '';
		customerPhone = '';
		selectedService = '';
		selectedDate = '';
		selectedTime = '';
		specialRequests = '';
		isSubmitting = false;
	}
	
	async function handleFormSubmit(event) {
		const formData = event.detail;
		
		if (!selectedDate || !selectedTime) {
			alert('Please select both a date and time for your appointment');
			return;
		}
		
		isSubmitting = true;
		
		try {
			// Final availability check before submission
			const availabilityCheck = await fetch(`/api/appointments/availability?date=${selectedDate}`);
			const availabilityData = await availabilityCheck.json();
			
			if (availabilityData.success) {
				const currentlyAvailable = availabilityData.availableSlots || [];
				if (!currentlyAvailable.includes(selectedTime)) {
					alert('❌ Sorry, this time slot is no longer available. Please select a different time.');
					// Refresh the availability data
					await loadServicesAndAppointments();
					isSubmitting = false;
					return;
				}
			}
			
			// Submit appointment to API
			const response = await fetch('/api/appointments', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					customerName: formData.customerName,
					customerEmail: formData.customerEmail,
					customerPhone: formData.customerPhone,
					service: formData.selectedService,
					appointmentDate: selectedDate,
					appointmentTime: selectedTime,
					notes: formData.specialRequests
				})
			});
			
			const result = await response.json();
			
			if (result.success) {
				// Reload appointments to get updated data
				await loadServicesAndAppointments();
				
				// Show success message
				const selectedServiceName = services.find(s => s.id === formData.selectedService)?.name;
				alert(`🎉 Appointment booked successfully!\n\n📅 Date: ${selectedDate}\n⏰ Time: ${selectedTime}\n💅 Service: ${selectedServiceName}\n\nWe'll send you a confirmation email at ${formData.customerEmail} shortly!`);
				
				closeModal();
			} else {
				const errorMessage = result.error?.message || result.error || 'Unknown error occurred';
				if (errorMessage.includes('not available') || errorMessage.includes('conflict')) {
					alert(`❌ Time slot conflict: ${errorMessage}\n\nPlease select a different time.`);
					// Refresh the availability data
					await loadServicesAndAppointments();
				} else {
					alert(`❌ Error booking appointment: ${errorMessage}`);
				}
			}
		} catch (error) {
			console.error('Error submitting appointment:', error);
			alert('❌ Error booking appointment. Please try again.');
		} finally {
			isSubmitting = false;
		}
	}
	
	onMount(() => {
		loadServicesAndAppointments();
	});
	
	// Reinitialize data when modal opens
	$: if (isOpen) {
		setTimeout(async () => {
			await loadServicesAndAppointments();
			
			// Pre-fill special requests with design reference if provided
			if (designReference) {
				specialRequests = `Virtual Design: ${designReference}\n\n`;
			}
			
			// Load saved design data if available
			const savedDesignData = localStorage.getItem('appointment-design');
			if (savedDesignData) {
				try {
					const designData = JSON.parse(savedDesignData);
					if (designData.nails) {
						const designDetails = designData.nails
							.map((nail, index) => {
								const details = [];
								if (nail.baseColor !== '#FFB6C1') details.push(`Color: ${nail.baseColor}`);
								if (nail.design) details.push(`Pattern: ${nail.design.pattern}`);
								if (nail.stickers.length > 0) details.push(`${nail.stickers.length} stickers`);
								return details.length > 0 ? `${nail.name}: ${details.join(', ')}` : null;
							})
							.filter(Boolean)
							.join('\n');
						
						if (designDetails && !specialRequests.includes(designDetails)) {
							specialRequests += `\nDesign Details:\n${designDetails}`;
						}
					}
				} catch (error) {
					console.log('Could not load design data');
				}
			}
		}, 100);
	}
	
	// Close modal when clicking outside
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
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<div 
					class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
					on:click={handleBackdropClick}
					role="dialog"
					aria-modal="true"
					aria-labelledby="modal-title"
				>
		<div class="bg-base-100 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
			<!-- Modal Header -->
			<div class="bg-gradient-to-r from-primary to-secondary text-white p-4 sm:p-6 rounded-t-2xl">
				<div class="flex justify-between items-center">
					<h2 id="modal-title" class="text-xl sm:text-2xl font-bold flex items-center">
						<span class="mr-2 text-2xl sm:text-3xl">📅</span> Book an Appointment
					</h2>
					<button 
						class="btn btn-ghost btn-circle text-white hover:bg-white/20"
						on:click={closeModal}
						aria-label="Close modal"
					>
						✕
					</button>
				</div>
			</div>
			
			<!-- Modal Content -->
			<div class="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
				<!-- Left Column: Date and Time Selection -->
				<div class="space-y-6">
					<DatePicker 
						bind:selectedDate
						{bookedAppointments}
						{isLoading}
						on:dateSelected={handleDateSelected}
					/>
					
					<TimeSlotPicker 
						{selectedDate}
						bind:selectedTime
						{bookedAppointments}
						{isLoading}
						{availabilityData}
						on:timeSelected={handleTimeSelected}
					/>
				</div>
				
				<!-- Right Column: Booking Form -->
				<div class="space-y-6">
					<BookingForm 
						bind:customerName
						bind:customerEmail
						bind:customerPhone
						bind:selectedService
						bind:specialRequests
						{services}
						{isSubmitting}
						on:update={handleFormUpdate}
						on:submit={handleFormSubmit}
						on:cancel={closeModal}
					/>
					
					<!-- Booking Summary -->
					{#if selectedDate && selectedTime && selectedService}
						<div class="bg-base-200 p-4 rounded-lg border border-base-300">
							<h4 class="font-semibold text-base-content mb-2">Booking Summary</h4>
							<div class="space-y-1 text-sm text-base-content/80">
								<p><strong>Date:</strong> {new Date(selectedDate + 'T00:00:00').toLocaleDateString()}</p>
								<p><strong>Time:</strong> {selectedTime}</p>
								<p><strong>Service:</strong> {services.find(s => s.id === selectedService)?.name}</p>
								<p><strong>Duration:</strong> {services.find(s => s.id === selectedService)?.duration}min</p>
								<p><strong>Price:</strong> {services.find(s => s.id === selectedService)?.price}</p>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	:global(.calendar-container .ec) {
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		overflow: hidden;
	}
	
	:global(.calendar-container .ec-header) {
		background: linear-gradient(to right, #8b5cf6, #a855f7);
		color: white;
	}
	
	:global(.calendar-container .ec-button) {
		color: white;
		border-color: rgba(255, 255, 255, 0.3);
	}
	
	:global(.calendar-container .ec-button:hover) {
		background-color: rgba(255, 255, 255, 0.1);
	}
	
	:global(.calendar-container .available) {
		background-color: #f0fdf4 !important;
	}
	
	:global(.calendar-container .partially-booked) {
		background-color: #fefce8 !important;
	}
	
	:global(.calendar-container .fully-booked) {
		background-color: #fef2f2 !important;
		color: #991b1b;
	}
	
	:global(.calendar-container .ec-day-today) {
		background-color: #ddd6fe !important;
		font-weight: bold;
	}
</style>
