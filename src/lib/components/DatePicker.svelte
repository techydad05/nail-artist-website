<script>
	import { createEventDispatcher, onMount } from 'svelte';
	
	const dispatch = createEventDispatcher();
	
	// Props
	export let selectedDate = '';
	export let bookedAppointments = [];
	export let isLoading = false;
	
	// Calendar state
	let currentMonth = new Date().getMonth();
	let currentYear = new Date().getFullYear();
	let calendarDays = [];
	
	// Available time slots for availability calculation
	const timeSlots = [
		'9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
		'1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
	];
	
	const monthNames = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];
	
	const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	
	// Generate calendar days for the current month/year
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
			
			// Skip weekends (optional - can be configured)
			const isWeekend = date.getDay() === 0 || date.getDay() === 6;
			
			days.push({
				date: date.getDate(),
				fullDate: dateString,
				isCurrentMonth,
				isPast,
				isToday,
				isWeekend,
				hasAvailableSlots: hasAvailableSlots && !isPast && !isWeekend,
				bookedSlots: bookedSlotsForDate.length,
				isSelectable: !isPast && !isWeekend && isCurrentMonth && hasAvailableSlots
			});
		}
		
		return days;
	}
	
	// Navigation functions
	function previousMonth() {
		if (currentMonth === 0) {
			currentMonth = 11;
			currentYear--;
		} else {
			currentMonth--;
		}
		updateCalendar();
	}
	
	function nextMonth() {
		if (currentMonth === 11) {
			currentMonth = 0;
			currentYear++;
		} else {
			currentMonth++;
		}
		updateCalendar();
	}
	
	function updateCalendar() {
		calendarDays = generateCalendar(currentMonth, currentYear);
	}
	
	// Date selection
	function selectDate(day) {
		if (!day.isSelectable) return;
		
		selectedDate = day.fullDate;
		dispatch('dateSelected', {
			date: day.fullDate,
			dateObject: new Date(day.fullDate + 'T00:00:00')
		});
	}
	
	// Initialize calendar
	onMount(() => {
		updateCalendar();
	});
	
	// Update calendar when booked appointments change
	$: if (bookedAppointments) {
		updateCalendar();
	}
	
	// Keyboard navigation
	function handleKeydown(event) {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			previousMonth();
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			nextMonth();
		} else if (event.key === 'Home') {
			event.preventDefault();
			// Go to current month
			const today = new Date();
			currentMonth = today.getMonth();
			currentYear = today.getFullYear();
			updateCalendar();
		}
	}
	
	// Handle date keyboard navigation
	function handleDateKeydown(event, day) {
		if (!day.isSelectable) return;
		
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			selectDate(day);
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="space-y-4">
	<h3 class="text-xl font-semibold mb-4 text-base-content">Select a Date</h3>
	
	<div class="calendar-container bg-base-200 border border-base-300 rounded-lg overflow-hidden">
		<!-- Calendar Header -->
		<div class="bg-gradient-to-r from-primary to-secondary text-white p-4 flex justify-between items-center">
			<button 
				class="btn btn-ghost btn-sm text-white hover:bg-white/20"
				on:click={previousMonth}
				disabled={isLoading}
				aria-label="Previous month"
			>
				‹
			</button>
			<h4 class="text-lg font-semibold">
				{monthNames[currentMonth]} {currentYear}
			</h4>
			<button 
				class="btn btn-ghost btn-sm text-white hover:bg-white/20"
				on:click={nextMonth}
				disabled={isLoading}
				aria-label="Next month"
			>
				›
			</button>
		</div>
		
		<!-- Calendar Grid -->
		<div class="p-4">
			{#if isLoading}
				<div class="flex justify-center items-center py-8">
					<span class="loading loading-spinner loading-md"></span>
					<span class="ml-2">Loading availability...</span>
				</div>
			{:else}
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
							class="aspect-square p-2 text-sm rounded-lg transition-all duration-200 relative text-base-content focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
							class:opacity-40={!day.isCurrentMonth}
							class:bg-primary={day.isToday && day.isCurrentMonth}
							class:bg-success={day.hasAvailableSlots && day.isCurrentMonth && !day.isToday}
							class:bg-warning={day.bookedSlots > 0 && day.hasAvailableSlots && day.isCurrentMonth && !day.isToday}
							class:bg-error={!day.hasAvailableSlots && day.isCurrentMonth && !day.isPast && !day.isWeekend}
							class:bg-base-300={day.isPast || day.isWeekend}
							class:text-white={(day.isToday && day.isCurrentMonth) || (day.hasAvailableSlots && day.isCurrentMonth && !day.isToday) || (!day.hasAvailableSlots && day.isCurrentMonth && !day.isPast && !day.isWeekend)}
							class:ring-2={selectedDate === day.fullDate}
							class:ring-primary={selectedDate === day.fullDate}
							class:cursor-not-allowed={!day.isSelectable}
							class:hover:bg-primary-focus={day.isSelectable}
							class:hover:scale-105={day.isSelectable}
							disabled={!day.isSelectable || isLoading}
							on:click={() => selectDate(day)}
							on:keydown={(e) => handleDateKeydown(e, day)}
							aria-label={`${day.isSelectable ? 'Select' : 'Unavailable'} ${monthNames[currentMonth]} ${day.date}, ${currentYear}`}
							aria-pressed={selectedDate === day.fullDate}
							tabindex={day.isSelectable ? 0 : -1}
						>
							{day.date}
							{#if day.bookedSlots > 0 && day.isCurrentMonth}
								<div class="absolute bottom-0 right-0 w-2 h-2 bg-error rounded-full"></div>
							{/if}
							{#if day.isWeekend && day.isCurrentMonth}
								<div class="absolute top-0 left-0 w-2 h-2 bg-base-content/30 rounded-full"></div>
							{/if}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>
	
	<!-- Legend -->
	<div class="flex flex-wrap gap-4 text-sm text-base-content">
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
		<div class="flex items-center">
			<div class="w-4 h-4 bg-base-300 rounded mr-2"></div>
			<span>Unavailable</span>
		</div>
		<div class="flex items-center">
			<div class="w-4 h-4 bg-primary rounded mr-2"></div>
			<span>Today</span>
		</div>
	</div>
</div>

<style>
	.calendar-container {
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
	}
	
	button:disabled {
		cursor: not-allowed;
	}
	
	button:not(:disabled):hover {
		transform: scale(1.05);
	}
</style>