import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import BookingForm from './BookingForm.svelte';

describe('BookingForm', () => {
	const mockServices = [
		{ id: '1', name: 'Manicure', duration: 60, price: '$30' },
		{ id: '2', name: 'Pedicure', duration: 90, price: '$45' },
		{ id: '3', name: 'Gel Polish', duration: 45, price: '$25' }
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders all form fields correctly', () => {
		const { container } = render(BookingForm, {
			props: {
				services: mockServices,
				customerName: '',
				customerEmail: '',
				customerPhone: '',
				selectedService: '',
				specialRequests: '',
				isSubmitting: false
			}
		});

		expect(container.querySelector('input[type="text"]')).toBeTruthy();
		expect(container.querySelector('input[type="email"]')).toBeTruthy();
		expect(container.querySelector('input[type="tel"]')).toBeTruthy();
		expect(container.querySelector('select')).toBeTruthy();
		expect(container.querySelector('textarea')).toBeTruthy();
	});

	it('displays service options correctly', () => {
		const { container } = render(BookingForm, {
			props: {
				services: mockServices,
				customerName: '',
				customerEmail: '',
				customerPhone: '',
				selectedService: '',
				specialRequests: '',
				isSubmitting: false
			}
		});

		const serviceSelect = container.querySelector('select');
		expect(serviceSelect).toBeTruthy();
		
		// Check that all services are rendered as options
		const options = serviceSelect.querySelectorAll('option');
		expect(options.length).toBe(mockServices.length + 1); // +1 for placeholder option
	});

	it('validates required fields correctly', async () => {
		const { container } = render(BookingForm, {
			props: {
				services: mockServices,
				customerName: '',
				customerEmail: '',
				customerPhone: '',
				selectedService: '',
				specialRequests: '',
				isSubmitting: false
			}
		});

		const submitButton = container.querySelector('button[type="submit"]');
		expect(submitButton.disabled).toBe(true);

		// Fill in name
		const nameInput = container.querySelector('input[type="text"]');
		await fireEvent.input(nameInput, { target: { value: 'John Doe' } });
		expect(submitButton.disabled).toBe(true);

		// Fill in email
		const emailInput = container.querySelector('input[type="email"]');
		await fireEvent.input(emailInput, { target: { value: 'john@example.com' } });
		expect(submitButton.disabled).toBe(true);

		// Select service
		const serviceSelect = container.querySelector('select');
		await fireEvent.change(serviceSelect, { target: { value: '1' } });
		
		// Now button should be enabled
		await waitFor(() => {
			expect(submitButton.disabled).toBe(false);
		});
	});

	it('validates name field correctly', async () => {
		const { container } = render(BookingForm, {
			props: {
				services: mockServices,
				customerName: '',
				customerEmail: '',
				customerPhone: '',
				selectedService: '',
				specialRequests: '',
				isSubmitting: false
			}
		});

		const nameInput = container.querySelector('input[type="text"]');
		
		// Test short name
		await fireEvent.input(nameInput, { target: { value: 'A' } });
		await fireEvent.blur(nameInput);
		
		await waitFor(() => {
			expect(container.textContent).toContain('Name must be at least 2 characters');
		});

		// Test valid name
		await fireEvent.input(nameInput, { target: { value: 'John Doe' } });
		await fireEvent.blur(nameInput);
		
		await waitFor(() => {
			expect(container.textContent).not.toContain('Name must be at least 2 characters');
		});
	});

	it('validates email field correctly', async () => {
		const { container } = render(BookingForm, {
			props: {
				services: mockServices,
				customerName: '',
				customerEmail: '',
				customerPhone: '',
				selectedService: '',
				specialRequests: '',
				isSubmitting: false
			}
		});

		const emailInput = container.querySelector('input[type="email"]');
		
		// Test invalid email
		await fireEvent.input(emailInput, { target: { value: 'invalid-email' } });
		await fireEvent.blur(emailInput);
		
		await waitFor(() => {
			expect(container.textContent).toContain('Please enter a valid email address');
		});

		// Test valid email
		await fireEvent.input(emailInput, { target: { value: 'john@example.com' } });
		await fireEvent.blur(emailInput);
		
		await waitFor(() => {
			expect(container.textContent).not.toContain('Please enter a valid email address');
		});
	});

	it('validates phone field correctly', async () => {
		const { container } = render(BookingForm, {
			props: {
				services: mockServices,
				customerName: '',
				customerEmail: '',
				customerPhone: '',
				selectedService: '',
				specialRequests: '',
				isSubmitting: false
			}
		});

		const phoneInput = container.querySelector('input[type="tel"]');
		
		// Test invalid phone
		await fireEvent.input(phoneInput, { target: { value: 'abc123' } });
		await fireEvent.blur(phoneInput);
		
		await waitFor(() => {
			expect(container.textContent).toContain('Please enter a valid phone number');
		});

		// Test valid phone
		await fireEvent.input(phoneInput, { target: { value: '555-123-4567' } });
		await fireEvent.blur(phoneInput);
		
		await waitFor(() => {
			expect(container.textContent).not.toContain('Please enter a valid phone number');
		});
	});

	it('dispatches events correctly', async () => {
		const { component, container } = render(BookingForm, {
			props: {
				services: mockServices,
				customerName: 'John Doe',
				customerEmail: 'john@example.com',
				customerPhone: '555-123-4567',
				selectedService: '1',
				specialRequests: 'Please use gentle products',
				isSubmitting: false
			}
		});

		const mockSubmitHandler = vi.fn();
		const mockCancelHandler = vi.fn();
		component.$on('submit', mockSubmitHandler);
		component.$on('cancel', mockCancelHandler);

		// Test submit
		const form = container.querySelector('form');
		await fireEvent.submit(form);
		expect(mockSubmitHandler).toHaveBeenCalled();

		// Test cancel
		const cancelButton = container.querySelector('button[type="button"]');
		await fireEvent.click(cancelButton);
		expect(mockCancelHandler).toHaveBeenCalled();
	});

	it('disables form when isSubmitting is true', () => {
		const { container } = render(BookingForm, {
			props: {
				services: mockServices,
				customerName: 'John Doe',
				customerEmail: 'john@example.com',
				customerPhone: '555-123-4567',
				selectedService: '1',
				specialRequests: '',
				isSubmitting: true
			}
		});

		expect(container.querySelector('input[type="text"]').disabled).toBe(true);
		expect(container.querySelector('input[type="email"]').disabled).toBe(true);
		expect(container.querySelector('input[type="tel"]').disabled).toBe(true);
		expect(container.querySelector('select').disabled).toBe(true);
		expect(container.querySelector('textarea').disabled).toBe(true);
		
		const submitButton = container.querySelector('button[type="submit"]');
		expect(submitButton.disabled).toBe(true);
		expect(container.textContent).toContain('Booking...');
	});
});