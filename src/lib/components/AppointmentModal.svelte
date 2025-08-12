<script>
	import { onMount, createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher();
	
	export let isOpen = false;
	
	// Form data
	let customerName = '';
	let customerEmail = '';
	let customerPhone = '';
	let selectedService = '';
	let selectedDate = '';
	let selectedTime = '';
	let specialRequests = '';
	let isSubmitting = false;
	
	// Calendar state
	let currentMonth = new Date().getMonth();
	let currentYear = new Date().getFullYear();
	let calendarDays = [];
	
	// Services and appointments data
	let services = [];
	let bookedAppointments = [];
	
	// Available time slots
	const timeSlots = [
		'9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
		'1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
	];
	
	// Load services and appointments from API
	async function loadServicesAndAppointments() {
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
					date: apt.appointment_date,
					time: apt.appointment_time,
					customer: apt.customer_name,
					service: apt.service_id
				}));
			}
		} catch (error) {
			console.error('Error loading data:', error);
		}
	}
	
	const monthNames = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];
	
	const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	
	function generateCalendar(month, year) {
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const startDate = new Date(firstDay);
		startDate.setDate(startDate.getDate() - firstDay.getDay());
		
		const days = [];
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		
		for (let i = 0; i < 42; i++) {
			const date = new Date(startDate);
			date.setDate(startDate.getDate() + i);
			
			const dateString = date.toISOString().split('T')[0];
			const isCurrentMonth = date.getMonth() === month;
			const isPast = date < today;
			const isToday = date.getTime() === today.getTime();
			
			// Check if date has any available slots
			const bookedSlotsForDate = bookedAppointments.filter(apt => apt.date === dateString);
			const hasAvailableSlots = bookedSlotsForDate.length < timeSlots.length;
			
			days.push({
				date: date.getDate(),
				fullDate: dateString,
				isCurrentMonth,
				isPast,
				isToday,
				hasAvailableSlots: hasAvailableSlots && !isPast,
				bookedSlots: bookedSlotsForDate.length
			});
		}
		
		return days;
	}
	
	function previousMonth() {
		if (currentMonth === 0) {
			currentMonth = 11;
			currentYear--;
		} else {
			currentMonth--;
		}
		calendarDays = generateCalendar(currentMonth, currentYear);
	}
	
	function nextMonth() {
		if (currentMonth === 11) {
			currentMonth = 0;
			currentYear++;
		} else {
			currentMonth++;
		}
		calendarDays = generateCalendar(currentMonth, currentYear);
	}
	
	function selectDate(day) {
		if (day.isPast || !day.hasAvailableSlots || !day.isCurrentMonth) return;
		selectedDate = day.fullDate;
		selectedTime = ''; // Reset time selection when date changes
	}
	
	function getAvailableTimesForDate(date) {
		if (!date) return [];
		
		const bookedTimes = bookedAppointments
			.filter(apt => apt.date === date)
			.map(apt => apt.time);
		
		return timeSlots.filter(time => !bookedTimes.includes(time));
	}
	
	function selectTime(time) {
		selectedTime = time;
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
	
	async function submitAppointment() {
		if (!customerName || !customerEmail || !selectedService || !selectedDate || !selectedTime) {
			alert('Please fill in all required fields');
			return;
		}
		
		isSubmitting = true;
		
		try {
			// Submit appointment to API
			const response = await fetch('/api/appointments', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					customerName,
					customerEmail,
					customerPhone,
					serviceId: selectedService,
					date: selectedDate,
					time: selectedTime,
					specialRequests
				})
			});
			
			const result = await response.json();
			
			if (result.success) {
				// Reload appointments to get updated data
				await loadServicesAndAppointments();
				
				// Update calendar with new data
				calendarDays = generateCalendar(currentMonth, currentYear);
				
				// Show success message
				const selectedServiceName = services.find(s => s.id === selectedService)?.name;
				alert(`🎉 Appointment booked successfully!\n\n📅 Date: ${selectedDate}\n⏰ Time: ${selectedTime}\n💅 Service: ${selectedServiceName}\n\nWe'll send you a confirmation email at ${customerEmail} shortly!`);
				
				closeModal();
			} else {
				alert(`❌ Error booking appointment: ${result.error}`);
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
		calendarDays = generateCalendar(currentMonth, currentYear);
	});
	
	// Reinitialize calendar when modal opens
	$: if (isOpen) {
		setTimeout(async () => {
			await loadServicesAndAppointments();
			calendarDays = generateCalendar(currentMonth, currentYear);
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
				<!-- Left Column: Calendar -->
				<div class="space-y-6">
					<div>
						<h3 class="text-xl font-semibold mb-4 text-base-content">Select a Date</h3>
						<div class="calendar-container bg-base-200 border border-base-300 rounded-lg overflow-hidden">
							<!-- Calendar Header -->
							<div class="bg-gradient-to-r from-primary to-secondary text-white p-4 flex justify-between items-center">
								<button 
									class="btn btn-ghost btn-sm text-white hover:bg-white/20"
									on:click={previousMonth}
								>
									‹
								</button>
								<h4 class="text-lg font-semibold">
									{monthNames[currentMonth]} {currentYear}
								</h4>
								<button 
									class="btn btn-ghost btn-sm text-white hover:bg-white/20"
									on:click={nextMonth}
								>
									›
								</button>
							</div>
							
							<!-- Calendar Grid -->
							<div class="p-4">
								<!-- Day Headers -->
								<div class="grid grid-cols-7 gap-1 mb-2">
									{#each dayNames as dayName}
										<div class="text-center text-sm font-medium text-base-content/70 p-2">
											{dayName}
										</div>
									{/each}
								</div>
								
								<!-- Calendar Days -->
								<div class="grid grid-cols-7 gap-1">
									{#each calendarDays as day}
										<button
											class="aspect-square p-2 text-sm rounded-lg transition-all duration-200 relative text-base-content"
											class:opacity-40={!day.isCurrentMonth}
											class:bg-primary={day.isToday && day.isCurrentMonth}
											class:bg-success={day.hasAvailableSlots && day.isCurrentMonth && !day.isToday}
											class:bg-warning={day.bookedSlots > 0 && day.hasAvailableSlots && day.isCurrentMonth && !day.isToday}
											class:bg-error={!day.hasAvailableSlots && day.isCurrentMonth && !day.isPast}
											class:bg-base-300={day.isPast}
											class:ring-2={selectedDate === day.fullDate}
											class:ring-primary={selectedDate === day.fullDate}
											class:cursor-not-allowed={day.isPast || !day.hasAvailableSlots || !day.isCurrentMonth}
											class:hover:bg-primary-focus={day.hasAvailableSlots && day.isCurrentMonth && !day.isPast}
											disabled={day.isPast || !day.hasAvailableSlots || !day.isCurrentMonth}
											on:click={() => selectDate(day)}
										>
											{day.date}
											{#if day.bookedSlots > 0 && day.isCurrentMonth}
												<div class="absolute bottom-0 right-0 w-2 h-2 bg-error rounded-full"></div>
											{/if}
										</button>
									{/each}
								</div>
							</div>
						</div>
						
						<!-- Legend -->
						<div class="mt-4 flex flex-wrap gap-4 text-sm text-base-content">
							<div class="flex items-center">
								<div class="w-4 h-4 bg-success rounded mr-2"></div>
								<span>Available</span>
							</div>
							<div class="flex items-center">
								<div class="w-4 h-4 bg-warning rounded mr-2"></div>
								<span>Partially Booked</span>
							</div>
							<div class="flex items-center">
								<div class="w-4 h-4 bg-error rounded mr-2"></div>
								<span>Fully Booked</span>
							</div>
						</div>
					</div>
					
					<!-- Time Selection -->
					{#if selectedDate}
						<div>
							<h3 class="text-xl font-semibold mb-4 text-base-content">
								Available Times for {new Date(selectedDate + 'T00:00:00').toLocaleDateString()}
							</h3>
							<div class="grid grid-cols-3 gap-2">
								{#each getAvailableTimesForDate(selectedDate) as time}
									<button
										class="btn btn-outline btn-sm"
										class:btn-primary={selectedTime === time}
										on:click={() => selectTime(time)}
									>
										{time}
									</button>
								{:else}
									<p class="col-span-3 text-base-content/60 text-center py-4">
										No available times for this date
									</p>
								{/each}
							</div>
						</div>
					{/if}
				</div>
				
				<!-- Right Column: Booking Form -->
				<div class="space-y-6">
					<h3 class="text-xl font-semibold text-base-content">Your Information</h3>
					
					<form on:submit|preventDefault={submitAppointment} class="space-y-4">
						<!-- Customer Name -->
						<div>
							<label for="customer-name" class="block text-sm font-medium text-base-content mb-1">
								Full Name *
							</label>
							<input
								id="customer-name"
								type="text"
								bind:value={customerName}
								class="input input-bordered w-full bg-base-200 text-base-content"
								placeholder="Enter your full name"
								required
							>
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
								class="input input-bordered w-full bg-base-200 text-base-content"
								placeholder="your.email@example.com"
								required
							>
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
								class="input input-bordered w-full bg-base-200 text-base-content"
								placeholder="(555) 123-4567"
							>
						</div>
						
						<!-- Service Selection -->
						<div>
							<label for="service-select" class="block text-sm font-medium text-base-content mb-1">
								Select Service *
							</label>
							<select
								id="service-select"
								bind:value={selectedService}
								class="select select-bordered w-full bg-base-200 text-base-content"
								required
							>
								<option value="">Choose a service...</option>
								{#each services as service}
									<option value={service.id}>
										{service.name} - {service.duration} ({service.price})
									</option>
								{/each}
							</select>
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
							></textarea>
						</div>
						
						<!-- Booking Summary -->
						{#if selectedDate && selectedTime && selectedService}
							<div class="bg-gray-50 p-4 rounded-lg">
								<h4 class="font-semibold text-gray-800 mb-2">Booking Summary</h4>
								<div class="space-y-1 text-sm text-gray-600">
									<p><strong>Date:</strong> {new Date(selectedDate + 'T00:00:00').toLocaleDateString()}</p>
									<p><strong>Time:</strong> {selectedTime}</p>
									<p><strong>Service:</strong> {services.find(s => s.id === selectedService)?.name}</p>
									<p><strong>Duration:</strong> {services.find(s => s.id === selectedService)?.duration}</p>
									<p><strong>Price:</strong> {services.find(s => s.id === selectedService)?.price}</p>
								</div>
							</div>
						{/if}
						
						<!-- Submit Button -->
						<div class="flex gap-3 pt-4">
							<button
								type="button"
								class="btn btn-ghost flex-1"
								on:click={closeModal}
								disabled={isSubmitting}
							>
								Cancel
							</button>
							<button
								type="submit"
								class="btn btn-primary flex-1"
								disabled={!selectedDate || !selectedTime || !selectedService || !customerName || !customerEmail || isSubmitting}
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
