import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema.js';
import path from 'path';
import fs from 'fs';

// Simple database path logic
const isDev = process.env.NODE_ENV !== 'production';
const DB_PATH = process.env.DATABASE_PATH || 'appointments.db';

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create SQLite database connection
const sqlite = new Database(DB_PATH);

// Enable WAL mode for better concurrent access
sqlite.pragma('journal_mode = WAL');

// Create Drizzle database instance
export const db = drizzle(sqlite, { schema });

// Export the raw SQLite instance for advanced operations
export { sqlite };

// Database initialization function
export function initializeDatabase() {
  try {
    // Run migrations
    migrate(db, { migrationsFolder: 'src/lib/db/migrations' });
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}

// Close database connection
export function closeDatabase() {
  try {
    sqlite.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database:', error);
  }
}

// Health check function
export function checkDatabaseHealth() {
  try {
    const result = sqlite.prepare('SELECT 1 as health').get();
    return result.health === 1;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}