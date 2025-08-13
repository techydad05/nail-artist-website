import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema.js';
import { checkDatabaseHealth } from './config.js';

describe('Database Configuration', () => {
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

  it('should create database connection successfully', () => {
    expect(testDb).toBeDefined();
    expect(testSqlite).toBeDefined();
  });

  it('should run migrations successfully', () => {
    // Check that tables exist by querying schema
    const tables = testSqlite.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `).all();
    
    const tableNames = tables.map(t => t.name);
    expect(tableNames).toContain('appointments');
    expect(tableNames).toContain('gallery_images');
    expect(tableNames).toContain('services');
    expect(tableNames).toContain('contact_messages');
    expect(tableNames).toContain('admin_users');
  });

  it('should have correct table structure for appointments', () => {
    const columns = testSqlite.prepare(`PRAGMA table_info(appointments)`).all();
    const columnNames = columns.map(c => c.name);
    
    expect(columnNames).toContain('id');
    expect(columnNames).toContain('customer_name');
    expect(columnNames).toContain('customer_email');
    expect(columnNames).toContain('appointment_date');
    expect(columnNames).toContain('appointment_time');
    expect(columnNames).toContain('status');
  });

  it('should perform basic database operations', () => {
    // Test basic insert and select
    const result = testSqlite.prepare(`
      INSERT INTO appointments (customer_name, customer_email, customer_phone, service, appointment_date, appointment_time)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('John Doe', 'john@example.com', '555-1234', 'Manicure', '2024-01-15', '10:00');
    
    expect(result.changes).toBe(1);
    
    const appointment = testSqlite.prepare(`
      SELECT * FROM appointments WHERE id = ?
    `).get(result.lastInsertRowid);
    
    expect(appointment.customer_name).toBe('John Doe');
    expect(appointment.customer_email).toBe('john@example.com');
    expect(appointment.status).toBe('pending');
  });
});