import { redirect } from '@sveltejs/kit';
import { verifyToken } from '$lib/auth.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
  try {
    // Check authentication
    const token = cookies.get('admin_token');
    
    if (!token) {
      throw redirect(302, '/admin/login');
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      // Invalid token, clear it and redirect
      cookies.delete('admin_token', { path: '/' });
      throw redirect(302, '/admin/login');
    }
    
    return {
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      }
    };
  } catch (error) {
    if (error.status === 302) {
      throw error; // Re-throw redirect
    }
    
    console.error('Dashboard load error:', error);
    throw redirect(302, '/admin/login');
  }
}