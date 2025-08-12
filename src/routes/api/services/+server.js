import { json } from '@sveltejs/kit';

// Mock services data (in production, this would be replaced with a proper database)
const mockServices = [
	{
		id: 'gel-nails',
		name: 'Gel Nails',
		description: 'Long-lasting, vibrant gel manicures with premium quality polish.',
		duration: 60,
		price: 45
	},
	{
		id: 'acrylic-extensions',
		name: 'Acrylic Extensions',
		description: 'Beautiful acrylic nails customized to your desired length and style.',
		duration: 90,
		price: 65
	},
	{
		id: 'nail-art',
		name: 'Nail Art',
		description: 'Custom designs, from simple patterns to intricate artwork.',
		duration: 75,
		price: 55
	},
	{
		id: 'spa-treatment',
		name: 'Spa Treatment',
		description: 'Relaxing hand and nail treatments for ultimate pampering.',
		duration: 45,
		price: 35
	},
	{
		id: 'nail-repair',
		name: 'Nail Repair',
		description: 'Expert repair services for damaged or broken nails.',
		duration: 30,
		price: 25
	},
	{
		id: 'luxury-package',
		name: 'Luxury Package',
		description: 'Complete pampering experience with all our premium services.',
		duration: 120,
		price: 95
	}
];

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	try {
		return json({ success: true, services: mockServices });
	} catch (error) {
		console.error('Error fetching services:', error);
		return json({ success: false, error: 'Failed to fetch services' }, { status: 500 });
	}
}
