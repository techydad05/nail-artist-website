import { db } from './index.js';
import { appointments, users, savedDesigns, services } from './schema.js';

// Sample data for seeding the database
const sampleUsers = [
	{ email: 'sarah.johnson@email.com', name: 'Sarah Johnson' },
	{ email: 'emma.davis@email.com', name: 'Emma Davis' },
	{ email: 'jessica.wilson@email.com', name: 'Jessica Wilson' },
	{ email: 'mia.brown@email.com', name: 'Mia Brown' },
	{ email: 'olivia.taylor@email.com', name: 'Olivia Taylor' }
];

const sampleServices = [
	{
		name: 'Classic Manicure',
		description: 'Traditional manicure with nail shaping, cuticle care, and polish application',
		price: '$35',
		duration: 45,
		category: 'Manicure',
		isActive: true,
		sortOrder: 1
	},
	{
		name: 'Gel Manicure',
		description: 'Long-lasting gel polish manicure that lasts up to 3 weeks',
		price: '$50',
		duration: 60,
		category: 'Manicure',
		isActive: true,
		sortOrder: 2
	},
	{
		name: 'Acrylic Full Set',
		description: 'Complete acrylic nail extensions with custom length and shape',
		price: '$75',
		duration: 120,
		category: 'Extensions',
		isActive: true,
		sortOrder: 3
	},
	{
		name: 'Nail Art Design',
		description: 'Custom nail art with intricate designs and decorations',
		price: '$65',
		duration: 90,
		category: 'Art',
		isActive: true,
		sortOrder: 4
	},
	{
		name: 'Pedicure',
		description: 'Relaxing pedicure with foot soak, exfoliation, and polish',
		price: '$45',
		duration: 60,
		category: 'Pedicure',
		isActive: true,
		sortOrder: 5
	},
	{
		name: 'Mani-Pedi Combo',
		description: 'Complete manicure and pedicure package',
		price: '$70',
		duration: 105,
		category: 'Combo',
		isActive: true,
		sortOrder: 6
	}
];

// Generate sample appointments for the next 30 days
function generateSampleAppointments() {
	const appointments = [];
	// More varied time slots including half-hour appointments
	const timeSlots = [
		'9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', 
		'12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', 
		'3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'
	];
	const services = ['gel-nails', 'acrylic-extensions', 'nail-art', 'spa-treatment', 'nail-repair', 'luxury-package'];
	const customers = [
		{ name: 'Sarah Johnson', email: 'sarah.johnson@email.com', phone: '(555) 123-4567' },
		{ name: 'Emma Davis', email: 'emma.davis@email.com', phone: '(555) 234-5678' },
		{ name: 'Jessica Wilson', email: 'jessica.wilson@email.com', phone: '(555) 345-6789' },
		{ name: 'Mia Brown', email: 'mia.brown@email.com', phone: '(555) 456-7890' },
		{ name: 'Olivia Taylor', email: 'olivia.taylor@email.com', phone: '(555) 567-8901' },
		{ name: 'Ava Martinez', email: 'ava.martinez@email.com', phone: '(555) 678-9012' },
		{ name: 'Isabella Garcia', email: 'isabella.garcia@email.com', phone: '(555) 789-0123' },
		{ name: 'Sophia Rodriguez', email: 'sophia.rodriguez@email.com', phone: '(555) 890-1234' }
	];
	
	const notes = [
		'First time client - please be gentle',
		'Allergic to certain nail products',
		'Prefers natural colors',
		'Wants something bold and colorful',
		'Special occasion - wedding next week',
		'Regular client - knows preferences',
		'Wants to try something new',
		'Bringing inspiration photos',
		'Virtual design reference attached',
		'Prefers shorter nails for work'
	];
	
	const today = new Date();
	
	// Generate appointments for the next 30 days
	for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
		const appointmentDate = new Date(today);
		appointmentDate.setDate(today.getDate() + dayOffset);
		
		// Skip weekends
		if (appointmentDate.getDay() === 0 || appointmentDate.getDay() === 6) {
			continue;
		}
		
		const dateString = appointmentDate.toISOString().split('T')[0];
		
		// More realistic booking patterns - some days busier than others
		let appointmentsPerDay;
		const dayOfWeek = appointmentDate.getDay();
		const isRecentDay = dayOffset <= 7;
		
		// Fridays and Saturdays are busier, Mondays slower
		if (dayOfWeek === 5) { // Friday
			appointmentsPerDay = Math.floor(Math.random() * 6) + 5; // 5-10 appointments
		} else if (dayOfWeek === 1) { // Monday  
			appointmentsPerDay = Math.floor(Math.random() * 4) + 2; // 2-5 appointments
		} else {
			appointmentsPerDay = Math.floor(Math.random() * 5) + 3; // 3-7 appointments
		}
		
		// Recent days might be more booked
		if (isRecentDay) {
			appointmentsPerDay = Math.min(appointmentsPerDay + Math.floor(Math.random() * 3), timeSlots.length - 2);
		}
		
		// Randomly select time slots with weighted probability
		const availableSlots = [...timeSlots];
		const selectedSlots = [];
		
		for (let i = 0; i < appointmentsPerDay && availableSlots.length > 0; i++) {
			// Weight certain times as more popular
			let weightedIndex;
			if (Math.random() < 0.3) {
				// 30% chance of popular times (10 AM, 2 PM, 3 PM)
				const popularTimes = ['10:00 AM', '2:00 PM', '3:00 PM'];
				const popularAvailable = availableSlots.filter(slot => popularTimes.includes(slot));
				if (popularAvailable.length > 0) {
					const randomPopular = popularAvailable[Math.floor(Math.random() * popularAvailable.length)];
					weightedIndex = availableSlots.indexOf(randomPopular);
				} else {
					weightedIndex = Math.floor(Math.random() * availableSlots.length);
				}
			} else {
				// 70% chance of any available time
				weightedIndex = Math.floor(Math.random() * availableSlots.length);
			}
			
			const selectedSlot = availableSlots.splice(weightedIndex, 1)[0];
			selectedSlots.push(selectedSlot);
		}
		
		// Create appointments for selected slots
		selectedSlots.forEach(timeSlot => {
			
			const customer = customers[Math.floor(Math.random() * customers.length)];
			const service = services[Math.floor(Math.random() * services.length)];
			const note = Math.random() > 0.5 ? notes[Math.floor(Math.random() * notes.length)] : null;
			
			// Vary the status - most are confirmed, some pending, few completed
			let status = 'confirmed';
			const statusRand = Math.random();
			if (dayOffset < 0) {
				status = 'completed';
			} else if (statusRand < 0.1) {
				status = 'pending';
			} else if (statusRand < 0.05) {
				status = 'cancelled';
			}
			
			const customer = customers[Math.floor(Math.random() * customers.length)];
			const service = services[Math.floor(Math.random() * services.length)];
			const note = Math.random() > 0.4 ? notes[Math.floor(Math.random() * notes.length)] : null;
			
			// Vary the status - most are confirmed, some pending, few completed
			let status = 'confirmed';
			const statusRand = Math.random();
			if (dayOffset < 0) {
				status = 'completed';
			} else if (statusRand < 0.15) {
				status = 'pending';
			} else if (statusRand < 0.05) {
				status = 'cancelled';
			}
			
			appointments.push({
				customerName: customer.name,
				customerEmail: customer.email,
				customerPhone: customer.phone,
				service: service,
				appointmentDate: dateString,
				appointmentTime: timeSlot,
				notes: note,
				status: status,
				createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() // Random creation time in last week
			});
		});
	}
	
	return appointments;
}

// Sample nail designs
const sampleDesigns = [
	{
		designName: 'Summer Sunset',
		designData: {
			nails: [
				{ id: 0, name: 'Thumb', baseColor: '#FF6B6B', design: { pattern: 'ombre', accentColor: '#FFE66D' }, stickers: [{ emoji: '🌅', x: 50, y: 60, size: 16 }] },
				{ id: 1, name: 'Index', baseColor: '#FF8E53', design: { pattern: 'solid' }, stickers: [] },
				{ id: 2, name: 'Middle', baseColor: '#FF6B6B', design: { pattern: 'ombre', accentColor: '#FFE66D' }, stickers: [{ emoji: '⭐', x: 45, y: 55, size: 14 }] },
				{ id: 3, name: 'Ring', baseColor: '#FF8E53', design: { pattern: 'solid' }, stickers: [] },
				{ id: 4, name: 'Pinky', baseColor: '#FFE66D', design: { pattern: 'solid' }, stickers: [{ emoji: '🌙', x: 40, y: 50, size: 12 }] }
			],
			version: '2.0'
		},
		isPublic: true
	},
	{
		designName: 'Ocean Vibes',
		designData: {
			nails: [
				{ id: 0, name: 'Thumb', baseColor: '#4ECDC4', design: { pattern: 'glitter' }, stickers: [{ emoji: '🐚', x: 55, y: 65, size: 18 }] },
				{ id: 1, name: 'Index', baseColor: '#44A08D', design: { pattern: 'solid' }, stickers: [] },
				{ id: 2, name: 'Middle', baseColor: '#4ECDC4', design: { pattern: 'dots', accentColor: '#FFFFFF' }, stickers: [{ emoji: '🌊', x: 50, y: 60, size: 16 }] },
				{ id: 3, name: 'Ring', baseColor: '#44A08D', design: { pattern: 'solid' }, stickers: [] },
				{ id: 4, name: 'Pinky', baseColor: '#96CEB4', design: { pattern: 'solid' }, stickers: [{ emoji: '⭐', x: 42, y: 52, size: 14 }] }
			],
			version: '2.0'
		},
		isPublic: true
	},
	{
		designName: 'Classic French',
		designData: {
			nails: [
				{ id: 0, name: 'Thumb', baseColor: '#FFB6C1', design: { pattern: 'french', tipColor: '#FFFFFF' }, stickers: [] },
				{ id: 1, name: 'Index', baseColor: '#FFB6C1', design: { pattern: 'french', tipColor: '#FFFFFF' }, stickers: [] },
				{ id: 2, name: 'Middle', baseColor: '#FFB6C1', design: { pattern: 'french', tipColor: '#FFFFFF' }, stickers: [{ emoji: '💎', x: 50, y: 40, size: 12 }] },
				{ id: 3, name: 'Ring', baseColor: '#FFB6C1', design: { pattern: 'french', tipColor: '#FFFFFF' }, stickers: [] },
				{ id: 4, name: 'Pinky', baseColor: '#FFB6C1', design: { pattern: 'french', tipColor: '#FFFFFF' }, stickers: [] }
			],
			version: '2.0'
		},
		isPublic: true
	},
	{
		designName: 'Galaxy Dreams',
		designData: {
			nails: [
				{ id: 0, name: 'Thumb', baseColor: '#2F2F2F', design: { pattern: 'glitter' }, stickers: [{ emoji: '🌟', x: 48, y: 58, size: 16 }, { emoji: '✨', x: 35, y: 45, size: 12 }] },
				{ id: 1, name: 'Index', baseColor: '#4B0082', design: { pattern: 'ombre', accentColor: '#2F2F2F' }, stickers: [{ emoji: '🌙', x: 50, y: 55, size: 14 }] },
				{ id: 2, name: 'Middle', baseColor: '#2F2F2F', design: { pattern: 'glitter' }, stickers: [{ emoji: '⭐', x: 45, y: 50, size: 18 }] },
				{ id: 3, name: 'Ring', baseColor: '#4B0082', design: { pattern: 'solid' }, stickers: [{ emoji: '🌟', x: 40, y: 60, size: 12 }] },
				{ id: 4, name: 'Pinky', baseColor: '#2F2F2F', design: { pattern: 'dots', accentColor: '#C0C0C0' }, stickers: [{ emoji: '✨', x: 38, y: 48, size: 10 }] }
			],
			version: '2.0'
		},
		isPublic: true
	}
];

export async function seedDatabase() {
	try {
		console.log('🌱 Starting database seeding...');
		
		// Clear existing data (optional - comment out if you want to keep existing data)
		console.log('🧹 Clearing existing data...');
		await db.delete(appointments);
		await db.delete(savedDesigns);
		await db.delete(users);
		await db.delete(services);
		
		// Insert sample users
		console.log('👥 Inserting sample users...');
		const insertedUsers = await db.insert(users).values(sampleUsers).returning();
		console.log(`✅ Inserted ${insertedUsers.length} users`);
		
		// Insert sample services
		console.log('🛍️ Inserting sample services...');
		const insertedServices = await db.insert(services).values(sampleServices).returning();
		console.log(`✅ Inserted ${insertedServices.length} services`);
		
		// Generate and insert sample appointments
		console.log('📅 Generating sample appointments...');
		const sampleAppointments = generateSampleAppointments();
		const insertedAppointments = await db.insert(appointments).values(sampleAppointments).returning();
		console.log(`✅ Inserted ${insertedAppointments.length} appointments`);
		
		// Insert sample designs
		console.log('🎨 Inserting sample nail designs...');
		const designsWithUsers = sampleDesigns.map((design, index) => ({
			...design,
			userId: insertedUsers[index % insertedUsers.length].id,
			designData: JSON.stringify(design.designData)
		}));
		const insertedDesigns = await db.insert(savedDesigns).values(designsWithUsers).returning();
		console.log(`✅ Inserted ${insertedDesigns.length} nail designs`);
		
		console.log('🎉 Database seeding completed successfully!');
		console.log(`
📊 Summary:
- ${insertedUsers.length} users
- ${insertedServices.length} services  
- ${insertedAppointments.length} appointments
- ${insertedDesigns.length} nail designs
		`);
		
		return {
			success: true,
			users: insertedUsers.length,
			services: insertedServices.length,
			appointments: insertedAppointments.length,
			designs: insertedDesigns.length
		};
		
	} catch (error) {
		console.error('❌ Error seeding database:', error);
		return {
			success: false,
			error: error.message
		};
	}
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	seedDatabase().then(() => {
		process.exit(0);
	}).catch((error) => {
		console.error('Seeding failed:', error);
		process.exit(1);
	});
}