import { error } from '@sveltejs/kit';
import { db } from '$lib/db/config.js';
import { contentPages, contentSections } from '$lib/db/schema.js';
import { eq } from 'drizzle-orm';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const { slug } = params;
  
  try {
    // Get the page
    const page = await db
      .select()
      .from(contentPages)
      .where(eq(contentPages.slug, slug))
      .limit(1);
    
    if (page.length === 0 || !page[0].isPublished) {
      throw error(404, 'Page not found');
    }
    
    // Get the sections for this page
    const sections = await db
      .select()
      .from(contentSections)
      .where(eq(contentSections.pageSlug, slug))
      .orderBy(contentSections.sortOrder);
    
    return {
      page: page[0],
      sections: sections || []
    };
    
  } catch (err) {
    console.error('Error loading page:', err);
    throw error(404, 'Page not found');
  }
}