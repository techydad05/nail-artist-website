import Database from 'better-sqlite3';
import { building } from '$app/environment';

// Only initialize database on server-side
let db;
if (!building) {
	db = new Database('appointments.db');
}

// Initialize database tables and data only on server side
let queries = {};

if (!building && db) {
	// Create appointments table
	db.exec(`
		CREATE TABLE IF NOT EXISTS appointments (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			customer_name TEXT NOT NULL,
			customer_email TEXT NOT NULL,
			customer_phone TEXT,
			service_id TEXT NOT NULL,
			appointment_date TEXT NOT NULL,
			appointment_time TEXT NOT NULL,
			special_requests TEXT,
			status TEXT DEFAULT 'confirmed',
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`);

	// Create services table
	db.exec(`
		CREATE TABLE IF NOT EXISTS services (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL,
			duration TEXT NOT NULL,
			price TEXT NOT NULL,
			description TEXT
		)
	`);

	// Insert default services if they don't exist
	const insertService = db.prepare(`
		INSERT OR IGNORE INTO services (id, name, duration, price, description)
		VALUES (?, ?, ?, ?, ?)
	`);

	const services = [
		['gel', 'Gel Nails', '60 min', '$45', 'Long-lasting, vibrant gel manicures with premium quality polish.'],
		['acrylic', 'Acrylic Extensions', '90 min', '$65', 'Beautiful acrylic nails customized to your desired length and style.'],
		['nail-art', 'Nail Art', '75 min', '$55', 'Custom designs, from simple patterns to intricate artwork.'],
		['spa', 'Spa Treatment', '120 min', '$85', 'Relaxing hand and nail treatments for ultimate pampering.'],
		['repair', 'Nail Repair', '45 min', '$35', 'Expert repair services for damaged or broken nails.'],
		['luxury', 'Luxury Package', '150 min', '$120', 'Complete pampering experience with all our premium services.']
	];

	services.forEach(service => {
		insertService.run(...service);
	});

	// Insert some fake appointments for demo purposes
	const insertAppointment = db.prepare(`
		INSERT OR IGNORE INTO appointments (id, customer_name, customer_email, customer_phone, service_id, appointment_date, appointment_time, special_requests)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`);

	const fakeAppointments = [
		[1, 'Sarah Johnson', 'sarah.j@email.com', '(555) 123-4567', 'gel', '2025-08-15', '10:00 AM', 'Please use light pink colors'],
		[2, 'Emma Wilson', 'emma.w@email.com', '(555) 234-5678', 'acrylic', '2025-08-15', '2:00 PM', 'Medium length preferred'],
		[3, 'Lisa Brown', 'lisa.b@email.com', '(555) 345-6789', 'nail-art', '2025-08-16', '11:00 AM', 'Floral design requested'],
		[4, 'Maria Garcia', 'maria.g@email.com', '(555) 456-7890', 'spa', '2025-08-18', '9:00 AM', 'First time customer'],
		[5, 'Anna Davis', 'anna.d@email.com', '(555) 567-8901', 'repair', '2025-08-18', '3:00 PM', 'Broken nail on index finger'],
		[6, 'Sophie Miller', 'sophie.m@email.com', '(555) 678-9012', 'luxury', '2025-08-20', '1:00 PM', 'Special occasion - anniversary'],
		[7, 'Rachel Taylor', 'rachel.t@email.com', '(555) 789-0123', 'gel', '2025-08-22', '4:00 PM', 'Prefer neutral colors']
	];

	fakeAppointments.forEach(appointment => {
		insertAppointment.run(...appointment);
	});

	// Prepared statements for common operations
	queries = {
		getAllAppointments: db.prepare('SELECT * FROM appointments ORDER BY appointment_date, appointment_time'),
		
		getAppointmentsByDate: db.prepare('SELECT * FROM appointments WHERE appointment_date = ? ORDER BY appointment_time'),
		
		createAppointment: db.prepare(`
			INSERT INTO appointments (customer_name, customer_email, customer_phone, service_id, appointment_date, appointment_time, special_requests)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`),
		
		updateAppointment: db.prepare(`
			UPDATE appointments 
			SET customer_name = ?, customer_email = ?, customer_phone = ?, service_id = ?, appointment_date = ?, appointment_time = ?, special_requests = ?, updated_at = CURRENT_TIMESTAMP
			WHERE id = ?
		`),
		
		deleteAppointment: db.prepare('DELETE FROM appointments WHERE id = ?'),
		
		getAllServices: db.prepare('SELECT * FROM services'),
		
		getServiceById: db.prepare('SELECT * FROM services WHERE id = ?')
	};
}

export { queries };

// Helper functions
export function getBookedSlots(date) {
	if (!queries.getAppointmentsByDate) return [];
	const appointments = queries.getAppointmentsByDate.all(date);
	return appointments.map(apt => ({
		id: apt.id,
		time: apt.appointment_time,
		customer: apt.customer_name,
		service: apt.service_id
	}));
}

export function isTimeSlotAvailable(date, time) {
	const bookedSlots = getBookedSlots(date);
	return !bookedSlots.some(slot => slot.time === time);
}

export function bookAppointment(appointmentData) {
	if (!queries.createAppointment) {
		throw new Error('Database not available');
	}
	
	const { customerName, customerEmail, customerPhone, serviceId, date, time, specialRequests } = appointmentData;
	
	// Check if slot is still available
	if (!isTimeSlotAvailable(date, time)) {
		throw new Error('This time slot is no longer available');
	}
	
	// Insert the appointment
	const result = queries.createAppointment.run(
		customerName,
		customerEmail,
		customerPhone || null,
		serviceId,
		date,
		time,
		specialRequests || null
	);
	
	return {
		id: result.lastInsertRowid,
		success: true,
		message: 'Appointment booked successfully!'
	};
}

export function getAllAppointments() {
	if (!queries.getAllAppointments) return [];
	return queries.getAllAppointments.all();
}

export function getAllServices() {
	if (!queries.getAllServices) return [];
	return queries.getAllServices.all();
}

// Close database connection on process exit (only if db exists)
if (db) {
	process.on('exit', () => db.close());
	process.on('SIGHUP', () => process.exit(128 + 1));
	process.on('SIGINT', () => process.exit(128 + 2));
	process.on('SIGTERM', () => process.exit(128 + 15));
}

export default db;
