<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { adminAuth } from '$lib/stores/admin.js';
  
  let appointments = [];
  let isLoading = true;
  let selectedStatus = 'all';
  let searchTerm = '';
  
  const statusOptions = [
    { value: 'all', label: 'All Appointments' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];
  
  onMount(async () => {
    // Check authentication
    const user = await adminAuth.checkSession();
    if (!user) {
      goto('/admin/login');
      return;
    }
    
    await loadAppointments();
  });
  
  async function loadAppointments() {
    try {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      if (data.success) {
        appointments = data.appointments || [];
      } else {
        // Fallback demo data
        appointments = [
          {
            id: 1,
            customerName: 'Sarah Johnson',
            customerEmail: 'sarah@example.com',
            customerPhone: '(555) 123-4567',
            service: 'Gel Nails',
            appointmentDate: '2024-02-15',
            appointmentTime: '10:00 AM',
            status: 'confirmed',
            notes: 'First time client',
            createdAt: '2024-02-10T10:00:00Z'
          },
          {
            id: 2,
            customerName: 'Emily Davis',
            customerEmail: 'emily@example.com',
            customerPhone: '(555) 987-6543',
            service: 'Nail Art',
            appointmentDate: '2024-02-16',
            appointmentTime: '2:00 PM',
            status: 'pending',
            notes: 'Wants floral design',
            createdAt: '2024-02-11T14:30:00Z'
          },
          {
            id: 3,
            customerName: 'Jessica Wilson',
            customerEmail: 'jessica@example.com',
            customerPhone: '(555) 456-7890',
            service: 'Manicure & Pedicure',
            appointmentDate: '2024-02-17',
            appointmentTime: '11:00 AM',
            status: 'confirmed',
            notes: 'Regular client',
            createdAt: '2024-02-12T09:15:00Z'
          }
        ];
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      isLoading = false;
    }
  }
  
  async function updateAppointmentStatus(appointmentId, newStatus) {
    try {
      const response = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: appointmentId,
          status: newStatus
        })
      });
      
      const data = await response.json();
      if (data.success) {
        // Update local state
        appointments = appointments.map(apt => 
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        );
        
        // Show success message
        console.log(`Appointment ${newStatus} successfully`);
      } else {
        console.error('Failed to update appointment:', data.error);
        alert(`Failed to update appointment: ${data.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Network error updating appointment status');
    }
  }
  
  function getStatusVariant(status) {
    switch (status) {
      case 'confirmed': return 'variant-filled-success';
      case 'pending': return 'variant-filled-warning';
      case 'completed': return 'variant-filled-tertiary';
      case 'cancelled': return 'variant-filled-error';
      default: return 'variant-filled-surface';
    }
  }
  
  function getStatusIcon(status) {
    switch (status) {
      case 'confirmed': return '✅';
      case 'pending': return '⏳';
      case 'completed': return '✨';
      case 'cancelled': return '❌';
      default: return '📅';
    }
  }
  
  $: filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = selectedStatus === 'all' || appointment.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });
</script>

<svelte:head>
  <title>Appointments - Admin</title>
</svelte:head>

<div class="min-h-screen bg-surface-50-900-token">
  <!-- Header -->
  <header class="bg-white dark:bg-surface-800 shadow-sm border-b border-surface-200-700-token">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <a href="/admin/dashboard" class="btn variant-ghost-surface btn-sm mr-4">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </a>
          <h1 class="text-xl font-semibold text-surface-900-50-token">Appointments</h1>
        </div>
        
        <div class="flex items-center space-x-4">
          <span class="text-sm text-surface-600-300-token">
            {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  </header>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Filters -->
    <div class="card mb-6">
      <section class="p-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <input
              type="text"
              bind:value={searchTerm}
              placeholder="Search appointments..."
              class="input"
            />
          </div>
          <div class="w-full sm:w-48">
            <select bind:value={selectedStatus} class="select">
              {#each statusOptions as option}
                <option value={option.value}>{option.label}</option>
              {/each}
            </select>
          </div>
        </div>
      </section>
    </div>
    
    {#if isLoading}
      <div class="space-y-4">
        {#each Array(5) as _}
          <div class="card animate-pulse">
            <section class="p-6">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-surface-300-600-token rounded-full"></div>
                <div class="flex-1">
                  <div class="h-4 bg-surface-300-600-token rounded w-1/4 mb-2"></div>
                  <div class="h-3 bg-surface-300-600-token rounded w-1/2"></div>
                </div>
                <div class="h-8 bg-surface-300-600-token rounded w-24"></div>
              </div>
            </section>
          </div>
        {/each}
      </div>
    {:else}
      <div class="space-y-4">
        {#each filteredAppointments as appointment}
          <div class="card">
            <section class="p-6">
              <div class="flex items-start justify-between">
                <div class="flex items-start gap-4 flex-1">
                  <div class="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-lg">
                    {appointment.customerName.charAt(0).toUpperCase()}
                  </div>
                  
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-lg font-semibold text-surface-900-50-token">
                        {appointment.customerName}
                      </h3>
                      <span class="badge {getStatusVariant(appointment.status)}">
                        {getStatusIcon(appointment.status)} {appointment.status}
                      </span>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-surface-600-300-token">
                      <div>
                        <span class="font-medium">Email:</span>
                        <div>{appointment.customerEmail}</div>
                      </div>
                      <div>
                        <span class="font-medium">Phone:</span>
                        <div>{appointment.customerPhone || 'Not provided'}</div>
                      </div>
                      <div>
                        <span class="font-medium">Service:</span>
                        <div class="font-medium text-primary-600 dark:text-primary-400">{appointment.service}</div>
                      </div>
                      <div>
                        <span class="font-medium">Date & Time:</span>
                        <div>{new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}</div>
                      </div>
                    </div>
                    
                    {#if appointment.notes}
                      <div class="mt-3 p-3 bg-surface-100-800-token rounded-lg">
                        <span class="text-sm font-medium text-surface-700-200-token">Notes:</span>
                        <p class="text-sm text-surface-600-300-token mt-1">{appointment.notes}</p>
                      </div>
                    {/if}
                    
                    <div class="text-xs text-surface-500-400-token mt-2">
                      Booked: {new Date(appointment.createdAt).toLocaleDateString()} at {new Date(appointment.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                <div class="flex flex-col gap-2 ml-4">
                  {#if appointment.status === 'pending'}
                    <button
                      on:click={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                      class="btn variant-filled-success btn-sm"
                    >
                      ✅ Confirm
                    </button>
                    <button
                      on:click={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                      class="btn variant-filled-error btn-sm"
                    >
                      ❌ Cancel
                    </button>
                  {:else if appointment.status === 'confirmed'}
                    <button
                      on:click={() => updateAppointmentStatus(appointment.id, 'completed')}
                      class="btn variant-filled-tertiary btn-sm"
                    >
                      ✨ Complete
                    </button>
                    <button
                      on:click={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                      class="btn variant-filled-error btn-sm"
                    >
                      ❌ Cancel
                    </button>
                  {:else if appointment.status === 'cancelled'}
                    <button
                      on:click={() => updateAppointmentStatus(appointment.id, 'pending')}
                      class="btn variant-filled-warning btn-sm"
                    >
                      ⏳ Reopen
                    </button>
                  {/if}
                  
                  <a
                    href="mailto:{appointment.customerEmail}"
                    class="btn variant-ghost-primary btn-sm"
                  >
                    📧 Email
                  </a>
                  
                  {#if appointment.customerPhone}
                    <a
                      href="tel:{appointment.customerPhone}"
                      class="btn variant-ghost-secondary btn-sm"
                    >
                      📞 Call
                    </a>
                  {/if}
                </div>
              </div>
            </section>
          </div>
        {:else}
          <div class="card">
            <section class="p-12 text-center">
              <svg class="w-16 h-16 mx-auto text-surface-400-500-token mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <h3 class="text-lg font-semibold text-surface-900-50-token mb-2">No appointments found</h3>
              <p class="text-surface-600-300-token">
                {searchTerm || selectedStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Appointments will appear here when customers book services.'}
              </p>
            </section>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>