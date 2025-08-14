<script>
	import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher();
	
	// Props
	export let selectedDate = '';
	export let selectedTime = '';
	export let bookedAppointments = [];
	export let isLoading = false;
	export let availabilityData = new Map(); // Pre-loaded availability data
	
	// All possible time slots
	const allTimeSlots = [
		'9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
		'12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
		'3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'
	];
	
	let availableSlots = [];
	let bookedSlots = [];
	let errorMessage = '';
	
	// Get available and booked times for the selected date
	function getTimeSlotsForDate(date) {
		if (!date) return { available: [], booked: [] };
		
		// Get booked times from appointments
		const bookedTimes = bookedAppointments
			.filter(apt => apt.date === date)
			.map(apt => apt.time);
		
		// First try to get from pre-loaded availability data
		let availableTimes;
		if (availabilityData.has(date)) {
			availableTimes = availabilityData.get(date);
		} else {
			// Fallback to local calculation
			availableTimes = allTimeSlots.filter(time => !bookedTimes.includes(time));
		}
		
		return {
			available: availableTimes,
			booked: bookedTimes
		};
	}
	
	// Update available and booked slots instantly when date changes
	function updateTimeSlots(date) {
		if (!date) {
			availableSlots = [];
			bookedSlots = [];
			return;
		}
		
		const { available, booked } = getTimeSlotsForDate(date);
		availableSlots = available;
		bookedSlots = booked;
		errorMessage = '';
		
		// Reset selected time if it's no longer available
		if (selectedTime && !available.includes(selectedTime)) {
			selectedTime = '';
		}
	}
	
	// Handle time selection
	function selectTime(time) {
		if (availableSlots.includes(time) && !isTimeSlotPast(time)) {
			selectedTime = time;
			dispatch('timeSelected', {
				time,
				date: selectedDate
			});
		}
	}
	
	// Handle keyboard navigation for time slots
	function handleTimeKeydown(event, time) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			selectTime(time);
		}
	}
	
	// Convert 12-hour format to 24-hour for sorting
	function convertTo24Hour(time12h) {
		const [time, modifier] = time12h.split(' ');
		let [hours, minutes] = time.split(':');
		if (hours === '12') {
			hours = '00';
		}
		if (modifier === 'PM') {
			hours = parseInt(hours, 10) + 12;
		}
		return `${hours}:${minutes}`;
	}
	
	// Sort time slots chronologically
	function sortTimeSlots(slots) {
		return slots.sort((a, b) => {
			const timeA = convertTo24Hour(a);
			const timeB = convertTo24Hour(b);
			return timeA.localeCompare(timeB);
		});
	}
	
	// Format date for display
	function formatDate(dateString) {
		if (!dateString) return '';
		const date = new Date(dateString + 'T00:00:00');
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
	
	// Check if a time slot is in the past for today
	function isTimeSlotPast(timeSlot) {
		if (!selectedDate) return false;
		
		const today = new Date();
		const selectedDateObj = new Date(selectedDate + 'T00:00:00');
		
		// Only check for past times if the selected date is today
		if (selectedDateObj.toDateString() !== today.toDateString()) {
			return false;
		}
		
		const [time, modifier] = timeSlot.split(' ');
		let [hours, minutes] = time.split(':');
		
		if (hours === '12') {
			hours = modifier === 'AM' ? '0' : '12';
		} else if (modifier === 'PM') {
			hours = parseInt(hours, 10) + 12;
		}
		
		const slotTime = new Date();
		slotTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
		
		return slotTime <= today;
	}
	
	// Reactive updates - instant, no network calls
	$: updateTimeSlots(selectedDate);
	
	$: sortedAvailableSlots = sortTimeSlots(availableSlots);
	$: sortedBookedSlots = sortTimeSlots(bookedSlots);
</script>

{#if selectedDate}
	<div class="space-y-4">
		<h3 class="text-xl font-semibold text-base-content">
			Available Times for {formatDate(selectedDate)}
		</h3>
		
		{#if errorMessage}
			<div class="alert alert-warning">
				<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
				</svg>
				<span>{errorMessage}</span>
			</div>
		{/if}
		
		{#if sortedAvailableSlots.length > 0 || sortedBookedSlots.length > 0}
			<div class="space-y-4">
				<!-- Available Time Slots -->
				{#if sortedAvailableSlots.length > 0}
					<div>
						<h4 class="text-sm font-medium text-success mb-2">✅ Available Times</h4>
						<div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
							{#each sortedAvailableSlots as time}
								{@const isPast = isTimeSlotPast(time)}
								<button
									class="btn btn-outline btn-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center"
									class:btn-primary={selectedTime === time}
									class:btn-disabled={isPast}
									class:opacity-50={isPast}
									class:cursor-not-allowed={isPast}
									class:hover:scale-105={!isPast}
									disabled={isPast}
									on:click={() => selectTime(time)}
									on:keydown={(e) => handleTimeKeydown(e, time)}
									aria-label={`Select ${time} appointment slot`}
									aria-pressed={selectedTime === time}
									tabindex={isPast ? -1 : 0}
								>
									{time}
									{#if isPast}
										<span class="text-xs opacity-60">(Past)</span>
									{/if}
								</button>
							{/each}
						</div>
					</div>
				{/if}
				
				<!-- Booked Time Slots -->
				{#if sortedBookedSlots.length > 0}
					<div>
						<h4 class="text-sm font-medium text-error mb-2">❌ Booked Times</h4>
						<div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
							{#each sortedBookedSlots as time}
								<div
									class="btn btn-sm btn-disabled bg-error/20 text-error border-error/30 cursor-not-allowed flex items-center justify-center"
									aria-label={`${time} is already booked`}
								>
									{time}
									<span class="text-xs ml-1">(Booked)</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
			
			{#if selectedTime}
				<div class="bg-success/10 border border-success/20 rounded-lg p-3">
					<div class="flex items-center text-success">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
						<span class="font-medium">Selected: {selectedTime} on {formatDate(selectedDate)}</span>
					</div>
				</div>
			{/if}
		{:else}
			<div class="text-center py-8">
				<div class="text-base-content/60 mb-4">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<p class="text-lg font-medium">No time slots</p>
					<p class="text-sm">No appointments scheduled for this date.</p>
				</div>
				<p class="text-sm text-base-content/50">
					This might be a weekend or holiday.
				</p>
			</div>
		{/if}
		
		<!-- Business Hours Info -->
		<div class="bg-base-200 rounded-lg p-3">
			<h4 class="font-medium text-base-content mb-2">Business Hours</h4>
			<div class="text-sm text-base-content/70 space-y-1">
				<p>Monday - Friday: 9:00 AM - 5:00 PM</p>
				<p>Saturday - Sunday: Closed</p>
				<p class="text-xs mt-2 text-base-content/50">
					* Appointments are available in 1-hour slots
				</p>
			</div>
		</div>
	</div>
{:else}
	<div class="text-center py-8 text-base-content/60">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-1 12a2 2 0 002 2h6a2 2 0 002-2L16 7" />
		</svg>
		<p class="text-lg font-medium">Select a date first</p>
		<p class="text-sm">Choose a date from the calendar to see available time slots.</p>
	</div>
{/if}

<style>
	button:not(:disabled):hover {
		transform: scale(1.05);
	}
	
	.btn-disabled {
		pointer-events: none;
	}
	
	/* Ensure perfect text centering in time slot buttons */
	.btn {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		line-height: 1;
	}
</style>