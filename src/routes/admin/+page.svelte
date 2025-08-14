<script>
	import { onMount } from 'svelte';
	
	let appointments = [];
	let isLoading = true;
	
	onMount(async () => {
		try {
			const response = await fetch('/api/appointments');
			const data = await response.json();
			if (data.success) {
				appointments = data.appointments || [];
			}
		} catch (error) {
			console.error('Error loading appointments:', error);
			// Fallback demo data
			appointments = [
				{
					id: 1,
					customerName: 'Sarah Johnson',
					customerEmail: 'sarah@example.com',
					service: 'Gel Nails',
					appointmentDate: '2024-02-15',
					appointmentTime: '10:00 AM',
					status: 'confirmed'
				},
				{
					id: 2,
					customerName: 'Emily Davis',
					customerEmail: 'emily@example.com',
					service: 'Nail Art',
					appointmentDate: '2024-02-16',
					appointmentTime: '2:00 PM',
					status: 'pending'
				}
			];
		} finally {
			isLoading = false;
		}
	});
	
	function getStatusVariant(status) {
		switch (status) {
			case 'confirmed': return 'variant-filled-success';
			case 'pending': return 'variant-filled-warning';
			case 'cancelled': return 'variant-filled-error';
			default: return 'variant-filled-surface';
		}
	}
</script>

<div class="container mx-auto p-8">
	<header class="mb-8">
		<h1 class="h1 mb-2">Admin Dashboard</h1>
		<p class="text-surface-600-300-token">Manage appointments and bookings</p>
	</header>
	
	{#if isLoading}
		<div class="card">
			<section class="p-4">
				<div class="space-y-4">
					<div class="progress-bar">
						<div class="progress-bar-filled bg-primary-500 animate-pulse"></div>
					</div>
					<div class="placeholder animate-pulse">
						<div class="placeholder-circle w-16"></div>
						<div class="placeholder-line"></div>
						<div class="placeholder-line"></div>
					</div>
				</div>
			</section>
		</div>
	{:else}
		<div class="card">
			<header class="card-header">
				<h2 class="h2">Recent Appointments</h2>
			</header>
			<section class="p-4">
				<div class="table-container">
					<table class="table table-hover">
						<thead>
							<tr>
								<th>Customer</th>
								<th>Service</th>
								<th>Date</th>
								<th>Time</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each appointments as appointment}
								<tr>
									<td>
										<div class="flex items-center gap-3">
											<div class="avatar">
												<div class="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
													{appointment.customerName.charAt(0).toUpperCase()}
												</div>
											</div>
											<div>
												<div class="font-bold">{appointment.customerName}</div>
												<div class="text-sm opacity-50">{appointment.customerEmail}</div>
											</div>
										</div>
									</td>
									<td>{appointment.service}</td>
									<td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
									<td>{appointment.appointmentTime}</td>
									<td>
										<span class="badge {getStatusVariant(appointment.status)}">
											{appointment.status}
										</span>
									</td>
									<td>
										<div class="flex gap-2">
											<button class="btn btn-sm variant-filled-primary">Edit</button>
											<button class="btn btn-sm variant-filled-error">Cancel</button>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	{/if}
</div>