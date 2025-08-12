<script>
	import { onMount, onDestroy } from 'svelte';
	
	export let animationType = 'fade'; // fade, slide-up, slide-down, slide-left, slide-right, scale, rotate
	export let threshold = 0.1; // Percentage of element visible before animation triggers (0.1 = 10%)
	export let delay = 0; // Delay in milliseconds before animation starts
	export const duration = 600; // Animation duration in milliseconds
	export const easing = 'ease-out'; // CSS easing function
	export const stagger = 0; // Delay between children animations in milliseconds
	export let once = true; // Whether animation should only happen once
	
	let element;
	let observer;
	let hasAnimated = false;
	let isVisible = false;
	
	function createObserver() {
		const options = {
			root: null,
			rootMargin: '0px',
			threshold: threshold
		};
		
		observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					isVisible = true;
					if (!hasAnimated || !once) {
						hasAnimated = true;
						setTimeout(() => {
							if (element) element.classList.add('animate-in');
						}, delay);
					}
				} else {
					if (!once) {
						isVisible = false;
						hasAnimated = false;
						if (element) {
							element.classList.remove('animate-in');
						}
					}
				}
			});
		}, options);
		
		if (element) observer.observe(element);
	}
	
	onMount(() => {
		createObserver();
	});
	
	onDestroy(() => {
		if (observer) observer.disconnect();
	});
</script>

<div 
	bind:this={element}
	class={`transition-all duration-600 ease-out ${!isVisible ? 'opacity-0' : 'opacity-100'} transform ${animationType === 'slide-up' ? (!isVisible ? 'translate-y-8' : 'translate-y-0') : ''} ${animationType === 'slide-down' ? (!isVisible ? '-translate-y-8' : 'translate-y-0') : ''} ${animationType === 'slide-left' ? (!isVisible ? '-translate-x-8' : 'translate-x-0') : ''} ${animationType === 'slide-right' ? (!isVisible ? 'translate-x-8' : 'translate-x-0') : ''} ${animationType === 'scale' ? (!isVisible ? 'scale-90' : 'scale-100') : ''} ${animationType === 'rotate' ? (!isVisible ? 'rotate-12' : 'rotate-0') : ''}`}
>
	<slot />
</div>

<style>
	/* Additional custom styles can be added here */
</style>
