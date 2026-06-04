<script>
  let { activeTab = 'dashboard' } = $props();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/seller/dashboard',
      icon: 'M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z'
    },
    {
      id: 'listings',
      label: 'Listings',
      path: '/seller/listings',
      icon: 'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01'
    },
    {
      id: 'sell',
      label: 'Sell',
      path: '/seller/sell',
      icon: null // Menggunakan custom SVG di dalam loop agar sesuai desain awal tiket putus Anda
    },
    {
      id: 'orders',
      label: 'Orders',
      path: '/seller/orders',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
    },
    {
      id: 'profile',
      label: 'Profile',
      path: '/seller/profile',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    }
  ];
</script>

<div class="fixed bottom-0 w-full bg-[#0A0910]/95 backdrop-blur-md border-t border-[#1E1C2E] px-4 z-50 pb-safe">
  <div class="flex justify-between items-end h-16">

    {#each navItems as item}
      <a href={item.path} class="relative flex flex-col items-center justify-end h-full pb-2 w-14">

        {#if item.id === 'sell'}

          {#if activeTab === 'sell'}
            <div class="absolute bottom-2 flex flex-col items-center gap-1 px-4 py-2 bg-[#AAEF45] rounded-2xl shadow-[0_4px_24px_rgba(170,239,69,0.35)] -translate-y-3">
              <svg class="w-6 h-6 text-[#0A0910]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 9a1 1 0 011-1h18a1 1 0 011 1v1a2 2 0 010 4v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-1a2 2 0 010-4V9z"/>
                <line x1="12" y1="8" x2="12" y2="16" stroke-dasharray="2 2"/>
              </svg>
              <span class="text-[10px] font-bold text-[#0A0910]">Sell</span>
            </div>
          {:else}
            <div class="flex flex-col items-center gap-1">
              <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 9a1 1 0 011-1h18a1 1 0 011 1v1a2 2 0 010 4v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-1a2 2 0 010-4V9z"/>
                <line x1="12" y1="8" x2="12" y2="16" stroke-dasharray="2 2"/>
              </svg>
              <span class="text-[10px] font-semibold text-gray-500">Sell</span>
            </div>
          {/if}

        {:else}

          {#if activeTab === item.id}
            <div class="absolute bottom-2 flex flex-col items-center gap-1 px-4 py-2 bg-[#AAEF45] rounded-2xl shadow-[0_4px_24px_rgba(170,239,69,0.35)] -translate-y-3">
              <svg class="w-6 h-6 text-[#0A0910]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d={item.icon}/>
              </svg>
              <span class="text-[10px] font-bold text-[#0A0910] whitespace-nowrap">{item.label}</span>
            </div>
          {:else}
            <div class="flex flex-col items-center gap-1">
              <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d={item.icon}/>
              </svg>
              <span class="text-[10px] font-semibold text-gray-500">{item.label}</span>
            </div>
          {/if}

        {/if}

      </a>
    {/each}

  </div>
</div>

<style>
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom, 0.5rem);
  }
</style>