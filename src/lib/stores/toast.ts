import { writable } from 'svelte/store';

export const toastStore = writable([]);

export function addToast(toast) {
	const id = Math.random().toString(36).substr(2, 9);
	const toastWithId = { ...toast, id };
	
	toastStore.update(toasts => [...toasts, toastWithId]);
	
	// Auto-remove toast after timeout
	if (toast.timeout !== false) {
		setTimeout(() => {
			removeToast(id);
		}, toast.timeout || 4000);
	}
	
	return id;
}

export function removeToast(id) {
	toastStore.update(toasts => toasts.filter(t => t.id !== id));
}

export function clearToasts() {
	toastStore.set([]);
}

// Convenience functions
export function showSuccess(message, timeout = 4000) {
	return addToast({
		message,
		background: 'variant-filled-success',
		timeout
	});
}

export function showError(message, timeout = 6000) {
	return addToast({
		message,
		background: 'variant-filled-error',
		timeout
	});
}

export function showWarning(message, timeout = 5000) {
	return addToast({
		message,
		background: 'variant-filled-warning',
		timeout
	});
}

export function showInfo(message, timeout = 4000) {
	return addToast({
		message,
		background: 'variant-filled-primary',
		timeout
	});
}