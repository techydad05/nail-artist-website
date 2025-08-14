import { json } from '@sveltejs/kit';
import { seedDatabase } from '$lib/db/seed-data.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		// In a real app, you'd want to check admin authentication here
		const { confirm } = await request.json();
		
		if (!confirm) {
			return json({
				success: false,
				error: 'Confirmation required'
			}, { status: 400 });
		}
		
		console.log('🌱 Admin triggered database seeding...');
		const result = await seedDatabase();
		
		if (result.success) {
			return json({
				success: true,
				message: 'Database seeded successfully',
				data: {
					users: result.users,
					services: result.services,
					appointments: result.appointments,
					designs: result.designs
				}
			});
		} else {
			return json({
				success: false,
				error: result.error
			}, { status: 500 });
		}
		
	} catch (error) {
		console.error('Error in seed endpoint:', error);
		return json({
			success: false,
			error: 'Failed to seed database'
		}, { status: 500 });
	}
}