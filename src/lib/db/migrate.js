import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db, sqlite } from './config.js';

async function runMigrations() {
  try {
    console.log('Running database migrations...');
    
    migrate(db, { migrationsFolder: 'src/lib/db/migrations' });
    
    console.log('✅ Database migrations completed successfully');
    
    // Close the database connection
    sqlite.close();
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();