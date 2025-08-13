import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  generateTimeSlots,
  isBusinessDay,
  validateBookingDate,
  BUSINESS_CONFIG
} from './availability.js';

describe('generateTimeSlots', () => {
  it('should generate correct time slots for a regular business day', () => {
    const date = '2024-01-15'; // Monday
    const slots = generateTimeSlots(date);
    
    expect(slots).toContain('09:00');
    expect(slots).toContain('10:00');
    expect(slots).toContain('17:00');
    expect(slots).not.toContain('18:00'); // End time should not be included
    expect(slots).not.toContain('08:00'); // Before start time
    
    // Should have 9 slots (09:00 to 17:00)
    expect(slots).toHaveLength(9);
  });

  it('should handle special hours for specific dates', () => {
    // Mock special hours
    const originalSpecialHours = BUSINESS_CONFIG.schedule.specialHours;
    BUSINESS_CONFIG.schedule.specialHours['2024-01-15'] = {
      start: '10:00',
      end: '16:00'
    };
    
    const slots = generateTimeSlots('2024-01-15');
    
    expect(slots).toContain('10:00');
    expect(slots).toContain('15:00');
    expect(slots).not.toContain('09:00');
    expect(slots).not.toContain('16:00');
    expect(slots).toHaveLength(6);
    
    // Restore original config
    BUSINESS_CONFIG.schedule.specialHours = originalSpecialHours;
  });
});

describe('isBusinessDay', () => {
  it('should return false for Sunday (closed day)', () => {
    const sunday = '2024-01-14'; // Sunday
    expect(isBusinessDay(sunday)).toBe(false);
  });

  it('should return true for Monday (business day)', () => {
    const monday = '2024-01-15'; // Monday
    expect(isBusinessDay(monday)).toBe(true);
  });

  it('should return false for holidays', () => {
    const originalHolidays = BUSINESS_CONFIG.schedule.holidays;
    BUSINESS_CONFIG.schedule.holidays.push('2024-01-15');
    
    expect(isBusinessDay('2024-01-15')).toBe(false);
    
    // Restore original config
    BUSINESS_CONFIG.schedule.holidays = originalHolidays;
  });
});

describe('validateBookingDate', () => {
  beforeEach(() => {
    // Mock current date to be consistent
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should reject dates within minimum advance time', () => {
    const result = validateBookingDate('2024-01-15'); // Same day, less than 2 hours
    expect(result.valid).toBe(false);
    expect(result.error).toContain('2 hours');
  });

  it('should reject dates too far in advance', () => {
    const result = validateBookingDate('2024-05-15'); // More than 90 days
    expect(result.valid).toBe(false);
    expect(result.error).toContain('90 days');
  });

  it('should accept valid future dates', () => {
    const result = validateBookingDate('2024-01-17'); // 2 days from now
    expect(result.valid).toBe(true);
  });

  it('should reject invalid date formats', () => {
    const result = validateBookingDate('invalid-date');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid date format');
  });
});