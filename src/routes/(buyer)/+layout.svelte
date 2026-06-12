<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let { children } = $props();

	$effect(() => {
		if (browser) {
			const token = localStorage.getItem('token');
			const currentPath = $page.url.pathname;
			
			const isAuthPath = ['/login', '/register'].includes(currentPath);

			// Jika sudah login tapi buka halaman login/register, redirect ke beranda (/)
			if (token && isAuthPath) {
				goto('/');
			}
			
			// Halaman checkout, my-ticket, refund mewajibkan login
			const requiresAuth = currentPath.startsWith('/checkout') || currentPath.startsWith('/my-ticket') || currentPath.startsWith('/refund') || currentPath.startsWith('/invoice');
			if (!token && requiresAuth) {
				goto('/login');
			}
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
