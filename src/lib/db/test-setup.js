import { beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema.js';

// Create in-memory database for testing
let testDb;
let testSqlite;

beforeEach(() => {
  // Create a new in-memory database for each test
  testSqlite = new Database(':memory:');
  testDb = drizzle(testSqlite, { schema });
  
  // Run migrations on the test database
  migrate(testDb, { migrationsFolder: 'src/lib/db/migrations' });
});

afterEach(() => {
  // Close the test database
  if (testSqlite) {
    testSqlite.close();
  }
});

// Export test database for use in tests
export { testDb, testSqlite };