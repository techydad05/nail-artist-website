import { json } from '@sveltejs/kit';

// Mock data for appointments (in production, this would be replaced with a proper database)
let mockAppointments = [
	{
		id: 1,
		customer_name: 'Sarah Johnson',
		customer_email: 'sarah@example.com',
		customer_phone: '(555) 123-4567',
		service_id: 'gel-nails',
		appointment_date: '2024-08-15',
		appointment_time: '10:00 AM',
		special_requests: 'French tips please',
		status: 'confirmed',
		created_at: '2024-08-12T10:00:00Z'
	},
	{
		id: 2,
		customer_name: 'Emily Davis',
		customer_email: 'emily@example.com',
		customer_phone: '(555) 987-6543',
		service_id: 'acrylic-extensions',
		appointment_date: '2024-08-16',
		appointment_time: '2:00 PM',
		special_requests: '',
		status: 'confirmed',
		created_at: '2024-08-12T11:00:00Z'
	}
];

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	try {
		const date = url.searchParams.get('date');
		
		if (date) {
			const appointments = mockAppointments.filter(apt => apt.appointment_date === date);
			return json({ success: true, appointments });
		} else {
			// Return all appointments if no date specified
			return json({ success: true, appointments: mockAppointments });
		}
	} catch (error) {
		console.error('Error fetching appointments:', error);
		return json({ success: false, error: 'Failed to fetch appointments' }, { status: 500 });
	}
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const appointmentData = await request.json();
		
		// Create new appointment with mock ID
		const newAppointment = {
			id: mockAppointments.length + 1,
			customer_name: appointmentData.customerName,
			customer_email: appointmentData.customerEmail,
			customer_phone: appointmentData.customerPhone || '',
			service_id: appointmentData.selectedService,
			appointment_date: appointmentData.selectedDate,
			appointment_time: appointmentData.selectedTime,
			special_requests: appointmentData.specialRequests || '',
			status: 'confirmed',
			created_at: new Date().toISOString()
		};
		
		// Add to mock appointments array
		mockAppointments.push(newAppointment);
		
		return json({ 
			success: true, 
			appointment: newAppointment,
			message: 'Appointment booked successfully!' 
		});
		
	} catch (error) {
		console.error('Error booking appointment:', error);
		return json({ 
			success: false, 
			error: error.message 
		}, { status: 500 });
	}
}
