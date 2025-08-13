import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema.js';

// Mock the config to use test database
let testDb;
let testSqlite;

// Import drizzle-orm functions at the top level
import { eq, and, gte, lte, desc } from 'drizzle-orm';

// Mock the utils with test database
const createTestUtils = (db) => {
  const { appointments, galleryImages, services, contactMessages } = schema;

  return {
    appointmentUtils: {
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

      async checkAvailability(date, time) {
        try {
          const existing = await db.select()
            .from(appointments)
            .where(
              and(
                eq(appointments.appointmentDate, date),
                eq(appointments.appointmentTime, time),
                eq(appointments.status, 'confirmed')
              )
            );
          return { success: true, available: existing.length === 0 };
        } catch (error) {
          return { success: false, error: error.message };
        }
      },

      async updateStatus(id, status) {
        try {
          const result = await db.update(appointments)
            .set({ 
              status, 
              updatedAt: new Date().toISOString() 
            })
            .where(eq(appointments.id, id))
            .returning();
          return { success: true, data: result[0] };
        } catch (error) {
          return { success: false, error: error.message };
        }
      }
    },

    serviceUtils: {
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
      }
    },

    contactUtils: {
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
      }
    }
  };
};

describe('Database Utils', () => {
  let utils;

  beforeEach(async () => {
    testSqlite = new Database(':memory:');
    testDb = drizzle(testSqlite, { schema });
    migrate(testDb, { migrationsFolder: 'src/lib/db/migrations' });
    utils = createTestUtils(testDb);
  });

  afterEach(() => {
    if (testSqlite) {
      testSqlite.close();
    }
  });

  describe('Appointment Utils', () => {
    it('should create appointment successfully', async () => {
      const appointmentData = {
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerPhone: '555-5678',
        service: 'Pedicure',
        appointmentDate: '2024-01-20',
        appointmentTime: '14:00'
      };

      const result = await utils.appointmentUtils.create(appointmentData);
      
      expect(result.success).toBe(true);
      expect(result.data.customerName).toBe('Jane Smith');
      expect(result.data.status).toBe('pending');
      expect(result.data.id).toBeDefined();
    });

    it('should check availability correctly', async () => {
      // First, create a confirmed appointment
      await utils.appointmentUtils.create({
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '555-1234',
        service: 'Manicure',
        appointmentDate: '2024-01-15',
        appointmentTime: '10:00'
      });

      // Update status to confirmed
      const appointments = await testDb.select().from(schema.appointments);
      await utils.appointmentUtils.updateStatus(appointments[0].id, 'confirmed');

      // Check availability for same slot (should be unavailable)
      const unavailable = await utils.appointmentUtils.checkAvailability('2024-01-15', '10:00');
      expect(unavailable.success).toBe(true);
      expect(unavailable.available).toBe(false);

      // Check availability for different slot (should be available)
      const available = await utils.appointmentUtils.checkAvailability('2024-01-15', '11:00');
      expect(available.success).toBe(true);
      expect(available.available).toBe(true);
    });

    it('should update appointment status', async () => {
      const result = await utils.appointmentUtils.create({
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        customerPhone: '555-0000',
        service: 'Test Service',
        appointmentDate: '2024-01-01',
        appointmentTime: '09:00'
      });

      const updateResult = await utils.appointmentUtils.updateStatus(result.data.id, 'confirmed');
      
      expect(updateResult.success).toBe(true);
      expect(updateResult.data.status).toBe('confirmed');
    });
  });

  describe('Service Utils', () => {
    it('should create service successfully', async () => {
      const serviceData = {
        name: 'Gel Manicure',
        description: 'Long-lasting gel polish manicure',
        price: '$35',
        duration: 60,
        category: 'Manicure'
      };

      const result = await utils.serviceUtils.create(serviceData);
      
      expect(result.success).toBe(true);
      expect(result.data.name).toBe('Gel Manicure');
      expect(result.data.isActive).toBe(true);
      expect(result.data.id).toBeDefined();
    });

    it('should get all active services', async () => {
      // Create test services
      await utils.serviceUtils.create({
        name: 'Service 1',
        description: 'Description 1',
        price: '$20',
        duration: 30,
        category: 'Category A'
      });

      await utils.serviceUtils.create({
        name: 'Service 2',
        description: 'Description 2',
        price: '$40',
        duration: 60,
        category: 'Category B'
      });

      const result = await utils.serviceUtils.getAllActive();
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data[0].name).toBeDefined();
    });
  });

  describe('Contact Utils', () => {
    it('should create contact message successfully', async () => {
      const messageData = {
        name: 'Contact Person',
        email: 'contact@example.com',
        phone: '555-9999',
        message: 'This is a test message'
      };

      const result = await utils.contactUtils.create(messageData);
      
      expect(result.success).toBe(true);
      expect(result.data.name).toBe('Contact Person');
      expect(result.data.status).toBe('unread');
      expect(result.data.id).toBeDefined();
    });
  });
});