<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { adminAuth, adminUser, contentManager } from '$lib/stores/admin.js';
  
  let appointments = [];
  let pages = [];
  let stats = {
    totalAppointments: 0,
    pendingAppointments: 0,
    totalPages: 0,
    recentMessages: 0
  };
  let isLoading = true;
  
  onMount(async () => {
    // Check authentication
    const user = await adminAuth.checkSession();
    if (!user) {
      goto('/admin/login');
      return;
    }
    
    await loadDashboardData();
  });
  
  async function loadDashboardData() {
    try {
      // Load appointments
      const appointmentsResponse = await fetch('/api/appointments');
      const appointmentsData = await appointmentsResponse.json();
      if (appointmentsData.success) {
        appointments = appointmentsData.appointments || [];
        stats.totalAppointments = appointments.length;
        stats.pendingAppointments = appointments.filter(a => a.status === 'pending').length;
      }
      
      // Load pages
      pages = await contentManager.getPages();
      stats.totalPages = pages.length;
      
      // Mock recent messages count
      stats.recentMessages = 5;
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      isLoading = false;
    }
  }
  
  function getStatusVariant(status) {
    switch (status) {
      case 'confirmed': return 'variant-filled-success';
      case 'pending': return 'variant-filled-warning';
      case 'cancelled': return 'variant-filled-error';
      default: return 'variant-filled-surface';
    }
  }
  
  async function handleLogout() {
    await adminAuth.logout();
  }
</script>

<svelte:head>
  <title>Admin Dashboard - Polished Perfection</title>
</svelte:head>

<div class="min-h-screen bg-surface-50-900-token">
  <!-- Header -->
  <header class="bg-white dark:bg-surface-800 shadow-sm border-b border-surface-200-700-token">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <h1 class="text-xl font-semibold text-surface-900-50-token">Admin Dashboard</h1>
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <div class="text-sm text-surface-600-300-token">
            Welcome, {$adminUser?.email || 'Admin'}
          </div>
          <button
            on:click={handleLogout}
            class="btn variant-ghost-surface btn-sm"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {#if isLoading}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {#each Array(4) as _}
          <div class="card animate-pulse">
            <section class="p-6">
              <div class="h-4 bg-surface-300-600-token rounded w-3/4 mb-2"></div>
              <div class="h-8 bg-surface-300-600-token rounded w-1/2"></div>
            </section>
          </div>
        {/each}
      </div>
    {:else}
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <section class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium opacity-90">Total Appointments</p>
                <p class="text-2xl font-bold">{stats.totalAppointments}</p>
              </div>
            </div>
          </section>
        </div>
        
        <div class="card bg-gradient-to-br from-warning-500 to-warning-600 text-white">
          <section class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium opacity-90">Pending</p>
                <p class="text-2xl font-bold">{stats.pendingAppointments}</p>
              </div>
            </div>
          </section>
        </div>
        
        <div class="card bg-gradient-to-br from-secondary-500 to-secondary-600 text-white">
          <section class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium opacity-90">Content Pages</p>
                <p class="text-2xl font-bold">{stats.totalPages}</p>
              </div>
            </div>
          </section>
        </div>
        
        <div class="card bg-gradient-to-br from-tertiary-500 to-tertiary-600 text-white">
          <section class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium opacity-90">Messages</p>
                <p class="text-2xl font-bold">{stats.recentMessages}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <a href="/admin/content" class="card hover:shadow-lg transition-shadow">
          <section class="p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-surface-900-50-token">Manage Content</h3>
                <p class="text-surface-600-300-token">Edit pages and website content</p>
              </div>
            </div>
          </section>
        </a>
        
        <a href="/admin/appointments" class="card hover:shadow-lg transition-shadow">
          <section class="p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-secondary-100 dark:bg-secondary-900 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-surface-900-50-token">Appointments</h3>
                <p class="text-surface-600-300-token">View and manage bookings</p>
              </div>
            </div>
          </section>
        </a>
        
        <a href="/admin/gallery" class="card hover:shadow-lg transition-shadow">
          <section class="p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-tertiary-100 dark:bg-tertiary-900 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-tertiary-600 dark:text-tertiary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-surface-900-50-token">Gallery</h3>
                <p class="text-surface-600-300-token">Manage portfolio images</p>
              </div>
            </div>
          </section>
        </a>
      </div>
      
      <!-- Recent Appointments -->
      <div class="card">
        <header class="card-header">
          <h2 class="h3">Recent Appointments</h2>
          <a href="/admin/appointments" class="btn variant-ghost-primary btn-sm">View All</a>
        </header>
        <section class="p-0">
          <div class="table-container">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {#each appointments.slice(0, 5) as appointment}
                  <tr>
                    <td>
                      <div class="flex items-center gap-3">
                        <div class="avatar">
                          <div class="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                            {appointment.customerName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        </div>
                        <div>
                          <div class="font-semibold">{appointment.customerName}</div>
                          <div class="text-sm text-surface-600-300-token">{appointment.customerEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td>{appointment.service}</td>
                    <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                    <td>
                      <span class="badge {getStatusVariant(appointment.status)}">
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      <div class="flex gap-2">
                        <button class="btn btn-sm variant-ghost-primary">View</button>
                      </div>
                    </td>
                  </tr>
                {:else}
                  <tr>
                    <td colspan="5" class="text-center py-8 text-surface-600-300-token">
                      No appointments found
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
</div>