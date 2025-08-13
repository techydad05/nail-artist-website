import { initializeDatabase, checkDatabaseHealth } from './config.js';

// Initialize database with error handling
export async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Check if database is healthy
    const isHealthy = checkDatabaseHealth();
    if (!isHealthy) {
      console.log('Database needs initialization...');
      const initialized = initializeDatabase();
      
      if (!initialized) {
        throw new Error('Failed to initialize database');
      }
    }
    
    console.log('✅ Database setup completed successfully');
    return true;
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    return false;
  }
}

// Seed database with initial data (optional)
export async function seedDatabase() {
  try {
    const { serviceUtils } = await import('./utils.js');
    
    // Check if services already exist
    const existingServices = await serviceUtils.getAllActive();
    if (existingServices.success && existingServices.data.length > 0) {
      console.log('Database already has seed data');
      return true;
    }
    
    // Add initial services
    const initialServices = [
      {
        name: 'Classic Manicure',
        description: 'Traditional nail care with polish application',
        price: '$25',
        duration: 45,
        category: 'Manicure',
        sortOrder: 1
      },
      {
        name: 'Gel Manicure',
        description: 'Long-lasting gel polish manicure',
        price: '$35',
        duration: 60,
        category: 'Manicure',
        sortOrder: 2
      },
      {
        name: 'Classic Pedicure',
        description: 'Relaxing foot care with polish',
        price: '$30',
        duration: 60,
        category: 'Pedicure',
        sortOrder: 3
      },
      {
        name: 'Nail Art Design',
        description: 'Custom nail art and designs',
        price: '$45',
        duration: 90,
        category: 'Nail Art',
        sortOrder: 4
      }
    ];
    
    for (const service of initialServices) {
      await serviceUtils.create(service);
    }
    
    console.log('✅ Database seeded with initial services');
    return true;
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    return false;
  }
}