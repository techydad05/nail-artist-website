#!/usr/bin/env node

import { seedDatabase } from '../src/lib/db/seed-data.js';

console.log('🚀 Starting database seeding process...\n');

seedDatabase()
	.then((result) => {
		if (result.success) {
			console.log('\n✅ Database seeding completed successfully!');
			console.log('🎯 Your nail artist website now has sample data to showcase the booking system.');
			console.log('\n💡 You can now:');
			console.log('   - View booked appointments in the calendar');
			console.log('   - See how availability is calculated');
			console.log('   - Browse community nail designs');
			console.log('   - Test the booking flow with realistic data');
		} else {
			console.error('\n❌ Database seeding failed:', result.error);
			process.exit(1);
		}
	})
	.catch((error) => {
		console.error('\n💥 Unexpected error during seeding:', error);
		process.exit(1);
	});