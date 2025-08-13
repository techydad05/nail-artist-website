// Main database exports
export { db, sqlite, initializeDatabase, closeDatabase, checkDatabaseHealth } from './config.js';
export { appointmentUtils, galleryUtils, serviceUtils, contactUtils } from './utils.js';
export { setupDatabase, seedDatabase } from './init.js';
export * as schema from './schema.js';
export * as availability from './availability.js';