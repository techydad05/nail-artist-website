<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { adminAuth, adminUser, contentManager } from '$lib/stores/admin.js';
  
  let pages = [];
  let isLoading = true;
  let showCreateModal = false;
  let editingPage = null;
  
  // Form data
  let formData = {
    slug: '',
    title: '',
    content: '',
    metaDescription: '',
    isPublished: true
  };
  
  onMount(async () => {
    // Check authentication
    const user = await adminAuth.checkSession();
    if (!user) {
      goto('/admin/login');
      return;
    }
    
    await loadPages();
  });
  
  async function loadPages() {
    try {
      pages = await contentManager.getPages();
    } catch (error) {
      console.error('Error loading pages:', error);
    } finally {
      isLoading = false;
    }
  }
  
  function openCreateModal() {
    formData = {
      slug: '',
      title: '',
      content: '',
      metaDescription: '',
      isPublished: true
    };
    editingPage = null;
    showCreateModal = true;
  }
  
  function openEditModal(page) {
    formData = {
      slug: page.slug,
      title: page.title,
      content: page.content,
      metaDescription: page.metaDescription || '',
      isPublished: page.isPublished
    };
    editingPage = page;
    showCreateModal = true;
  }
  
  function closeModal() {
    showCreateModal = false;
    editingPage = null;
  }
  
  async function handleSubmit() {
    try {
      if (editingPage) {
        await contentManager.updatePage(editingPage.id, formData);
      } else {
        await contentManager.createPage(formData);
      }
      
      closeModal();
      await loadPages();
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Error saving page: ' + error.message);
    }
  }
  
  function generateSlug() {
    if (formData.title && !editingPage) {
      formData.slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    }
  }
</script>

<svelte:head>
  <title>Content Management - Admin</title>
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
          <h1 class="text-xl font-semibold text-surface-900-50-token">Content Management</h1>
        </div>
        
        <button
          on:click={openCreateModal}
          class="btn variant-filled-primary"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          New Page
        </button>
      </div>
    </div>
  </header>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {#if isLoading}
      <div class="space-y-4">
        {#each Array(3) as _}
          <div class="card animate-pulse">
            <section class="p-6">
              <div class="h-4 bg-surface-300-600-token rounded w-1/4 mb-2"></div>
              <div class="h-3 bg-surface-300-600-token rounded w-3/4 mb-4"></div>
              <div class="h-8 bg-surface-300-600-token rounded w-32"></div>
            </section>
          </div>
        {/each}
      </div>
    {:else}
      <div class="grid gap-6">
        {#each pages as page}
          <div class="card">
            <section class="p-6">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-lg font-semibold text-surface-900-50-token">{page.title}</h3>
                    <span class="badge {page.isPublished ? 'variant-filled-success' : 'variant-filled-warning'}">
                      {page.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p class="text-surface-600-300-token text-sm mb-2">/{page.slug}</p>
                  {#if page.metaDescription}
                    <p class="text-surface-600-300-token text-sm">{page.metaDescription}</p>
                  {/if}
                  <div class="text-xs text-surface-500-400-token mt-2">
                    Last updated: {new Date(page.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div class="flex gap-2">
                  <a
                    href="/{page.slug}"
                    target="_blank"
                    class="btn variant-ghost-surface btn-sm"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                    View
                  </a>
                  <button
                    on:click={() => openEditModal(page)}
                    class="btn variant-filled-primary btn-sm"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    Edit
                  </button>
                  <a
                    href="/admin/content/{page.slug}/sections"
                    class="btn variant-ghost-primary btn-sm"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                    </svg>
                    Sections
                  </a>
                </div>
              </div>
            </section>
          </div>
        {:else}
          <div class="card">
            <section class="p-12 text-center">
              <svg class="w-16 h-16 mx-auto text-surface-400-500-token mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <h3 class="text-lg font-semibold text-surface-900-50-token mb-2">No pages found</h3>
              <p class="text-surface-600-300-token mb-4">Get started by creating your first content page.</p>
              <button
                on:click={openCreateModal}
                class="btn variant-filled-primary"
              >
                Create First Page
              </button>
            </section>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<!-- Create/Edit Modal -->
{#if showCreateModal}
  <div class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div class="modal bg-white dark:bg-surface-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <header class="modal-header p-6 border-b border-surface-200-700-token">
        <h2 class="text-xl font-semibold">
          {editingPage ? 'Edit Page' : 'Create New Page'}
        </h2>
      </header>
      
      <section class="modal-body p-6">
        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="title" class="label">
                <span>Page Title</span>
              </label>
              <input
                id="title"
                type="text"
                bind:value={formData.title}
                on:input={generateSlug}
                placeholder="About Us"
                class="input"
                required
              />
            </div>
            
            <div>
              <label for="slug" class="label">
                <span>URL Slug</span>
              </label>
              <input
                id="slug"
                type="text"
                bind:value={formData.slug}
                placeholder="about-us"
                class="input"
                required
                disabled={!!editingPage}
              />
            </div>
          </div>
          
          <div>
            <label for="metaDescription" class="label">
              <span>Meta Description</span>
            </label>
            <input
              id="metaDescription"
              type="text"
              bind:value={formData.metaDescription}
              placeholder="Brief description for search engines"
              class="input"
            />
          </div>
          
          <div>
            <label for="content" class="label">
              <span>Content</span>
            </label>
            <textarea
              id="content"
              bind:value={formData.content}
              placeholder="Enter your page content here..."
              class="textarea"
              rows="10"
              required
            ></textarea>
          </div>
          
          <div class="flex items-center">
            <input
              id="isPublished"
              type="checkbox"
              bind:checked={formData.isPublished}
              class="checkbox"
            />
            <label for="isPublished" class="label ml-2">
              <span>Published</span>
            </label>
          </div>
        </form>
      </section>
      
      <footer class="modal-footer p-6 border-t border-surface-200-700-token flex justify-end gap-3">
        <button
          type="button"
          on:click={closeModal}
          class="btn variant-ghost-surface"
        >
          Cancel
        </button>
        <button
          type="submit"
          on:click={handleSubmit}
          class="btn variant-filled-primary"
        >
          {editingPage ? 'Update Page' : 'Create Page'}
        </button>
      </footer>
    </div>
  </div>
{/if}