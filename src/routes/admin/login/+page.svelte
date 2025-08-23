<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { adminAuth, adminUser, isLoading } from '$lib/stores/admin.js';
  
  let email = '';
  let password = '';
  let error = '';
  let showPassword = false;
  
  onMount(async () => {
    // Check if already logged in
    const user = await adminAuth.checkSession();
    if (user) {
      goto('/admin/dashboard');
    }
  });
  
  async function handleLogin() {
    if (!email || !password) {
      error = 'Please enter both email and password';
      return;
    }
    
    error = '';
    const result = await adminAuth.login(email, password);
    
    if (result.success) {
      goto('/admin/dashboard');
    } else {
      error = result.error || 'Login failed';
    }
  }
  
  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      handleLogin();
    }
  }
</script>

<svelte:head>
  <title>Admin Login - Polished Perfection</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900 p-4">
  <div class="w-full max-w-md">
    <!-- Logo/Brand -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mb-4">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z"/>
        </svg>
      </div>
      <h1 class="text-3xl font-bold text-surface-50-900-token mb-2">Admin Portal</h1>
      <p class="text-surface-400-500-token">Sign in to manage your website</p>
    </div>
    
    <!-- Login Form -->
    <div class="card bg-surface-800/90 backdrop-blur-sm border border-surface-700 shadow-xl">
      <section class="p-8">
        <form on:submit|preventDefault={handleLogin} class="space-y-6">
          <!-- Email Field -->
          <div class="space-y-2">
            <label for="email" class="label text-surface-200-700-token">
              <span class="text-sm font-medium">Email Address</span>
            </label>
            <input
              id="email"
              type="email"
              bind:value={email}
              on:keypress={handleKeyPress}
              placeholder="admin@example.com"
              class="input bg-surface-700 border-surface-600 text-surface-50-900-token placeholder-surface-400 focus:border-primary-500 focus:ring-primary-500 px-4 py-3"
              required
            />
          </div>
          
          <!-- Password Field -->
          <div class="space-y-2">
            <label for="password" class="label text-surface-200-700-token">
              <span class="text-sm font-medium">Password</span>
            </label>
            <div class="relative">
              {#if showPassword}
                <input
                  id="password"
                  type="text"
                  bind:value={password}
                  on:keypress={handleKeyPress}
                  placeholder="Enter your password"
                  class="input bg-surface-700 border-surface-600 text-surface-50-900-token placeholder-surface-400 focus:border-primary-500 focus:ring-primary-500 px-4 py-3 pr-12"
                  required
                />
              {:else}
                <input
                  id="password"
                  type="password"
                  bind:value={password}
                  on:keypress={handleKeyPress}
                  placeholder="Enter your password"
                  class="input bg-surface-700 border-surface-600 text-surface-50-900-token placeholder-surface-400 focus:border-primary-500 focus:ring-primary-500 px-4 py-3 pr-12"
                  required
                />
              {/if}
              <button
                type="button"
                on:click={() => showPassword = !showPassword}
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-200 transition-colors duration-200"
              >
                {#if showPassword}
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 0 1 1.563-3.029m5.858.908a3 3 0 1 1 4.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                  </svg>
                {:else}
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                {/if}
              </button>
            </div>
          </div>
          
          <!-- Error Message -->
          {#if error}
            <div class="alert variant-filled-error">
              <div class="alert-message">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                </svg>
                <span>{error}</span>
              </div>
            </div>
          {/if}
          
          <!-- Submit Button -->
          <button
            type="submit"
            disabled={$isLoading}
            class="btn variant-filled-primary w-full py-3 font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100"
          >
            {#if $isLoading}
              <div class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </div>
            {:else}
              Sign In
            {/if}
          </button>
        </form>
      </section>
    </div>
    
    <!-- Footer -->
    <div class="text-center mt-8 text-surface-400-500-token text-sm">
      <p>© 2024 Polished Perfection. All rights reserved.</p>
    </div>
  </div>
</div>

<style>
  :global(body) {
    background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%);
  }
</style>