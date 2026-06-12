<script>
  import { page } from '$app/stores';

  // Tetap menerima props activeTab dari halaman (jika ada) sebagai fallback
  let { activeTab = '' } = $props();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Beranda',
      path: '/seller/dashboard',
      icon: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zm0 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z'
    },
    {
      id: 'produk',
      label: 'Produk',
      path: '/seller/produk',
      icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z'
    },
    {
      id: 'sell',
      label: 'Jual',
      path: '/seller/sell',
      icon: '' 
    },
    {
      id: 'orders',
      label: 'Orders',
      path: '/seller/orders',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
    },
    {
      id: 'profil',
      label: 'Profil',
      path: '/seller/profil',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    }
  ];

  // Svelte 5: Ubah path dari SvelteKit menjadi reactive state
  let currentPath = $derived($page.url.pathname);

  function isActive(item) {
    if (activeTab === item.id) return true;
    if (currentPath === item.path) return true;
    if (currentPath.startsWith(item.path + '/')) return true;
    if (item.id === 'profil' && (currentPath === '/seller/profile' || currentPath.startsWith('/seller/profile/'))) return true;
    return false;
  }
</script>

<div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-[#0A0910]/95 backdrop-blur-md border-t border-[#1E1C2E] px-4 z-50 pb-[env(safe-area-inset-bottom,0.5rem)]">
  <div class="flex justify-between items-end h-16">
    
    {#each navItems as item (item.id)}
      <a href={item.path} class="relative flex flex-col items-center justify-end h-full pb-2 w-14 group">
        
        {#if item.id === 'sell'}
          <div class="absolute bottom-3 flex flex-col items-center justify-center gap-1 transition-transform group-hover:scale-105 active:scale-95">
            {#if isActive(item)}
              <div class="flex items-center justify-center w-[48px] h-[48px] bg-[#AAEF45] rounded-xl shadow-[0_4px_16px_rgba(170,239,69,0.3)] border-[4px] border-[#0A0910]">
                <svg class="w-6 h-6 text-[#0A0910]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 4v16m8-8H4"/>
                </svg>
              </div>
              <span class="text-[10px] font-bold text-[#AAEF45] -mt-1">Jual</span>
            {:else}
              <div class="flex items-center justify-center w-[48px] h-[48px] bg-black rounded-xl border-[4px] border-[#0A0910] shadow-lg">
                <svg class="w-6 h-6 text-[#AAEF45]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 4v16m8-8H4"/>
                </svg>
              </div>
              <span class="text-[10px] font-semibold text-gray-500 group-hover:text-gray-300 transition-colors -mt-1">Jual</span>
            {/if}
          </div>

        {:else}
          
          {#if isActive(item)}
            
            <div class="absolute bottom-2 flex flex-col items-center gap-1 px-4 py-2 bg-[#AAEF45] rounded-2xl shadow-[0_4px_24px_rgba(170,239,69,0.35)] -translate-y-3">
              <svg class="w-6 h-6 text-[#0A0910]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d={item.icon}/>
              </svg>
              <span class="text-[10px] font-bold text-[#0A0910]">{item.label}</span>
            </div>

          {:else}
            <div class="flex flex-col items-center gap-1 transition-colors group-hover:text-gray-300">
              <svg class="w-6 h-6 text-gray-500 group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d={item.icon}/>
              </svg>
              <span class="text-[10px] font-semibold text-gray-500 group-hover:text-gray-300 transition-colors">{item.label}</span>
            </div>
          {/if}

        {/if}
      </a>
    {/each}

  </div>
</div>
