// Email service for handling contact form submissions
// This is a placeholder implementation that simulates email sending
// In a real implementation, you would integrate with an email service like EmailJS, SendGrid, or Nodemailer

/**
 * Simulates sending an email with the contact form data
 * @param {Object} formData - The contact form data
 * @param {string} formData.name - The sender's name
 * @param {string} formData.email - The sender's email
 * @param {string} formData.message - The message content
 * @returns {Promise<Object>} - A promise that resolves with the result of the email sending
 */
export async function sendContactEmail(formData) {
  // Basic validation
  if (!formData.name || !formData.email || !formData.message) {
    throw new Error('All fields are required');
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    throw new Error('Please enter a valid email address');
  }
  
  // In a real implementation, you would integrate with an email service here
  // For example, with EmailJS:
  // import emailjs from '@emailjs/browser';
  // await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData, 'YOUR_PUBLIC_KEY');
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate successful email sending
  console.log('Email sent successfully:', formData);
  
  // Return success response
  return {
    success: true,
    message: 'Thank you for your message! We\'ll get back to you soon.'
  };
}

/**
 * Validates the contact form data
 * @param {Object} formData - The contact form data
 * @returns {Object} - Validation result with isValid flag and errors array
 */
export function validateContactForm(formData) {
  const errors = [];
  
  if (!formData.name) {
    errors.push('Name is required');
  }
  
  if (!formData.email) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }
  }
  
  if (!formData.message) {
    errors.push('Message is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
