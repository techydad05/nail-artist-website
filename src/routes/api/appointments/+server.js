import { json } from '@sveltejs/kit';
import { db } from '$lib/db/config.js';
import { appointments } from '$lib/db/schema.js';
import { eq, and } from 'drizzle-orm';
import { 
	checkTimeSlotAvailability, 
	updateAppointmentStatus,
	checkAppointmentConflicts 
} from '$lib/db/availability.js';

// Validation functions
function validateEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

function validatePhone(phone) {
	// Allow various phone formats
	const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
	const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
	return phoneRegex.test(cleanPhone);
}

function validateDate(dateString) {
	const date = new Date(dateString);
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return date instanceof Date && !isNaN(date) && date >= today;
}

function validateTime(timeString) {
	const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
	return timeRegex.test(timeString);
}

function validateAppointmentData(data) {
	const errors = [];

	if (!data.customerName || data.customerName.trim().length < 2) {
		errors.push('Customer name is required and must be at least 2 characters');
	}

	if (!data.customerEmail || !validateEmail(data.customerEmail.trim())) {
		errors.push('Valid email address is required');
	}

	if (!data.customerPhone || !validatePhone(data.customerPhone.trim())) {
		errors.push('Valid phone number is required');
	}

	if (!data.service || data.service.trim().length === 0) {
		errors.push('Service selection is required');
	}

	if (!data.appointmentDate || !validateDate(data.appointmentDate)) {
		errors.push('Valid future date is required');
	}

	if (!data.appointmentTime || !validateTime(data.appointmentTime)) {
		errors.push('Valid time is required (HH:MM format)');
	}

	return errors;
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	try {
		const date = url.searchParams.get('date');
		const status = url.searchParams.get('status');
		
		let query = db.select().from(appointments);
		
		if (date) {
			query = query.where(eq(appointments.appointmentDate, date));
		}
		
		if (status) {
			const statusCondition = eq(appointments.status, status);
			query = date 
				? query.where(and(eq(appointments.appointmentDate, date), statusCondition))
				: query.where(statusCondition);
		}
		
		const appointmentList = await query;
		
		return json({ 
			success: true, 
			appointments: appointmentList 
		});
		
	} catch (error) {
		console.error('Error fetching appointments:', error);
		return json({ 
			success: false, 
			error: {
				code: 'FETCH_ERROR',
				message: 'Failed to fetch appointments',
				details: error.message
			}
		}, { status: 500 });
	}
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const appointmentData = await request.json();
		
		// Validate appointment data
		const validationErrors = validateAppointmentData(appointmentData);
		if (validationErrors.length > 0) {
			return json({
				success: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: 'Invalid appointment data',
					details: validationErrors
				}
			}, { status: 400 });
		}

		// Check availability using enhanced logic
		const availabilityCheck = await checkTimeSlotAvailability(
			appointmentData.appointmentDate, 
			appointmentData.appointmentTime
		);

		if (!availabilityCheck.available) {
			return json({
				success: false,
				error: {
					code: 'TIME_SLOT_UNAVAILABLE',
					message: availabilityCheck.reason || 'This time slot is not available',
					details: 'Please select a different time'
				}
			}, { status: 409 });
		}

		// Additional conflict check for appointment duration
		const conflictCheck = await checkAppointmentConflicts(
			appointmentData.appointmentDate,
			appointmentData.appointmentTime,
			60 // Default 60 minute duration
		);

		if (conflictCheck.hasConflict) {
			return json({
				success: false,
				error: {
					code: 'APPOINTMENT_CONFLICT',
					message: 'This appointment would conflict with existing bookings',
					details: 'Please select a different time to avoid scheduling conflicts'
				}
			}, { status: 409 });
		}

		// Create new appointment
		const newAppointment = await db
			.insert(appointments)
			.values({
				customerName: appointmentData.customerName.trim(),
				customerEmail: appointmentData.customerEmail.toLowerCase().trim(),
				customerPhone: appointmentData.customerPhone.trim(),
				service: appointmentData.service.trim(),
				appointmentDate: appointmentData.appointmentDate,
				appointmentTime: appointmentData.appointmentTime,
				notes: appointmentData.notes?.trim() || null,
				designReference: appointmentData.designReference || null,
				status: 'pending'
			})
			.returning();

		return json({
			success: true,
			appointment: newAppointment[0],
			message: 'Appointment booked successfully!'
		}, { status: 201 });
		
	} catch (error) {
		console.error('Error booking appointment:', error);
		return json({
			success: false,
			error: {
				code: 'BOOKING_ERROR',
				message: 'Failed to book appointment',
				details: error.message
			}
		}, { status: 500 });
	}
}

/** @type {import('./$types').RequestHandler} */
export async function PATCH({ request }) {
	try {
		const { id, status, notes } = await request.json();
		
		if (!id) {
			return json({
				success: false,
				error: {
					code: 'MISSING_ID',
					message: 'Appointment ID is required',
					details: 'Please provide a valid appointment ID'
				}
			}, { status: 400 });
		}
		
		if (!status) {
			return json({
				success: false,
				error: {
					code: 'MISSING_STATUS',
					message: 'Status is required',
					details: 'Please provide a valid status'
				}
			}, { status: 400 });
		}
		
		// Validate status values
		const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
		if (!validStatuses.includes(status)) {
			return json({
				success: false,
				error: {
					code: 'INVALID_STATUS',
					message: 'Invalid status value',
					details: `Status must be one of: ${validStatuses.join(', ')}`
				}
			}, { status: 400 });
		}
		
		// Check if appointment exists
		const existingAppointment = await db
			.select()
			.from(appointments)
			.where(eq(appointments.id, id))
			.limit(1);
			
		if (existingAppointment.length === 0) {
			return json({
				success: false,
				error: {
					code: 'APPOINTMENT_NOT_FOUND',
					message: 'Appointment not found',
					details: 'No appointment found with the provided ID'
				}
			}, { status: 404 });
		}
		
		// Use enhanced status update logic
		const updateResult = await updateAppointmentStatus(id, status, notes);
		
		if (!updateResult.success) {
			return json({
				success: false,
				error: {
					code: 'UPDATE_FAILED',
					message: updateResult.error,
					details: 'Please check the appointment status and try again'
				}
			}, { status: 400 });
		}
			
		return json({
			success: true,
			appointment: updateResult.data,
			message: `Appointment ${status} successfully`
		});
		
	} catch (error) {
		console.error('Error updating appointment:', error);
		return json({
			success: false,
			error: {
				code: 'UPDATE_ERROR',
				message: 'Failed to update appointment',
				details: error.message
			}
		}, { status: 500 });
	}
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ url }) {
	try {
		const id = url.searchParams.get('id');
		
		if (!id) {
			return json({
				success: false,
				error: {
					code: 'MISSING_ID',
					message: 'Appointment ID is required',
					details: 'Please provide a valid appointment ID'
				}
			}, { status: 400 });
		}
		
		// Check if appointment exists
		const existingAppointment = await db
			.select()
			.from(appointments)
			.where(eq(appointments.id, id))
			.limit(1);
			
		if (existingAppointment.length === 0) {
			return json({
				success: false,
				error: {
					code: 'APPOINTMENT_NOT_FOUND',
					message: 'Appointment not found',
					details: 'No appointment found with the provided ID'
				}
			}, { status: 404 });
		}
		
		// Instead of hard delete, mark as cancelled
		const cancelledAppointment = await db
			.update(appointments)
			.set({ 
				status: 'cancelled',
				updatedAt: new Date().toISOString()
			})
			.where(eq(appointments.id, id))
			.returning();
			
		return json({
			success: true,
			appointment: cancelledAppointment[0],
			message: 'Appointment cancelled successfully'
		});
		
	} catch (error) {
		console.error('Error cancelling appointment:', error);
		return json({
			success: false,
			error: {
				code: 'CANCEL_ERROR',
				message: 'Failed to cancel appointment',
				details: error.message
			}
		}, { status: 500 });
	}
}
