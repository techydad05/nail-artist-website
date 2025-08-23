import { json } from '@sveltejs/kit';
import { db } from '$lib/db/config.js';
import { contentPages, contentSections } from '$lib/db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { verifyToken, requireAdmin } from '$lib/auth.js';

async function getAdminUser(cookies) {
  const token = cookies.get('admin_token');
  if (!token) return null;
  
  const decoded = verifyToken(token);
  return decoded;
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies }) {
  try {
    const user = await getAdminUser(cookies);
    requireAdmin(user);
    
    const pageSlug = url.searchParams.get('page');
    
    if (pageSlug) {
      // Get specific page with sections
      const page = await db
        .select()
        .from(contentPages)
        .where(eq(contentPages.slug, pageSlug))
        .limit(1);
        
      if (page.length === 0) {
        return json({
          success: false,
          error: 'Page not found'
        }, { status: 404 });
      }
      
      const sections = await db
        .select()
        .from(contentSections)
        .where(eq(contentSections.pageSlug, pageSlug))
        .orderBy(contentSections.sortOrder);
      
      return json({
        success: true,
        page: page[0],
        sections
      });
    } else {
      // Get all pages
      const pages = await db
        .select()
        .from(contentPages)
        .orderBy(desc(contentPages.updatedAt));
      
      return json({
        success: true,
        pages
      });
    }
    
  } catch (error) {
    console.error('Content fetch error:', error);
    return json({
      success: false,
      error: error.message || 'Failed to fetch content'
    }, { status: error.message === 'Admin access required' ? 403 : 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {
  try {
    const user = await getAdminUser(cookies);
    requireAdmin(user);
    
    const { action, ...data } = await request.json();
    
    if (action === 'create_page') {
      const { slug, title, content, metaDescription } = data;
      
      if (!slug || !title || !content) {
        return json({
          success: false,
          error: 'Slug, title, and content are required'
        }, { status: 400 });
      }
      
      const newPage = await db
        .insert(contentPages)
        .values({
          slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
          title,
          content,
          metaDescription,
          isPublished: true
        })
        .returning();
      
      return json({
        success: true,
        page: newPage[0]
      });
    }
    
    if (action === 'update_page') {
      const { id, title, content, metaDescription, isPublished } = data;
      
      const updatedPage = await db
        .update(contentPages)
        .set({
          title,
          content,
          metaDescription,
          isPublished,
          updatedAt: new Date().toISOString()
        })
        .where(eq(contentPages.id, id))
        .returning();
      
      return json({
        success: true,
        page: updatedPage[0]
      });
    }
    
    if (action === 'create_section') {
      const { pageSlug, sectionKey, sectionType, title, content, imageUrl, sortOrder } = data;
      
      const newSection = await db
        .insert(contentSections)
        .values({
          pageSlug,
          sectionKey,
          sectionType,
          title,
          content,
          imageUrl,
          sortOrder: sortOrder || 0,
          isActive: true
        })
        .returning();
      
      return json({
        success: true,
        section: newSection[0]
      });
    }
    
    if (action === 'update_section') {
      const { id, title, content, imageUrl, sortOrder, isActive } = data;
      
      const updatedSection = await db
        .update(contentSections)
        .set({
          title,
          content,
          imageUrl,
          sortOrder,
          isActive,
          updatedAt: new Date().toISOString()
        })
        .where(eq(contentSections.id, id))
        .returning();
      
      return json({
        success: true,
        section: updatedSection[0]
      });
    }
    
    return json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });
    
  } catch (error) {
    console.error('Content operation error:', error);
    return json({
      success: false,
      error: error.message || 'Content operation failed'
    }, { status: error.message === 'Admin access required' ? 403 : 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ url, cookies }) {
  try {
    const user = await getAdminUser(cookies);
    requireAdmin(user);
    
    const pageId = url.searchParams.get('pageId');
    const sectionId = url.searchParams.get('sectionId');
    
    if (pageId) {
      await db.delete(contentPages).where(eq(contentPages.id, parseInt(pageId)));
      await db.delete(contentSections).where(eq(contentSections.pageSlug, pageId));
      
      return json({
        success: true,
        message: 'Page deleted successfully'
      });
    }
    
    if (sectionId) {
      await db.delete(contentSections).where(eq(contentSections.id, parseInt(sectionId)));
      
      return json({
        success: true,
        message: 'Section deleted successfully'
      });
    }
    
    return json({
      success: false,
      error: 'Page ID or Section ID required'
    }, { status: 400 });
    
  } catch (error) {
    console.error('Content delete error:', error);
    return json({
      success: false,
      error: error.message || 'Delete operation failed'
    }, { status: error.message === 'Admin access required' ? 403 : 500 });
  }
}