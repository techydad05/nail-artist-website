import { json } from '@sveltejs/kit';
import { getAllServices } from '$lib/db.js';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	try {
		const services = getAllServices();
		return json({ success: true, services });
	} catch (error) {
		console.error('Error fetching services:', error);
		return json({ success: false, error: error.message }, { status: 500 });
	}
}
