<script>
  import { page } from '$app/stores';

  let { activeTab = '' } = $props();

  const navItems = [
    { id: 'dashboard', label: 'Beranda', icon: 'ti-layout-grid', path: '/admin/dashboard' },
    { id: 'fraud',     label: 'Fraud',     icon: 'ti-shield-exclamation', path: '/admin/fraud' },
    { id: 'profile',  label: 'Profil',  icon: 'ti-user', path: '/admin/profile' },
  ];

  let currentActive = $derived(activeTab || $page.url.pathname.split('/')[2] || 'dashboard');
</script>

<svelte:head>
  <link href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css" rel="stylesheet" />
</svelte:head>

<div class="fixed bottom-0 w-full bg-[#06060E]/95 backdrop-blur-md border-t border-[#1E1C2E] px-4 z-50 pb-[env(safe-area-inset-bottom,0.5rem)] max-w-[390px] left-1/2 -translate-x-1/2">
  <div class="flex justify-around items-end h-16">
    {#each navItems as item}
      <a href={item.path} class="relative flex flex-col items-center justify-end h-full pb-2 w-14">
        {#if currentActive === item.id}
          <div class="absolute bottom-2 flex flex-col items-center gap-1 px-4 py-2 bg-[#C2F04B] rounded-2xl shadow-[0_4px_24px_rgba(194,240,75,0.35)] -translate-y-3">
            <i class="ti {item.icon} text-xl text-[#06060E]"></i>
            <span class="text-[10px] font-bold text-[#06060E]">{item.label}</span>
          </div>
        {:else}
          <div class="flex flex-col items-center gap-1">
            <i class="ti {item.icon} text-xl text-gray-500"></i>
            <span class="text-[10px] font-semibold text-gray-500">{item.label}</span>
          </div>
        {/if}
      </a>
    {/each}
  </div>
</div>