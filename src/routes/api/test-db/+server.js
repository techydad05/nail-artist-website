import { json } from '@sveltejs/kit';
import { db } from '$lib/db/config.js';
import { adminUsers } from '$lib/db/schema.js';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  try {
    // Test database connection
    const users = await db.select().from(adminUsers).limit(1);
    
    return json({
      success: true,
      message: 'Database connection successful',
      userCount: users.length
    });
  } catch (error) {
    console.error('Database test error:', error);
    return json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}