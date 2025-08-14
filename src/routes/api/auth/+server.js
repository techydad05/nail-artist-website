import { json } from '@sveltejs/kit';
import { db } from '$lib/db/index.js';
import { users } from '$lib/db/schema.js';
import { eq } from 'drizzle-orm';

// Simple email validation
function validateEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {
	try {
		const { email, name, action } = await request.json();
		
		if (!email || !validateEmail(email)) {
			return json({
				success: false,
				error: 'Valid email address is required'
			}, { status: 400 });
		}
		
		if (action === 'login') {
			// Check if user exists
			const existingUser = await db
				.select()
				.from(users)
				.where(eq(users.email, email.toLowerCase().trim()))
				.limit(1);
			
			if (existingUser.length === 0) {
				return json({
					success: false,
					error: 'User not found. Please sign up first.'
				}, { status: 404 });
			}
			
			const user = existingUser[0];
			
			// Update last login
			await db
				.update(users)
				.set({ lastLogin: new Date().toISOString() })
				.where(eq(users.id, user.id));
			
			// Set session cookie
			cookies.set('user_session', JSON.stringify({
				id: user.id,
				email: user.email,
				name: user.name
			}), {
				path: '/',
				maxAge: 60 * 60 * 24 * 30, // 30 days
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict'
			});
			
			return json({
				success: true,
				user: {
					id: user.id,
					email: user.email,
					name: user.name
				}
			});
			
		} else if (action === 'signup') {
			if (!name || name.trim().length < 2) {
				return json({
					success: false,
					error: 'Name is required and must be at least 2 characters'
				}, { status: 400 });
			}
			
			// Check if user already exists
			const existingUser = await db
				.select()
				.from(users)
				.where(eq(users.email, email.toLowerCase().trim()))
				.limit(1);
			
			if (existingUser.length > 0) {
				return json({
					success: false,
					error: 'User already exists. Please login instead.'
				}, { status: 409 });
			}
			
			// Create new user
			const newUser = await db
				.insert(users)
				.values({
					email: email.toLowerCase().trim(),
					name: name.trim(),
					lastLogin: new Date().toISOString()
				})
				.returning();
			
			const user = newUser[0];
			
			// Set session cookie
			cookies.set('user_session', JSON.stringify({
				id: user.id,
				email: user.email,
				name: user.name
			}), {
				path: '/',
				maxAge: 60 * 60 * 24 * 30, // 30 days
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict'
			});
			
			return json({
				success: true,
				user: {
					id: user.id,
					email: user.email,
					name: user.name
				}
			});
		}
		
		return json({
			success: false,
			error: 'Invalid action'
		}, { status: 400 });
		
	} catch (error) {
		console.error('Auth error:', error);
		return json({
			success: false,
			error: 'Authentication failed'
		}, { status: 500 });
	}
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies }) {
	try {
		const sessionCookie = cookies.get('user_session');
		
		if (!sessionCookie) {
			return json({
				success: false,
				user: null
			});
		}
		
		const session = JSON.parse(sessionCookie);
		
		// Verify user still exists
		const user = await db
			.select()
			.from(users)
			.where(eq(users.id, session.id))
			.limit(1);
		
		if (user.length === 0) {
			// Clear invalid session
			cookies.delete('user_session', { path: '/' });
			return json({
				success: false,
				user: null
			});
		}
		
		return json({
			success: true,
			user: {
				id: user[0].id,
				email: user[0].email,
				name: user[0].name
			}
		});
		
	} catch (error) {
		console.error('Session check error:', error);
		return json({
			success: false,
			user: null
		});
	}
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ cookies }) {
	try {
		cookies.delete('user_session', { path: '/' });
		
		return json({
			success: true,
			message: 'Logged out successfully'
		});
		
	} catch (error) {
		console.error('Logout error:', error);
		return json({
			success: false,
			error: 'Logout failed'
		}, { status: 500 });
	}
}