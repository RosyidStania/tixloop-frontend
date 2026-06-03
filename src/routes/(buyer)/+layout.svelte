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
			
			const publicPaths = ['/login', '/register'];
			const isPublicPath = publicPaths.includes(currentPath);

			// Jika tidak ada token dan bukan di halaman publik, redirect ke login
			if (!token && !isPublicPath) {
				goto('/login');
			}

			// Jika sudah login tapi buka halaman login/register, redirect ke home
			if (token && isPublicPath) {
				goto('/home');
			}
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
