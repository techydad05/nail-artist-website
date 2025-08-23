import { json } from '@sveltejs/kit';
import { authenticateAdmin, generateToken, verifyToken } from '$lib/auth.js';
import { initializeDatabase } from '$lib/db/index.js';

// Initialize database on first load
try {
  initializeDatabase();
} catch (error) {
  console.error('Database initialization error:', error);
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {
  try {
    const { email, password, action } = await request.json();
    
    if (action === 'login') {
      if (!email || !password) {
        return json({
          success: false,
          error: 'Email and password are required'
        }, { status: 400 });
      }
      
      const user = await authenticateAdmin(email, password);
      
      if (!user) {
        return json({
          success: false,
          error: 'Invalid email or password'
        }, { status: 401 });
      }
      
      const token = generateToken(user);
      
      // Set secure HTTP-only cookie
      cookies.set('admin_token', token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      return json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
    }
    
    return json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });
    
  } catch (error) {
    console.error('Admin auth error:', error);
    return json({
      success: false,
      error: 'Authentication failed'
    }, { status: 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies }) {
  try {
    const token = cookies.get('admin_token');
    
    if (!token) {
      return json({
        success: false,
        user: null
      });
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      cookies.delete('admin_token', { path: '/' });
      return json({
        success: false,
        user: null
      });
    }
    
    return json({
      success: true,
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      }
    });
    
  } catch (error) {
    console.error('Admin session check error:', error);
    return json({
      success: false,
      user: null
    });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ cookies }) {
  try {
    cookies.delete('admin_token', { path: '/' });
    
    return json({
      success: true,
      message: 'Logged out successfully'
    });
    
  } catch (error) {
    console.error('Admin logout error:', error);
    return json({
      success: false,
      error: 'Logout failed'
    }, { status: 500 });
  }
}