import { json } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { db } from '$lib/db/config.js';
import { galleryImages } from '$lib/db/schema.js';

const UPLOAD_DIR = 'static/gallery';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images');
    
    if (!files || files.length === 0) {
      return json({
        success: false,
        error: 'No files provided'
      }, { status: 400 });
    }
    
    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }
    
    const uploadedImages = [];
    const errors = [];
    
    for (const file of files) {
      try {
        // Validate file
        if (!file || file.size === 0) {
          errors.push(`Invalid file: ${file?.name || 'unknown'}`);
          continue;
        }
        
        if (file.size > MAX_FILE_SIZE) {
          errors.push(`File too large: ${file.name} (max 5MB)`);
          continue;
        }
        
        if (!ALLOWED_TYPES.includes(file.type)) {
          errors.push(`Invalid file type: ${file.name} (allowed: JPG, PNG, WebP)`);
          continue;
        }
        
        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const extension = path.extname(file.name);
        const filename = `${timestamp}-${randomString}${extension}`;
        const filepath = path.join(UPLOAD_DIR, filename);
        
        // Save file
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filepath, buffer);
        
        // Determine category based on filename or default
        const originalName = file.name.toLowerCase();
        let category = 'nail-art'; // default
        
        if (originalName.includes('gel')) category = 'gel-nails';
        else if (originalName.includes('manicure')) category = 'manicure';
        else if (originalName.includes('pedicure')) category = 'pedicure';
        else if (originalName.includes('wedding') || originalName.includes('bridal')) category = 'special-occasion';
        
        // Save to database
        const newImage = await db
          .insert(galleryImages)
          .values({
            filename,
            originalName: file.name,
            category,
            description: `Uploaded image: ${file.name}`,
            isActive: true,
            sortOrder: 0
          })
          .returning();
        
        uploadedImages.push(newImage[0]);
        
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        errors.push(`Failed to upload: ${file.name}`);
      }
    }
    
    if (uploadedImages.length === 0) {
      return json({
        success: false,
        error: 'No files were uploaded successfully',
        details: errors
      }, { status: 400 });
    }
    
    return json({
      success: true,
      images: uploadedImages,
      uploaded: uploadedImages.length,
      errors: errors.length > 0 ? errors : undefined
    });
    
  } catch (error) {
    console.error('Error in upload handler:', error);
    return json({
      success: false,
      error: 'Upload failed'
    }, { status: 500 });
  }
}