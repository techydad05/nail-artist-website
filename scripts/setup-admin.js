import { db } from '../src/lib/db/config.js';
import { createAdminUser } from '../src/lib/auth.js';
import { contentPages, contentSections } from '../src/lib/db/schema.js';

async function setupAdmin() {
  try {
    console.log('Setting up admin user and initial content...');
    
    // Create admin user
    const adminEmail = 'admin@polishedperfection.com';
    const adminPassword = 'admin123'; // Change this in production!
    
    try {
      const adminUser = await createAdminUser(adminEmail, adminPassword);
      console.log('✅ Admin user created:', adminUser.email);
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        console.log('ℹ️  Admin user already exists');
      } else {
        throw error;
      }
    }
    
    // Create initial content pages
    const initialPages = [
      {
        slug: 'home',
        title: 'Home Page',
        content: `# Welcome to Polished Perfection

Your premier destination for professional nail artistry and beauty services.

## Our Services
- Gel Nails
- Nail Art
- Manicures & Pedicures
- Special Occasion Nails

## Why Choose Us?
- Professional certified nail technicians
- High-quality products and tools
- Relaxing and clean environment
- Competitive pricing`,
        metaDescription: 'Professional nail artistry and beauty services at Polished Perfection',
        isPublished: true
      },
      {
        slug: 'about',
        title: 'About Us',
        content: `# About Polished Perfection

We are passionate nail artists dedicated to bringing you the latest trends and highest quality nail services.

## Our Story
Founded with a vision to provide exceptional nail artistry, we combine creativity with professionalism to deliver stunning results every time.

## Our Team
Our certified nail technicians stay up-to-date with the latest techniques and trends to ensure you receive the best possible service.`,
        metaDescription: 'Learn about our professional nail artistry team and our commitment to excellence',
        isPublished: true
      },
      {
        slug: 'services',
        title: 'Our Services',
        content: `# Our Services

Discover our comprehensive range of nail services designed to pamper and beautify.

## Nail Services
- **Gel Manicure** - Long-lasting, chip-resistant finish
- **Classic Manicure** - Traditional nail care and polish
- **Nail Art** - Custom designs and creative expressions
- **Pedicure** - Complete foot care and relaxation

## Special Packages
- Bridal packages
- Group bookings
- Seasonal specials`,
        metaDescription: 'Comprehensive nail services including gel manicures, nail art, and pedicures',
        isPublished: true
      }
    ];
    
    for (const pageData of initialPages) {
      try {
        await db.insert(contentPages).values(pageData);
        console.log(`✅ Created page: ${pageData.title}`);
      } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
          console.log(`ℹ️  Page already exists: ${pageData.title}`);
        } else {
          throw error;
        }
      }
    }
    
    // Create initial content sections for home page
    const homeSections = [
      {
        pageSlug: 'home',
        sectionKey: 'hero',
        sectionType: 'hero',
        title: 'Welcome to Polished Perfection',
        content: 'Your premier destination for professional nail artistry',
        sortOrder: 1,
        isActive: true
      },
      {
        pageSlug: 'home',
        sectionKey: 'services_preview',
        sectionType: 'services',
        title: 'Our Services',
        content: 'Discover our range of professional nail services',
        sortOrder: 2,
        isActive: true
      },
      {
        pageSlug: 'home',
        sectionKey: 'testimonials',
        sectionType: 'testimonials',
        title: 'What Our Clients Say',
        content: 'Read reviews from our satisfied customers',
        sortOrder: 3,
        isActive: true
      }
    ];
    
    for (const sectionData of homeSections) {
      try {
        await db.insert(contentSections).values(sectionData);
        console.log(`✅ Created section: ${sectionData.title}`);
      } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
          console.log(`ℹ️  Section already exists: ${sectionData.title}`);
        } else {
          console.log(`⚠️  Could not create section: ${sectionData.title}`);
        }
      }
    }
    
    console.log('\n🎉 Setup complete!');
    console.log('\nAdmin Login Credentials:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('\n⚠️  IMPORTANT: Change the admin password after first login!');
    console.log('\nAccess the admin panel at: http://localhost:5173/admin/login');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupAdmin();