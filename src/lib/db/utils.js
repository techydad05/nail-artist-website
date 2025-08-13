import { db } from './config.js';
import { appointments, galleryImages, services, contactMessages, adminUsers } from './schema.js';
import { eq, and, gte, lte, desc } from 'drizzle-orm';

// Appointment utilities
export const appointmentUtils = {
  // Create a new appointment
  async create(appointmentData) {
    try {
      const result = await db.insert(appointments).values({
        ...appointmentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }).returning();
      return { success: true, data: result[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Check availability for a specific date and time
  async checkAvailability(date, time, excludeAppointmentId = null) {
    try {
      // Import availability function dynamically to avoid circular imports
      const { checkTimeSlotAvailability } = await import('./availability.js');
      const result = await checkTimeSlotAvailability(date, time, excludeAppointmentId);
      return { 
        success: true, 
        available: result.available,
        reason: result.reason 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get appointments by date range
  async getByDateRange(startDate, endDate) {
    try {
      const result = await db.select()
        .from(appointments)
        .where(
          and(
            gte(appointments.appointmentDate, startDate),
            lte(appointments.appointmentDate, endDate)
          )
        )
        .orderBy(appointments.appointmentDate, appointments.appointmentTime);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update appointment status
  async updateStatus(id, status, notes = null) {
    try {
      // Import availability function dynamically to avoid circular imports
      const { updateAppointmentStatus } = await import('./availability.js');
      return await updateAppointmentStatus(id, status, notes);
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Gallery utilities
export const galleryUtils = {
  // Add new image
  async addImage(imageData) {
    try {
      const result = await db.insert(galleryImages).values({
        ...imageData,
        createdAt: new Date().toISOString()
      }).returning();
      return { success: true, data: result[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get images by category
  async getByCategory(category) {
    try {
      const result = await db.select()
        .from(galleryImages)
        .where(
          and(
            eq(galleryImages.category, category),
            eq(galleryImages.isActive, true)
          )
        )
        .orderBy(galleryImages.sortOrder, desc(galleryImages.createdAt));
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all active images
  async getAllActive() {
    try {
      const result = await db.select()
        .from(galleryImages)
        .where(eq(galleryImages.isActive, true))
        .orderBy(galleryImages.category, galleryImages.sortOrder);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Service utilities
export const serviceUtils = {
  // Get all active services
  async getAllActive() {
    try {
      const result = await db.select()
        .from(services)
        .where(eq(services.isActive, true))
        .orderBy(services.category, services.sortOrder);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create new service
  async create(serviceData) {
    try {
      const result = await db.insert(services).values({
        ...serviceData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }).returning();
      return { success: true, data: result[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update service
  async update(id, serviceData) {
    try {
      const result = await db.update(services)
        .set({
          ...serviceData,
          updatedAt: new Date().toISOString()
        })
        .where(eq(services.id, id))
        .returning();
      return { success: true, data: result[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Contact message utilities
export const contactUtils = {
  // Create new contact message
  async create(messageData) {
    try {
      const result = await db.insert(contactMessages).values({
        ...messageData,
        createdAt: new Date().toISOString()
      }).returning();
      return { success: true, data: result[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get unread messages
  async getUnread() {
    try {
      const result = await db.select()
        .from(contactMessages)
        .where(eq(contactMessages.status, 'unread'))
        .orderBy(desc(contactMessages.createdAt));
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Mark message as read
  async markAsRead(id) {
    try {
      const result = await db.update(contactMessages)
        .set({ status: 'read' })
        .where(eq(contactMessages.id, id))
        .returning();
      return { success: true, data: result[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};