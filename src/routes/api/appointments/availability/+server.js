import { json } from '@sveltejs/kit';
import { 
	getAvailableSlots, 
	checkTimeSlotAvailability,
	validateBookingDate,
	BUSINESS_CONFIG 
} from '$lib/db/availability.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	try {
		const date = url.searchParams.get('date');
		
		if (!date) {
			return json({
				success: false,
				error: {
					code: 'MISSING_DATE',
					message: 'Date parameter is required',
					details: 'Please provide a date in YYYY-MM-DD format'
				}
			}, { status: 400 });
		}
		
		// Use the enhanced availability logic
		const result = await getAvailableSlots(date);
		
		if (!result.success) {
			return json({
				success: false,
				error: {
					code: 'AVAILABILITY_ERROR',
					message: result.error,
					details: 'Please check the date and try again'
				}
			}, { status: 400 });
		}
		
		return json({
			success: true,
			...result.data
		});
		
	} catch (error) {
		console.error('Error checking availability:', error);
		return json({
			success: false,
			error: {
				code: 'AVAILABILITY_ERROR',
				message: 'Failed to check availability',
				details: error.message
			}
		}, { status: 500 });
	}
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { date, time, excludeAppointmentId } = await request.json();
		
		if (!date || !time) {
			return json({
				success: false,
				error: {
					code: 'MISSING_PARAMETERS',
					message: 'Both date and time are required',
					details: 'Please provide both date and time parameters'
				}
			}, { status: 400 });
		}
		
		// Use the enhanced availability checking
		const availabilityResult = await checkTimeSlotAvailability(date, time, excludeAppointmentId);
		
		return json({
			success: true,
			available: availabilityResult.available,
			date,
			time,
			message: availabilityResult.available ? 'Time slot is available' : availabilityResult.reason,
			businessHours: {
				start: BUSINESS_CONFIG.hours.start,
				end: BUSINESS_CONFIG.hours.end
			}
		});
		
	} catch (error) {
		console.error('Error checking specific time availability:', error);
		return json({
			success: false,
			error: {
				code: 'AVAILABILITY_CHECK_ERROR',
				message: 'Failed to check time slot availability',
				details: error.message
			}
		}, { status: 500 });
	}
}