import { db } from './config.js';
import { appointments } from './schema.js';
import { eq, and, or, gte, lte, ne } from 'drizzle-orm';

// Business configuration
export const BUSINESS_CONFIG = {
  hours: {
    start: '09:00',
    end: '18:00',
    slotDuration: 60, // minutes
    bufferTime: 15, // minutes between appointments
  },
  schedule: {
    closedDays: [0], // Sunday = 0, Monday = 1, etc.
    holidays: [], // Array of YYYY-MM-DD strings
    specialHours: {}, // { 'YYYY-MM-DD': { start: '10:00', end: '16:00' } }
  },
  booking: {
    maxAdvanceDays: 90,
    minAdvanceHours: 2,
  }
};

/**
 * Generate all possible time slots for a given date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {string[]} Array of time strings in HH:MM format
 */
export function generateTimeSlots(date) {
  const slots = [];
  
  // Check for special hours for this date
  const specialHours = BUSINESS_CONFIG.schedule.specialHours[date];
  const startTime = specialHours?.start || BUSINESS_CONFIG.hours.start;
  const endTime = specialHours?.end || BUSINESS_CONFIG.hours.end;
  const duration = BUSINESS_CONFIG.hours.slotDuration;
  
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  
  for (let minutes = startMinutes; minutes < endMinutes; minutes += duration) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    slots.push(timeString);
  }
  
  return slots;
}

/**
 * Check if a date is a business day
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {boolean}
 */
export function isBusinessDay(date) {
  // Check if it's a closed day of the week
  const [year, month, day] = date.split('-').map(Number);
  const localDate = new Date(year, month - 1, day);
  const dayOfWeek = localDate.getDay();
  
  if (BUSINESS_CONFIG.schedule.closedDays.includes(dayOfWeek)) {
    return false;
  }
  
  // Check if it's a holiday
  if (BUSINESS_CONFIG.schedule.holidays.includes(date)) {
    return false;
  }
  
  return true;
}

/**
 * Validate if a date is bookable
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateBookingDate(date) {
  const targetDate = new Date(date);
  const now = new Date();
  
  // Check date format
  if (!(targetDate instanceof Date) || isNaN(targetDate)) {
    return { valid: false, error: 'Invalid date format' };
  }
  
  // Check minimum advance time first (more specific than past date check)
  const minAdvanceTime = new Date(now.getTime() + (BUSINESS_CONFIG.booking.minAdvanceHours * 60 * 60 * 1000));
  if (targetDate < minAdvanceTime) {
    return { valid: false, error: `Appointments must be booked at least ${BUSINESS_CONFIG.booking.minAdvanceHours} hours in advance` };
  }
  
  // Check if date is in the past (this should be covered by the above check, but keeping for safety)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (targetDate < today) {
    return { valid: false, error: 'Cannot book appointments in the past' };
  }
  
  // Check maximum advance time
  const maxAdvanceDate = new Date();
  maxAdvanceDate.setDate(maxAdvanceDate.getDate() + BUSINESS_CONFIG.booking.maxAdvanceDays);
  if (targetDate > maxAdvanceDate) {
    return { valid: false, error: `Cannot book more than ${BUSINESS_CONFIG.booking.maxAdvanceDays} days in advance` };
  }
  
  return { valid: true };
}

/**
 * Check if a specific time slot is available
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} time - Time in HH:MM format
 * @param {number} excludeAppointmentId - Optional appointment ID to exclude from check
 * @returns {Promise<{ available: boolean, reason?: string }>}
 */
export async function checkTimeSlotAvailability(date, time, excludeAppointmentId = null) {
  try {
    // First check if the date is valid for booking
    const dateValidation = validateBookingDate(date);
    if (!dateValidation.valid) {
      return { available: false, reason: dateValidation.error };
    }
    
    // Check if it's a business day
    if (!isBusinessDay(date)) {
      return { available: false, reason: 'Business is closed on this day' };
    }
    
    // Check if time is within business hours
    const availableSlots = generateTimeSlots(date);
    if (!availableSlots.includes(time)) {
      return { available: false, reason: 'Time is outside business hours' };
    }
    
    // Build query to check for existing appointments
    let whereConditions = and(
      eq(appointments.appointmentDate, date),
      eq(appointments.appointmentTime, time),
      or(
        eq(appointments.status, 'pending'),
        eq(appointments.status, 'confirmed')
      )
    );
    
    // Exclude specific appointment if provided (for updates)
    if (excludeAppointmentId) {
      whereConditions = and(
        whereConditions,
        ne(appointments.id, excludeAppointmentId)
      );
    }
    
    const existingAppointments = await db
      .select({ id: appointments.id })
      .from(appointments)
      .where(whereConditions)
      .limit(1);
    
    if (existingAppointments.length > 0) {
      return { available: false, reason: 'Time slot is already booked' };
    }
    
    return { available: true };
    
  } catch (error) {
    console.error('Error checking time slot availability:', error);
    return { available: false, reason: 'Error checking availability' };
  }
}

/**
 * Get all available time slots for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export async function getAvailableSlots(date) {
  try {
    // Validate the date
    const dateValidation = validateBookingDate(date);
    if (!dateValidation.valid) {
      return {
        success: false,
        error: dateValidation.error
      };
    }
    
    // Check if it's a business day
    if (!isBusinessDay(date)) {
      return {
        success: true,
        data: {
          date,
          availableSlots: [],
          totalSlots: 0,
          bookedSlots: 0,
          businessDay: false,
          message: 'Business is closed on this day'
        }
      };
    }
    
    // Generate all possible slots
    const allSlots = generateTimeSlots(date);
    
    // Get existing appointments for this date
    const existingAppointments = await db
      .select({
        appointmentTime: appointments.appointmentTime,
        status: appointments.status
      })
      .from(appointments)
      .where(
        and(
          eq(appointments.appointmentDate, date),
          or(
            eq(appointments.status, 'pending'),
            eq(appointments.status, 'confirmed')
          )
        )
      );
    
    // Filter out booked slots
    const bookedTimes = existingAppointments.map(apt => apt.appointmentTime);
    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));
    
    return {
      success: true,
      data: {
        date,
        availableSlots,
        totalSlots: allSlots.length,
        bookedSlots: bookedTimes.length,
        businessDay: true,
        businessHours: {
          start: BUSINESS_CONFIG.schedule.specialHours[date]?.start || BUSINESS_CONFIG.hours.start,
          end: BUSINESS_CONFIG.schedule.specialHours[date]?.end || BUSINESS_CONFIG.hours.end
        }
      }
    };
    
  } catch (error) {
    console.error('Error getting available slots:', error);
    return {
      success: false,
      error: 'Failed to retrieve available time slots'
    };
  }
}

/**
 * Check for appointment conflicts when booking or updating
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} time - Time in HH:MM format
 * @param {number} duration - Appointment duration in minutes
 * @param {number} excludeAppointmentId - Optional appointment ID to exclude
 * @returns {Promise<{ hasConflict: boolean, conflicts?: object[] }>}
 */
export async function checkAppointmentConflicts(date, time, duration = 60, excludeAppointmentId = null) {
  try {
    // Calculate time range for this appointment
    const [hour, minute] = time.split(':').map(Number);
    const startMinutes = hour * 60 + minute;
    const endMinutes = startMinutes + duration + BUSINESS_CONFIG.hours.bufferTime;
    
    // Convert back to time strings for comparison
    const bufferEndHour = Math.floor(endMinutes / 60);
    const bufferEndMinute = endMinutes % 60;
    const bufferEndTime = `${bufferEndHour.toString().padStart(2, '0')}:${bufferEndMinute.toString().padStart(2, '0')}`;
    
    // Query for overlapping appointments
    let whereConditions = and(
      eq(appointments.appointmentDate, date),
      or(
        eq(appointments.status, 'pending'),
        eq(appointments.status, 'confirmed')
      ),
      or(
        // Appointment starts during our time slot
        and(
          gte(appointments.appointmentTime, time),
          lte(appointments.appointmentTime, bufferEndTime)
        ),
        // Our appointment starts during their time slot (simplified check)
        lte(appointments.appointmentTime, time)
      )
    );
    
    if (excludeAppointmentId) {
      whereConditions = and(
        whereConditions,
        ne(appointments.id, excludeAppointmentId)
      );
    }
    
    const conflictingAppointments = await db
      .select()
      .from(appointments)
      .where(whereConditions);
    
    return {
      hasConflict: conflictingAppointments.length > 0,
      conflicts: conflictingAppointments
    };
    
  } catch (error) {
    console.error('Error checking appointment conflicts:', error);
    return {
      hasConflict: true,
      error: 'Error checking for conflicts'
    };
  }
}

/**
 * Get appointment statistics for a date range
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export async function getAppointmentStats(startDate, endDate) {
  try {
    const appointmentList = await db
      .select()
      .from(appointments)
      .where(
        and(
          gte(appointments.appointmentDate, startDate),
          lte(appointments.appointmentDate, endDate)
        )
      );
    
    const stats = {
      total: appointmentList.length,
      byStatus: {
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0
      },
      byDate: {},
      popularServices: {}
    };
    
    appointmentList.forEach(apt => {
      // Count by status
      stats.byStatus[apt.status] = (stats.byStatus[apt.status] || 0) + 1;
      
      // Count by date
      stats.byDate[apt.appointmentDate] = (stats.byDate[apt.appointmentDate] || 0) + 1;
      
      // Count popular services
      stats.popularServices[apt.service] = (stats.popularServices[apt.service] || 0) + 1;
    });
    
    return {
      success: true,
      data: stats
    };
    
  } catch (error) {
    console.error('Error getting appointment statistics:', error);
    return {
      success: false,
      error: 'Failed to retrieve appointment statistics'
    };
  }
}

/**
 * Update appointment status with validation
 * @param {number} appointmentId - Appointment ID
 * @param {string} newStatus - New status (pending, confirmed, completed, cancelled)
 * @param {string} notes - Optional notes
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export async function updateAppointmentStatus(appointmentId, newStatus, notes = null) {
  try {
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(newStatus)) {
      return {
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      };
    }
    
    // Check if appointment exists
    const existingAppointment = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, appointmentId))
      .limit(1);
    
    if (existingAppointment.length === 0) {
      return {
        success: false,
        error: 'Appointment not found'
      };
    }
    
    // Validate status transitions
    const currentStatus = existingAppointment[0].status;
    const invalidTransitions = {
      'completed': ['pending', 'confirmed'],
      'cancelled': ['pending', 'confirmed', 'completed']
    };
    
    if (invalidTransitions[currentStatus]?.includes(newStatus)) {
      return {
        success: false,
        error: `Cannot change status from ${currentStatus} to ${newStatus}`
      };
    }
    
    // Update the appointment
    const updateData = {
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
    
    if (notes !== null) {
      updateData.notes = notes;
    }
    
    const updatedAppointment = await db
      .update(appointments)
      .set(updateData)
      .where(eq(appointments.id, appointmentId))
      .returning();
    
    return {
      success: true,
      data: updatedAppointment[0]
    };
    
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return {
      success: false,
      error: 'Failed to update appointment status'
    };
  }
}