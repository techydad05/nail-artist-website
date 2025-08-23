<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { error } from '@sveltejs/kit';
  
  export let data;
  
  let pageContent = data.page;
  let sections = data.sections || [];
  
  $: slug = $page.params.slug;
  
  function renderSection(section) {
    switch (section.sectionType) {
      case 'hero':
        return renderHeroSection(section);
      case 'services':
        return renderServicesSection(section);
      case 'testimonials':
        return renderTestimonialsSection(section);
      case 'gallery':
        return renderGallerySection(section);
      case 'contact':
        return renderContactSection(section);
      default:
        return renderTextSection(section);
    }
  }
  
  function renderHeroSection(section) {
    return `
      <section class="hero-section py-20 bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">${section.title || ''}</h1>
          <p class="text-xl md:text-2xl mb-8 opacity-90">${section.content || ''}</p>
          ${section.imageUrl ? `<img src="${section.imageUrl}" alt="${section.title}" class="mx-auto rounded-lg shadow-xl max-w-md">` : ''}
        </div>
      </section>
    `;
  }
  
  function renderServicesSection(section) {
    return `
      <section class="services-section py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">${section.title || ''}</h2>
          <div class="prose prose-lg mx-auto">
            ${section.content || ''}
          </div>
        </div>
      </section>
    `;
  }
  
  function renderTestimonialsSection(section) {
    return `
      <section class="testimonials-section py-16 bg-surface-100-800-token">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">${section.title || ''}</h2>
          <div class="prose prose-lg mx-auto text-center">
            ${section.content || ''}
          </div>
        </div>
      </section>
    `;
  }
  
  function renderGallerySection(section) {
    return `
      <section class="gallery-section py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">${section.title || ''}</h2>
          <div class="prose prose-lg mx-auto">
            ${section.content || ''}
          </div>
          ${section.imageUrl ? `<div class="mt-8 text-center"><img src="${section.imageUrl}" alt="${section.title}" class="mx-auto rounded-lg shadow-lg"></div>` : ''}
        </div>
      </section>
    `;
  }
  
  function renderContactSection(section) {
    return `
      <section class="contact-section py-16 bg-surface-50-900-token">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">${section.title || ''}</h2>
          <div class="prose prose-lg mx-auto">
            ${section.content || ''}
          </div>
        </div>
      </section>
    `;
  }
  
  function renderTextSection(section) {
    return `
      <section class="text-section py-12">
        <div class="container mx-auto px-4">
          ${section.title ? `<h2 class="text-3xl font-bold mb-8">${section.title}</h2>` : ''}
          <div class="prose prose-lg mx-auto">
            ${section.content || ''}
          </div>
        </div>
      </section>
    `;
  }
</script>

<svelte:head>
  <title>{pageContent?.title || 'Page'} - Polished Perfection</title>
  {#if pageContent?.metaDescription}
    <meta name="description" content={pageContent.metaDescription} />
  {/if}
</svelte:head>

<div class="min-h-screen">
  {#if pageContent}
    <!-- Page Header -->
    <header class="page-header py-12 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{pageContent.title}</h1>
        {#if pageContent.metaDescription}
          <p class="text-xl opacity-90">{pageContent.metaDescription}</p>
        {/if}
      </div>
    </header>
    
    <!-- Page Content -->
    <main class="page-content">
      {#if sections.length > 0}
        <!-- Render sections dynamically -->
        {#each sections.filter(s => s.isActive).sort((a, b) => a.sortOrder - b.sortOrder) as section}
          {@html renderSection(section)}
        {/each}
      {:else}
        <!-- Fallback to main content -->
        <section class="py-16">
          <div class="container mx-auto px-4">
            <div class="prose prose-lg mx-auto">
              {@html pageContent.content.replace(/\n/g, '<br>')}
            </div>
          </div>
        </section>
      {/if}
    </main>
  {:else}
    <div class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-surface-900-50-token mb-4">Page Not Found</h1>
        <p class="text-surface-600-300-token mb-8">The page you're looking for doesn't exist.</p>
        <a href="/" class="btn variant-filled-primary">Go Home</a>
      </div>
    </div>
  {/if}
</div>

<style>
  :global(.prose) {
    max-width: none;
  }
  
  :global(.prose h1) {
    @apply text-3xl font-bold mb-6 text-surface-900-50-token;
  }
  
  :global(.prose h2) {
    @apply text-2xl font-bold mb-4 text-surface-900-50-token;
  }
  
  :global(.prose h3) {
    @apply text-xl font-semibold mb-3 text-surface-900-50-token;
  }
  
  :global(.prose p) {
    @apply mb-4 text-surface-700-200-token leading-relaxed;
  }
  
  :global(.prose ul) {
    @apply mb-4 pl-6 space-y-2;
  }
  
  :global(.prose li) {
    @apply text-surface-700-200-token;
  }
  
  :global(.prose strong) {
    @apply font-semibold text-surface-900-50-token;
  }
  
  :global(.prose a) {
    @apply text-primary-600 hover:text-primary-700 underline;
  }
</style>