import { json } from '@sveltejs/kit';
import { db } from '$lib/db/index.js';
import { savedDesigns, users } from '$lib/db/schema.js';
import { eq, and, desc } from 'drizzle-orm';

// Get user from session
function getUserFromSession(cookies) {
	try {
		const sessionCookie = cookies.get('user_session');
		if (!sessionCookie) return null;
		return JSON.parse(sessionCookie);
	} catch (error) {
		return null;
	}
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies }) {
	try {
		const user = getUserFromSession(cookies);
		const designId = url.searchParams.get('id');
		const userId = url.searchParams.get('userId');
		
		if (designId) {
			// Get specific design
			const design = await db
				.select()
				.from(savedDesigns)
				.where(eq(savedDesigns.id, parseInt(designId)))
				.limit(1);
			
			if (design.length === 0) {
				return json({
					success: false,
					error: 'Design not found'
				}, { status: 404 });
			}
			
			const designData = design[0];
			
			// Check if user can access this design
			if (!designData.isPublic && (!user || user.id !== designData.userId)) {
				return json({
					success: false,
					error: 'Access denied'
				}, { status: 403 });
			}
			
			return json({
				success: true,
				design: {
					id: designData.id,
					name: designData.designName,
					data: JSON.parse(designData.designData),
					isPublic: designData.isPublic,
					createdAt: designData.createdAt,
					userId: designData.userId
				}
			});
		}
		
		if (userId || user) {
			// Get designs for specific user
			const targetUserId = userId ? parseInt(userId) : user.id;
			let query = db
				.select()
				.from(savedDesigns)
				.orderBy(desc(savedDesigns.updatedAt));
			
			if (user && user.id === targetUserId) {
				// User's own designs (including private)
				query = query.where(eq(savedDesigns.userId, targetUserId));
			} else {
				// Public designs only
				query = query.where(
					and(
						eq(savedDesigns.userId, targetUserId),
						eq(savedDesigns.isPublic, true)
					)
				);
			}
			
			const designs = await query;
			
			return json({
				success: true,
				designs: designs.map(design => ({
					id: design.id,
					name: design.designName,
					data: JSON.parse(design.designData),
					isPublic: design.isPublic,
					createdAt: design.createdAt,
					updatedAt: design.updatedAt,
					userId: design.userId
				}))
			});
		}
		
		// Get public designs
		const publicDesigns = await db
			.select()
			.from(savedDesigns)
			.where(eq(savedDesigns.isPublic, true))
			.orderBy(desc(savedDesigns.updatedAt))
			.limit(20);
		
		return json({
			success: true,
			designs: publicDesigns.map(design => ({
				id: design.id,
				name: design.designName,
				data: JSON.parse(design.designData),
				isPublic: design.isPublic,
				createdAt: design.createdAt,
				userId: design.userId
			}))
		});
		
	} catch (error) {
		console.error('Error fetching designs:', error);
		return json({
			success: false,
			error: 'Failed to fetch designs'
		}, { status: 500 });
	}
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {
	try {
		const user = getUserFromSession(cookies);
		
		if (!user) {
			return json({
				success: false,
				error: 'Authentication required'
			}, { status: 401 });
		}
		
		const { designName, designData, isPublic = false } = await request.json();
		
		if (!designName || !designData) {
			return json({
				success: false,
				error: 'Design name and data are required'
			}, { status: 400 });
		}
		
		if (designName.length < 3 || designName.length > 50) {
			return json({
				success: false,
				error: 'Design name must be between 3 and 50 characters'
			}, { status: 400 });
		}
		
		// Save design
		const newDesign = await db
			.insert(savedDesigns)
			.values({
				userId: user.id,
				designName: designName.trim(),
				designData: JSON.stringify(designData),
				isPublic: Boolean(isPublic),
				updatedAt: new Date().toISOString()
			})
			.returning();
		
		return json({
			success: true,
			design: {
				id: newDesign[0].id,
				name: newDesign[0].designName,
				data: JSON.parse(newDesign[0].designData),
				isPublic: newDesign[0].isPublic,
				createdAt: newDesign[0].createdAt,
				userId: newDesign[0].userId
			}
		});
		
	} catch (error) {
		console.error('Error saving design:', error);
		return json({
			success: false,
			error: 'Failed to save design'
		}, { status: 500 });
	}
}

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, cookies }) {
	try {
		const user = getUserFromSession(cookies);
		
		if (!user) {
			return json({
				success: false,
				error: 'Authentication required'
			}, { status: 401 });
		}
		
		const { id, designName, designData, isPublic } = await request.json();
		
		if (!id) {
			return json({
				success: false,
				error: 'Design ID is required'
			}, { status: 400 });
		}
		
		// Check if design exists and belongs to user
		const existingDesign = await db
			.select()
			.from(savedDesigns)
			.where(
				and(
					eq(savedDesigns.id, id),
					eq(savedDesigns.userId, user.id)
				)
			)
			.limit(1);
		
		if (existingDesign.length === 0) {
			return json({
				success: false,
				error: 'Design not found or access denied'
			}, { status: 404 });
		}
		
		// Update design
		const updateData = {
			updatedAt: new Date().toISOString()
		};
		
		if (designName !== undefined) {
			if (designName.length < 3 || designName.length > 50) {
				return json({
					success: false,
					error: 'Design name must be between 3 and 50 characters'
				}, { status: 400 });
			}
			updateData.designName = designName.trim();
		}
		
		if (designData !== undefined) {
			updateData.designData = JSON.stringify(designData);
		}
		
		if (isPublic !== undefined) {
			updateData.isPublic = Boolean(isPublic);
		}
		
		const updatedDesign = await db
			.update(savedDesigns)
			.set(updateData)
			.where(eq(savedDesigns.id, id))
			.returning();
		
		return json({
			success: true,
			design: {
				id: updatedDesign[0].id,
				name: updatedDesign[0].designName,
				data: JSON.parse(updatedDesign[0].designData),
				isPublic: updatedDesign[0].isPublic,
				createdAt: updatedDesign[0].createdAt,
				updatedAt: updatedDesign[0].updatedAt,
				userId: updatedDesign[0].userId
			}
		});
		
	} catch (error) {
		console.error('Error updating design:', error);
		return json({
			success: false,
			error: 'Failed to update design'
		}, { status: 500 });
	}
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ url, cookies }) {
	try {
		const user = getUserFromSession(cookies);
		
		if (!user) {
			return json({
				success: false,
				error: 'Authentication required'
			}, { status: 401 });
		}
		
		const id = url.searchParams.get('id');
		
		if (!id) {
			return json({
				success: false,
				error: 'Design ID is required'
			}, { status: 400 });
		}
		
		// Check if design exists and belongs to user
		const existingDesign = await db
			.select()
			.from(savedDesigns)
			.where(
				and(
					eq(savedDesigns.id, parseInt(id)),
					eq(savedDesigns.userId, user.id)
				)
			)
			.limit(1);
		
		if (existingDesign.length === 0) {
			return json({
				success: false,
				error: 'Design not found or access denied'
			}, { status: 404 });
		}
		
		// Delete design
		await db
			.delete(savedDesigns)
			.where(eq(savedDesigns.id, parseInt(id)));
		
		return json({
			success: true,
			message: 'Design deleted successfully'
		});
		
	} catch (error) {
		console.error('Error deleting design:', error);
		return json({
			success: false,
			error: 'Failed to delete design'
		}, { status: 500 });
	}
}