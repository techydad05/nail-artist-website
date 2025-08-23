import { json } from '@sveltejs/kit';
import { db } from '$lib/db/config.js';
import { galleryImages } from '$lib/db/schema.js';
import { eq, desc } from 'drizzle-orm';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  try {
    const category = url.searchParams.get('category');
    const activeOnly = url.searchParams.get('active') === 'true';
    
    let query = db.select().from(galleryImages);
    
    if (category && category !== 'all') {
      query = query.where(eq(galleryImages.category, category));
    }
    
    if (activeOnly) {
      query = query.where(eq(galleryImages.isActive, true));
    }
    
    query = query.orderBy(desc(galleryImages.sortOrder), desc(galleryImages.createdAt));
    
    const images = await query;
    
    return json({
      success: true,
      images
    });
    
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return json({
      success: false,
      error: 'Failed to fetch gallery images'
    }, { status: 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  try {
    const { filename, originalName, category, description, sortOrder } = await request.json();
    
    if (!filename || !originalName || !category) {
      return json({
        success: false,
        error: 'Filename, original name, and category are required'
      }, { status: 400 });
    }
    
    const newImage = await db
      .insert(galleryImages)
      .values({
        filename,
        originalName,
        category,
        description: description || null,
        sortOrder: sortOrder || 0,
        isActive: true
      })
      .returning();
    
    return json({
      success: true,
      image: newImage[0]
    });
    
  } catch (error) {
    console.error('Error creating gallery image:', error);
    return json({
      success: false,
      error: 'Failed to create gallery image'
    }, { status: 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function PATCH({ request }) {
  try {
    const { id, isActive, category, description, sortOrder } = await request.json();
    
    if (!id) {
      return json({
        success: false,
        error: 'Image ID is required'
      }, { status: 400 });
    }
    
    const updateData = {};
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (category) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (typeof sortOrder === 'number') updateData.sortOrder = sortOrder;
    
    const updatedImage = await db
      .update(galleryImages)
      .set(updateData)
      .where(eq(galleryImages.id, id))
      .returning();
    
    if (updatedImage.length === 0) {
      return json({
        success: false,
        error: 'Image not found'
      }, { status: 404 });
    }
    
    return json({
      success: true,
      image: updatedImage[0]
    });
    
  } catch (error) {
    console.error('Error updating gallery image:', error);
    return json({
      success: false,
      error: 'Failed to update gallery image'
    }, { status: 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ url }) {
  try {
    const id = url.searchParams.get('id');
    
    if (!id) {
      return json({
        success: false,
        error: 'Image ID is required'
      }, { status: 400 });
    }
    
    const deletedImage = await db
      .delete(galleryImages)
      .where(eq(galleryImages.id, parseInt(id)))
      .returning();
    
    if (deletedImage.length === 0) {
      return json({
        success: false,
        error: 'Image not found'
      }, { status: 404 });
    }
    
    return json({
      success: true,
      message: 'Image deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return json({
      success: false,
      error: 'Failed to delete gallery image'
    }, { status: 500 });
  }
}