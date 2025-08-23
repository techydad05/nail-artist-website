<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { adminAuth, contentManager } from '$lib/stores/admin.js';
  
  let pageData = null;
  let sections = [];
  let isLoading = true;
  let showCreateModal = false;
  let editingSection = null;
  
  // Form data
  let formData = {
    sectionKey: '',
    sectionType: 'text',
    title: '',
    content: '',
    imageUrl: '',
    sortOrder: 0,
    isActive: true
  };
  
  const sectionTypes = [
    { value: 'text', label: 'Text Content' },
    { value: 'hero', label: 'Hero Section' },
    { value: 'services', label: 'Services' },
    { value: 'testimonials', label: 'Testimonials' },
    { value: 'gallery', label: 'Gallery' },
    { value: 'contact', label: 'Contact Info' }
  ];
  
  $: slug = $page.params.slug;
  
  onMount(async () => {
    // Check authentication
    const user = await adminAuth.checkSession();
    if (!user) {
      goto('/admin/login');
      return;
    }
    
    await loadPageSections();
  });
  
  async function loadPageSections() {
    try {
      const data = await contentManager.getPage(slug);
      pageData = data.page;
      sections = data.sections || [];
    } catch (error) {
      console.error('Error loading page sections:', error);
    } finally {
      isLoading = false;
    }
  }
  
  function openCreateModal() {
    formData = {
      sectionKey: '',
      sectionType: 'text',
      title: '',
      content: '',
      imageUrl: '',
      sortOrder: sections.length,
      isActive: true
    };
    editingSection = null;
    showCreateModal = true;
  }
  
  function openEditModal(section) {
    formData = {
      sectionKey: section.sectionKey,
      sectionType: section.sectionType,
      title: section.title || '',
      content: section.content || '',
      imageUrl: section.imageUrl || '',
      sortOrder: section.sortOrder,
      isActive: section.isActive
    };
    editingSection = section;
    showCreateModal = true;
  }
  
  function closeModal() {
    showCreateModal = false;
    editingSection = null;
  }
  
  async function handleSubmit() {
    try {
      if (editingSection) {
        await contentManager.updateSection(editingSection.id, formData);
      } else {
        await contentManager.createSection({
          pageSlug: slug,
          ...formData
        });
      }
      
      closeModal();
      await loadPageSections();
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Error saving section: ' + error.message);
    }
  }
  
  function generateSectionKey() {
    if (formData.title && !editingSection) {
      formData.sectionKey = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '_')
        .replace(/_+/g, '_')
        .trim('_');
    }
  }
</script>

<svelte:head>
  <title>Page Sections - {pageData?.title || 'Loading...'}</title>
</svelte:head>

<div class="min-h-screen bg-surface-50-900-token">
  <!-- Header -->
  <header class="bg-white dark:bg-surface-800 shadow-sm border-b border-surface-200-700-token">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <a href="/admin/content" class="btn variant-ghost-surface btn-sm mr-4">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Content
          </a>
          <div>
            <h1 class="text-xl font-semibold text-surface-900-50-token">Page Sections</h1>
            <p class="text-sm text-surface-600-300-token">{pageData?.title || 'Loading...'}</p>
          </div>
        </div>
        
        <button
          on:click={openCreateModal}
          class="btn variant-filled-primary"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          New Section
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
      <div class="space-y-4">
        {#each sections.sort((a, b) => a.sortOrder - b.sortOrder) as section}
          <div class="card">
            <section class="p-6">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-lg font-semibold text-surface-900-50-token">
                      {section.title || section.sectionKey}
                    </h3>
                    <span class="badge variant-soft-primary">{section.sectionType}</span>
                    <span class="badge {section.isActive ? 'variant-filled-success' : 'variant-filled-warning'}">
                      {section.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p class="text-surface-600-300-token text-sm mb-2">Key: {section.sectionKey}</p>
                  {#if section.content}
                    <div class="text-surface-600-300-token text-sm line-clamp-2">
                      {section.content.substring(0, 150)}{section.content.length > 150 ? '...' : ''}
                    </div>
                  {/if}
                  <div class="text-xs text-surface-500-400-token mt-2">
                    Sort Order: {section.sortOrder} • Last updated: {new Date(section.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div class="flex gap-2">
                  <button
                    on:click={() => openEditModal(section)}
                    class="btn variant-filled-primary btn-sm"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    Edit
                  </button>
                </div>
              </div>
            </section>
          </div>
        {:else}
          <div class="card">
            <section class="p-12 text-center">
              <svg class="w-16 h-16 mx-auto text-surface-400-500-token mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
              <h3 class="text-lg font-semibold text-surface-900-50-token mb-2">No sections found</h3>
              <p class="text-surface-600-300-token mb-4">Add sections to customize this page's content.</p>
              <button
                on:click={openCreateModal}
                class="btn variant-filled-primary"
              >
                Create First Section
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
          {editingSection ? 'Edit Section' : 'Create New Section'}
        </h2>
      </header>
      
      <section class="modal-body p-6">
        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="title" class="label">
                <span>Section Title</span>
              </label>
              <input
                id="title"
                type="text"
                bind:value={formData.title}
                on:input={generateSectionKey}
                placeholder="Welcome Section"
                class="input"
                required
              />
            </div>
            
            <div>
              <label for="sectionKey" class="label">
                <span>Section Key</span>
              </label>
              <input
                id="sectionKey"
                type="text"
                bind:value={formData.sectionKey}
                placeholder="welcome_section"
                class="input"
                required
                disabled={!!editingSection}
              />
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="sectionType" class="label">
                <span>Section Type</span>
              </label>
              <select
                id="sectionType"
                bind:value={formData.sectionType}
                class="select"
                required
              >
                {#each sectionTypes as type}
                  <option value={type.value}>{type.label}</option>
                {/each}
              </select>
            </div>
            
            <div>
              <label for="sortOrder" class="label">
                <span>Sort Order</span>
              </label>
              <input
                id="sortOrder"
                type="number"
                bind:value={formData.sortOrder}
                min="0"
                class="input"
                required
              />
            </div>
          </div>
          
          {#if formData.sectionType === 'hero' || formData.sectionType === 'gallery'}
            <div>
              <label for="imageUrl" class="label">
                <span>Image URL</span>
              </label>
              <input
                id="imageUrl"
                type="url"
                bind:value={formData.imageUrl}
                placeholder="https://example.com/image.jpg"
                class="input"
              />
            </div>
          {/if}
          
          <div>
            <label for="content" class="label">
              <span>Content</span>
            </label>
            <textarea
              id="content"
              bind:value={formData.content}
              placeholder="Enter section content here..."
              class="textarea"
              rows="6"
              required
            ></textarea>
          </div>
          
          <div class="flex items-center">
            <input
              id="isActive"
              type="checkbox"
              bind:checked={formData.isActive}
              class="checkbox"
            />
            <label for="isActive" class="label ml-2">
              <span>Active</span>
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
          {editingSection ? 'Update Section' : 'Create Section'}
        </button>
      </footer>
    </div>
  </div>
{/if}