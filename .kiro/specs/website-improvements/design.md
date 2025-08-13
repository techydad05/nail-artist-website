# Design Document

## Overview

This design outlines the technical implementation for enhancing the Polished Perfection Nail Studio website with a functional appointment booking system, real image gallery, enhanced contact system, service management, performance optimizations, virtual nail designer, and admin dashboard. The solution uses SvelteKit with better-sqlite3 for data persistence, ensuring deployment compatibility with Coolify while maintaining excellent performance.

## Architecture

### Technology Stack
- **Frontend**: SvelteKit with Tailwind CSS and DaisyUI
- **Database**: better-sqlite3 with Drizzle ORM
- **Email Service**: EmailJS for client-side email functionality
- **File Storage**: Local filesystem with organized directory structure
- **Deployment**: Docker with Coolify-compatible configuration

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │    │   SvelteKit     │    │   SQLite DB     │
│   (Browser)     │◄──►│   Server        │◄──►│   (File-based)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   File System   │
                       │   (Images)      │
                       └─────────────────┘
```

## Components and Interfaces

### 1. Database Layer
**Location**: `src/lib/db/`

#### Database Configuration (`config.js`)
```javascript
// Simple better-sqlite3 setup with Drizzle ORM
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
```

#### Schema Definition (`schema.js`)
- **appointments**: Customer booking data with status tracking
- **contact_messages**: Contact form submissions
- **gallery_images**: Image metadata with categories
- **services**: Service information with pricing and duration
- **admin_users**: Simple admin authentication

### 2. API Routes
**Location**: `src/routes/api/`

#### Appointment Management
- `POST /api/appointments` - Create new appointment
- `GET /api/appointments/availability` - Check time slot availability
- `PUT /api/appointments/[id]` - Update appointment status
- `DELETE /api/appointments/[id]` - Cancel appointment

#### Gallery Management
- `POST /api/gallery/upload` - Upload new images
- `GET /api/gallery` - Retrieve gallery images by category
- `PUT /api/gallery/[id]` - Update image metadata
- `DELETE /api/gallery/[id]` - Remove image

#### Contact System
- `POST /api/contact` - Submit contact form
- `GET /api/contact/messages` - Retrieve messages (admin)

#### Service Management
- `GET /api/services` - Public service listing
- `POST /api/services` - Create service (admin)
- `PUT /api/services/[id]` - Update service (admin)

### 3. Frontend Components
**Location**: `src/lib/components/`

#### Booking System
- `AppointmentModal.svelte` - Main booking interface
- `DatePicker.svelte` - Date selection component
- `TimeSlotPicker.svelte` - Available time display
- `BookingForm.svelte` - Customer information form

#### Gallery System
- `ImageGallery.svelte` - Main gallery display
- `ImageUpload.svelte` - Admin upload interface
- `ImageModal.svelte` - Lightbox for image viewing
- `CategoryFilter.svelte` - Filter by service type

#### Admin Dashboard
- `AdminLayout.svelte` - Dashboard wrapper
- `AppointmentManager.svelte` - Booking management
- `GalleryManager.svelte` - Image management
- `ServiceManager.svelte` - Service CRUD operations
- `Analytics.svelte` - Basic reporting

### 4. Virtual Nail Designer
**Location**: `src/lib/components/designer/`

#### Core Components
- `NailCanvas.svelte` - SVG-based nail visualization
- `ColorPalette.svelte` - Color selection interface
- `ShapeSelector.svelte` - Nail shape options
- `PatternLibrary.svelte` - Pre-made design patterns
- `DesignSaver.svelte` - Save/share functionality

## Data Models

### Appointments Table
```sql
CREATE TABLE appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  service TEXT NOT NULL,
  appointment_date TEXT NOT NULL,
  appointment_time TEXT NOT NULL,
  notes TEXT,
  design_reference TEXT, -- For virtual designer integration
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Gallery Images Table
```sql
CREATE TABLE gallery_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  is_active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Services Table
```sql
CREATE TABLE services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT NOT NULL,
  duration INTEGER NOT NULL, -- minutes
  category TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Contact Messages Table
```sql
CREATE TABLE contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## Error Handling

### Database Errors
- Connection failures: Graceful fallback with user-friendly messages
- Constraint violations: Validation feedback for duplicate bookings
- Transaction rollbacks: Ensure data consistency for multi-step operations

### File Upload Errors
- Size limits: 5MB per image with clear error messages
- Format validation: Accept only JPEG, PNG, WebP formats
- Storage failures: Cleanup partial uploads and retry mechanisms

### Email Service Errors
- EmailJS failures: Store messages locally and retry
- Network issues: Queue messages for later delivery
- Validation errors: Real-time form validation feedback

### API Error Responses
```javascript
// Standardized error response format
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'User-friendly error message',
    details: {} // Additional context for debugging
  }
}
```

## Testing Strategy

### Unit Testing
- Database operations with in-memory SQLite
- Component logic with Vitest
- Form validation functions
- Date/time utility functions

### Integration Testing
- API endpoint testing with test database
- Email service integration tests
- File upload/download workflows
- Appointment booking end-to-end flows

### Performance Testing
- Database query optimization
- Image loading performance
- Mobile responsiveness testing
- Lighthouse performance audits

### Deployment Testing
- Docker build verification
- Database migration testing
- Environment variable validation
- Health check endpoint testing

## Security Considerations

### Data Protection
- Input sanitization for all user inputs
- SQL injection prevention via parameterized queries
- File upload validation and sanitization
- Rate limiting for API endpoints

### Admin Authentication
- Simple session-based authentication
- Password hashing with bcrypt
- CSRF protection for admin forms
- Secure admin route protection

### File Security
- Uploaded file type validation
- Filename sanitization
- Directory traversal prevention
- Image optimization and metadata stripping

## Performance Optimizations

### Database Optimization
- Indexed columns for frequent queries (date, status, category)
- Connection pooling for concurrent requests
- Query optimization for availability checks
- Batch operations for bulk updates

### Frontend Optimization
- Image lazy loading and optimization
- Component code splitting
- CSS purging with Tailwind
- Service worker for offline functionality

### Caching Strategy
- Static asset caching with proper headers
- API response caching for service data
- Image thumbnail generation and caching
- Browser caching for gallery images

## Deployment Configuration

### Docker Optimization
- Multi-stage build for smaller production image
- Native dependency compilation for better-sqlite3
- Health check endpoint for container monitoring
- Proper signal handling for graceful shutdowns

### Environment Variables
```bash
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
DATABASE_PATH=/app/data/appointments.db
UPLOAD_PATH=/app/static/uploads
ADMIN_PASSWORD_HASH=<bcrypt_hash>
```

### File Structure
```
/app/
├── build/           # Compiled SvelteKit app
├── data/           # SQLite database files
├── static/         # Static assets
│   └── uploads/    # User uploaded images
└── package.json    # Dependencies
```

This design provides a solid foundation for implementing all the required features while ensuring reliable deployment to Coolify with better-sqlite3.