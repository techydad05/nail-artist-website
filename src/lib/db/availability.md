# Appointment Availability System

This module provides comprehensive appointment availability checking and management functionality for the nail studio booking system.

## Features

### ✅ Time Slot Generation
- Generates available time slots based on business hours
- Supports special hours for specific dates
- Configurable slot duration and buffer times

### ✅ Business Day Validation
- Checks for closed days of the week
- Supports holiday scheduling
- Validates booking date constraints

### ✅ Double-Booking Prevention
- Prevents overlapping appointments
- Checks for conflicts with existing bookings
- Supports appointment exclusion for updates

### ✅ Status Management
- Validates status transitions (pending → confirmed → completed)
- Prevents invalid status changes
- Tracks appointment lifecycle

### ✅ Advanced Availability Logic
- Minimum advance booking time (2 hours)
- Maximum advance booking limit (90 days)
- Buffer time between appointments (15 minutes)
- Business hours enforcement

## Configuration

```javascript
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
```

## Core Functions

### `generateTimeSlots(date)`
Generates all possible time slots for a given date.
- **Input**: Date string in YYYY-MM-DD format
- **Output**: Array of time strings in HH:MM format
- **Features**: Respects special hours for specific dates

### `isBusinessDay(date)`
Checks if a date is a business day.
- **Input**: Date string in YYYY-MM-DD format
- **Output**: Boolean
- **Checks**: Day of week, holidays

### `validateBookingDate(date)`
Validates if a date is bookable.
- **Input**: Date string in YYYY-MM-DD format
- **Output**: `{ valid: boolean, error?: string }`
- **Validates**: Date format, past dates, advance booking limits

### `checkTimeSlotAvailability(date, time, excludeAppointmentId?)`
Checks if a specific time slot is available.
- **Input**: Date, time, optional appointment ID to exclude
- **Output**: `{ available: boolean, reason?: string }`
- **Features**: Comprehensive availability checking

### `getAvailableSlots(date)`
Gets all available time slots for a specific date.
- **Input**: Date string in YYYY-MM-DD format
- **Output**: Promise with availability data
- **Returns**: Available slots, total slots, booked count, business day status

### `checkAppointmentConflicts(date, time, duration, excludeAppointmentId?)`
Checks for appointment conflicts with buffer time.
- **Input**: Date, time, duration in minutes, optional exclusion ID
- **Output**: Promise with conflict information
- **Features**: Buffer time consideration, conflict detection

### `updateAppointmentStatus(appointmentId, newStatus, notes?)`
Updates appointment status with validation.
- **Input**: Appointment ID, new status, optional notes
- **Output**: Promise with update result
- **Validates**: Status transitions, appointment existence

## API Integration

### GET `/api/appointments/availability?date=YYYY-MM-DD`
Returns available time slots for a specific date.

**Response:**
```json
{
  "success": true,
  "date": "2024-01-17",
  "availableSlots": ["09:00", "10:00", "11:00"],
  "totalSlots": 9,
  "bookedSlots": 6,
  "businessDay": true,
  "businessHours": {
    "start": "09:00",
    "end": "18:00"
  }
}
```

### POST `/api/appointments/availability`
Checks availability for a specific date and time.

**Request:**
```json
{
  "date": "2024-01-17",
  "time": "10:00",
  "excludeAppointmentId": 123 // optional
}
```

**Response:**
```json
{
  "success": true,
  "available": true,
  "date": "2024-01-17",
  "time": "10:00",
  "message": "Time slot is available"
}
```

## Status Management

### Valid Status Values
- `pending` - Initial booking status
- `confirmed` - Appointment confirmed by business
- `completed` - Service completed
- `cancelled` - Appointment cancelled

### Status Transitions
- `pending` → `confirmed`, `cancelled`
- `confirmed` → `completed`, `cancelled`
- `completed` → (no transitions allowed)
- `cancelled` → (no transitions allowed)

## Error Handling

### Common Error Codes
- `MISSING_DATE` - Date parameter required
- `INVALID_DATE` - Invalid date format or constraints
- `TIME_SLOT_UNAVAILABLE` - Requested time not available
- `APPOINTMENT_CONFLICT` - Scheduling conflict detected
- `APPOINTMENT_NOT_FOUND` - Appointment doesn't exist
- `INVALID_STATUS` - Invalid status value
- `UPDATE_FAILED` - Status update failed

## Testing

The availability system includes comprehensive tests for:
- Time slot generation
- Business day validation
- Date validation logic
- Configuration handling

Run tests with:
```bash
npm test src/lib/db/availability-simple.test.js
```

## Requirements Fulfilled

This implementation satisfies the following requirements from task 2.2:

✅ **Time slot availability checking algorithm**
- Comprehensive availability checking with business rules
- Support for special hours and holidays
- Buffer time between appointments

✅ **Double-booking prevention logic**
- Prevents overlapping appointments
- Checks for conflicts with existing bookings
- Supports appointment updates without self-conflict

✅ **Appointment status management**
- Four status levels: pending, confirmed, completed, cancelled
- Validates status transitions
- Prevents invalid status changes

✅ **Tests for availability checking and conflict prevention**
- Unit tests for core functions
- Validation of business logic
- Error handling verification

The system provides a robust foundation for appointment booking with comprehensive availability checking and conflict prevention.