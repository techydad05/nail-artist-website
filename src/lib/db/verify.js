import { db, checkDatabaseHealth } from './config.js';
import { appointmentUtils, serviceUtils, contactUtils } from './utils.js';

async function verifyDatabase() {
  console.log('🔍 Verifying database setup...');
  
  try {
    // Check database health
    const isHealthy = checkDatabaseHealth();
    console.log(`Database health: ${isHealthy ? '✅ Healthy' : '❌ Unhealthy'}`);
    
    if (!isHealthy) {
      throw new Error('Database is not healthy');
    }
    
    // Test service creation
    console.log('Testing service creation...');
    const serviceResult = await serviceUtils.create({
      name: 'Test Service',
      description: 'This is a test service',
      price: '$25',
      duration: 60,
      category: 'Test'
    });
    
    if (serviceResult.success) {
      console.log('✅ Service creation successful');
    } else {
      throw new Error(`Service creation failed: ${serviceResult.error}`);
    }
    
    // Test appointment creation
    console.log('Testing appointment creation...');
    const appointmentResult = await appointmentUtils.create({
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '555-0123',
      service: 'Test Service',
      appointmentDate: '2024-02-01',
      appointmentTime: '10:00'
    });
    
    if (appointmentResult.success) {
      console.log('✅ Appointment creation successful');
    } else {
      throw new Error(`Appointment creation failed: ${appointmentResult.error}`);
    }
    
    // Test availability check
    console.log('Testing availability check...');
    const availabilityResult = await appointmentUtils.checkAvailability('2024-02-01', '10:00');
    
    if (availabilityResult.success) {
      console.log(`✅ Availability check successful - Available: ${availabilityResult.available}`);
    } else {
      throw new Error(`Availability check failed: ${availabilityResult.error}`);
    }
    
    // Test contact message creation
    console.log('Testing contact message creation...');
    const contactResult = await contactUtils.create({
      name: 'Test Contact',
      email: 'contact@example.com',
      message: 'This is a test message'
    });
    
    if (contactResult.success) {
      console.log('✅ Contact message creation successful');
    } else {
      throw new Error(`Contact message creation failed: ${contactResult.error}`);
    }
    
    console.log('\n🎉 All database operations verified successfully!');
    console.log('Database foundation is ready for use.');
    
  } catch (error) {
    console.error('\n❌ Database verification failed:', error.message);
    process.exit(1);
  }
}

// Run verification if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyDatabase();
}

export { verifyDatabase };