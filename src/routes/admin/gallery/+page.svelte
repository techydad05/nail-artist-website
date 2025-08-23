<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { adminAuth } from '$lib/stores/admin.js';
  
  let images = [];
  let isLoading = true;
  let selectedCategory = 'all';
  let showUploadModal = false;
  let uploadFiles = [];
  
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'nail-art', label: 'Nail Art' },
    { value: 'gel-nails', label: 'Gel Nails' },
    { value: 'manicure', label: 'Manicure' },
    { value: 'pedicure', label: 'Pedicure' },
    { value: 'special-occasion', label: 'Special Occasion' }
  ];
  
  onMount(async () => {
    // Check authentication
    const user = await adminAuth.checkSession();
    if (!user) {
      goto('/admin/login');
      return;
    }
    
    await loadGallery();
  });
  
  async function loadGallery() {
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      if (data.success) {
        images = data.images || [];
      } else {
        // Fallback demo data
        images = [
          {
            id: 1,
            filename: 'nail-art-1.jpg',
            originalName: 'Beautiful Floral Design',
            category: 'nail-art',
            description: 'Elegant floral nail art design',
            isActive: true,
            sortOrder: 1,
            createdAt: '2024-02-10T10:00:00Z'
          },
          {
            id: 2,
            filename: 'gel-nails-1.jpg',
            originalName: 'Classic Gel Manicure',
            category: 'gel-nails',
            description: 'Professional gel nail application',
            isActive: true,
            sortOrder: 2,
            createdAt: '2024-02-11T14:30:00Z'
          },
          {
            id: 3,
            filename: 'special-occasion-1.jpg',
            originalName: 'Wedding Nails',
            category: 'special-occasion',
            description: 'Bridal nail design with pearls',
            isActive: true,
            sortOrder: 3,
            createdAt: '2024-02-12T09:15:00Z'
          }
        ];
      }
    } catch (error) {
      console.error('Error loading gallery:', error);
    } finally {
      isLoading = false;
    }
  }
  
  async function toggleImageStatus(imageId, currentStatus) {
    try {
      const response = await fetch('/api/gallery', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: imageId,
          isActive: !currentStatus
        })
      });
      
      const data = await response.json();
      if (data.success) {
        // Update local state
        images = images.map(img => 
          img.id === imageId ? { ...img, isActive: !currentStatus } : img
        );
      } else {
        console.error('Failed to update image status:', data.error);
        alert('Failed to update image status');
      }
    } catch (error) {
      console.error('Error updating image status:', error);
      alert('Network error updating image status');
    }
  }
  
  async function deleteImage(imageId) {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/gallery?id=${imageId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (data.success) {
        images = images.filter(img => img.id !== imageId);
      } else {
        console.error('Failed to delete image:', data.error);
        alert('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Network error deleting image');
    }
  }
  
  function handleFileSelect(event) {
    uploadFiles = Array.from(event.target.files);
  }
  
  async function handleUpload() {
    if (uploadFiles.length === 0) {
      alert('Please select files to upload');
      return;
    }
    
    const formData = new FormData();
    uploadFiles.forEach(file => {
      formData.append('images', file);
    });
    
    try {
      const response = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        showUploadModal = false;
        uploadFiles = [];
        await loadGallery();
      } else {
        console.error('Upload failed:', data.error);
        alert('Upload failed: ' + data.error);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Network error during upload');
    }
  }
  
  $: filteredImages = images.filter(image => {
    return selectedCategory === 'all' || image.category === selectedCategory;
  });
</script>

<svelte:head>
  <title>Gallery Management - Admin</title>
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
          <h1 class="text-xl font-semibold text-surface-900-50-token">Gallery Management</h1>
        </div>
        
        <button
          on:click={() => showUploadModal = true}
          class="btn variant-filled-primary"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Upload Images
        </button>
      </div>
    </div>
  </header>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Filters -->
    <div class="card mb-6">
      <section class="p-4">
        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="w-full sm:w-48">
            <select bind:value={selectedCategory} class="select">
              {#each categories as category}
                <option value={category.value}>{category.label}</option>
              {/each}
            </select>
          </div>
          <div class="text-sm text-surface-600-300-token">
            {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''}
          </div>
        </div>
      </section>
    </div>
    
    {#if isLoading}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {#each Array(8) as _}
          <div class="card animate-pulse">
            <div class="aspect-square bg-surface-300-600-token"></div>
            <section class="p-4">
              <div class="h-4 bg-surface-300-600-token rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-surface-300-600-token rounded w-1/2"></div>
            </section>
          </div>
        {/each}
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {#each filteredImages as image}
          <div class="card overflow-hidden">
            <div class="aspect-square bg-surface-200-700-token relative">
              <img
                src="/gallery/{image.filename}"
                alt={image.originalName}
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div class="absolute top-2 right-2">
                <span class="badge {image.isActive ? 'variant-filled-success' : 'variant-filled-warning'}">
                  {image.isActive ? 'Active' : 'Hidden'}
                </span>
              </div>
            </div>
            
            <section class="p-4">
              <h3 class="font-semibold text-surface-900-50-token mb-1 line-clamp-1">
                {image.originalName}
              </h3>
              <p class="text-sm text-surface-600-300-token mb-2 capitalize">
                {image.category.replace('-', ' ')}
              </p>
              {#if image.description}
                <p class="text-xs text-surface-500-400-token mb-3 line-clamp-2">
                  {image.description}
                </p>
              {/if}
              
              <div class="flex gap-2">
                <button
                  on:click={() => toggleImageStatus(image.id, image.isActive)}
                  class="btn btn-sm {image.isActive ? 'variant-ghost-warning' : 'variant-ghost-success'}"
                >
                  {image.isActive ? '👁️‍🗨️ Hide' : '👁️ Show'}
                </button>
                <button
                  on:click={() => deleteImage(image.id)}
                  class="btn btn-sm variant-ghost-error"
                >
                  🗑️ Delete
                </button>
              </div>
              
              <div class="text-xs text-surface-500-400-token mt-2">
                Added: {new Date(image.createdAt).toLocaleDateString()}
              </div>
            </section>
          </div>
        {:else}
          <div class="col-span-full">
            <div class="card">
              <section class="p-12 text-center">
                <svg class="w-16 h-16 mx-auto text-surface-400-500-token mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <h3 class="text-lg font-semibold text-surface-900-50-token mb-2">No images found</h3>
                <p class="text-surface-600-300-token mb-4">
                  {selectedCategory !== 'all' 
                    ? 'No images in this category. Try selecting a different category.' 
                    : 'Upload your first images to get started.'}
                </p>
                <button
                  on:click={() => showUploadModal = true}
                  class="btn variant-filled-primary"
                >
                  Upload Images
                </button>
              </section>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<!-- Upload Modal -->
{#if showUploadModal}
  <div class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div class="modal bg-white dark:bg-surface-800 rounded-lg shadow-xl max-w-md w-full">
      <header class="modal-header p-6 border-b border-surface-200-700-token">
        <h2 class="text-xl font-semibold">Upload Images</h2>
      </header>
      
      <section class="modal-body p-6">
        <div class="space-y-4">
          <div>
            <label for="imageFiles" class="label">
              <span>Select Images</span>
            </label>
            <input
              id="imageFiles"
              type="file"
              multiple
              accept="image/*"
              on:change={handleFileSelect}
              class="input"
            />
            <p class="text-xs text-surface-500-400-token mt-1">
              Select multiple images to upload. Supported formats: JPG, PNG, WebP
            </p>
          </div>
          
          {#if uploadFiles.length > 0}
            <div>
              <h4 class="font-medium mb-2">Selected Files:</h4>
              <ul class="text-sm text-surface-600-300-token space-y-1">
                {#each uploadFiles as file}
                  <li>• {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>
      </section>
      
      <footer class="modal-footer p-6 border-t border-surface-200-700-token flex justify-end gap-3">
        <button
          type="button"
          on:click={() => { showUploadModal = false; uploadFiles = []; }}
          class="btn variant-ghost-surface"
        >
          Cancel
        </button>
        <button
          type="button"
          on:click={handleUpload}
          disabled={uploadFiles.length === 0}
          class="btn variant-filled-primary"
        >
          Upload {uploadFiles.length} Image{uploadFiles.length !== 1 ? 's' : ''}
        </button>
      </footer>
    </div>
  </div>
{/if}