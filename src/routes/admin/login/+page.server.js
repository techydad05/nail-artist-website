import { redirect } from '@sveltejs/kit';
import { verifyToken } from '$lib/auth.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
  try {
    // Check if user is already logged in
    const token = cookies.get('admin_token');
    
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        // User is already logged in, redirect to dashboard
        throw redirect(302, '/admin/dashboard');
      }
    }
    
    return {};
  } catch (error) {
    if (error.status === 302) {
      throw error; // Re-throw redirect
    }
    
    console.error('Login page load error:', error);
    return {};
  }
}