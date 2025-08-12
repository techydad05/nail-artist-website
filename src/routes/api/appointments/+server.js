import { json } from '@sveltejs/kit';
import { getAllAppointments, getBookedSlots, bookAppointment, getAllServices } from '$lib/db.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	try {
		const date = url.searchParams.get('date');
		
		if (date) {
			// Get booked slots for a specific date
			const bookedSlots = getBookedSlots(date);
			return json({ success: true, bookedSlots });
		} else {
			// Get all appointments
			const appointments = getAllAppointments();
			return json({ success: true, appointments });
		}
	} catch (error) {
		console.error('Error fetching appointments:', error);
		return json({ success: false, error: error.message }, { status: 500 });
	}
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const appointmentData = await request.json();
		
		// Validate required fields
		const { customerName, customerEmail, serviceId, date, time } = appointmentData;
		if (!customerName || !customerEmail || !serviceId || !date || !time) {
			return json({ 
				success: false, 
				error: 'Missing required fields' 
			}, { status: 400 });
		}
		
		// Book the appointment
		const result = bookAppointment(appointmentData);
		
		return json({ 
			success: true, 
			appointmentId: result.id,
			message: result.message 
		});
		
	} catch (error) {
		console.error('Error booking appointment:', error);
		return json({ 
			success: false, 
			error: error.message 
		}, { status: 500 });
	}
}
