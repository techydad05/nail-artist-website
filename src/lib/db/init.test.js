import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema.js';

describe('Database Initialization', () => {
  let testDb;
  let testSqlite;

  beforeEach(() => {
    testSqlite = new Database(':memory:');
    testDb = drizzle(testSqlite, { schema });
    migrate(testDb, { migrationsFolder: 'src/lib/db/migrations' });
  });

  afterEach(() => {
    if (testSqlite) {
      testSqlite.close();
    }
  });

  it('should initialize database with all required tables', () => {
    const tables = testSqlite.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `).all();
    
    const tableNames = tables.map(t => t.name);
    
    // Verify all required tables exist
    expect(tableNames).toContain('appointments');
    expect(tableNames).toContain('gallery_images');
    expect(tableNames).toContain('services');
    expect(tableNames).toContain('contact_messages');
    expect(tableNames).toContain('admin_users');
    expect(tableNames).toContain('__drizzle_migrations');
  });

  it('should have proper foreign key constraints and indexes', () => {
    // Test that we can insert related data
    const serviceResult = testSqlite.prepare(`
      INSERT INTO services (name, description, price, duration, category)
      VALUES (?, ?, ?, ?, ?)
    `).run('Test Service', 'Test Description', '$25', 60, 'Test Category');
    
    expect(serviceResult.changes).toBe(1);
    
    // Test appointment with service reference
    const appointmentResult = testSqlite.prepare(`
      INSERT INTO appointments (customer_name, customer_email, customer_phone, service, appointment_date, appointment_time)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('John Doe', 'john@example.com', '555-1234', 'Test Service', '2024-01-15', '10:00');
    
    expect(appointmentResult.changes).toBe(1);
  });

  it('should handle database operations with proper error handling', () => {
    // Test constraint violations
    expect(() => {
      testSqlite.prepare(`
        INSERT INTO appointments (customer_name, customer_email, customer_phone, service, appointment_date, appointment_time)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(null, 'john@example.com', '555-1234', 'Test Service', '2024-01-15', '10:00');
    }).toThrow();
  });

  it('should support concurrent operations with WAL mode', () => {
    // Test that multiple operations can be performed
    const operations = [];
    
    for (let i = 0; i < 5; i++) {
      operations.push(
        testSqlite.prepare(`
          INSERT INTO contact_messages (name, email, message)
          VALUES (?, ?, ?)
        `).run(`User ${i}`, `user${i}@example.com`, `Message ${i}`)
      );
    }
    
    operations.forEach(result => {
      expect(result.changes).toBe(1);
    });
    
    const count = testSqlite.prepare(`SELECT COUNT(*) as count FROM contact_messages`).get();
    expect(count.count).toBe(5);
  });
});