<script>
  let { activeTab = 'home' } = $props();

  const navItems = [
    { 
      id: 'home', 
      label: 'Beranda', 
      icon: 'M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.06 1.06l8.69-8.69zM12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z', 
      path: '/' 
    },
    { 
      id: 'explore', 
      label: 'Jelajahi', 
      icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', 
      path: '/explore' 
    },
    { 
      id: 'deals', 
      label: 'Deals', 
      icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z',
      path: '/deals' 
    },
    { 
      id: 'activity', 
      label: 'Aktivitas', 
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 002-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', 
      path: '/activity' 
    },
    { 
      id: 'profile', 
      label: 'Profil', 
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', 
      path: '/profile' 
    }
  ];
</script>

<div class="fixed bottom-0 w-full bg-[#0A0910]/95 backdrop-blur-md border-t border-[#1E1C2E] px-4 z-50 pb-[env(safe-area-inset-bottom,0.5rem)] max-w-[390px] left-1/2 -translate-x-1/2">
  <div class="flex justify-between items-end h-16">

    {#each navItems as item}
      <a href={item.path} class="relative flex flex-col items-center justify-end h-full pb-2 w-14">

        {#if item.id === 'deals'}

          {#if activeTab === 'deals'}
            <div class="absolute bottom-2 flex flex-col items-center gap-1 px-4 py-2 bg-[#AAEF45] rounded-2xl shadow-[0_4px_24px_rgba(170,239,69,0.35)] -translate-y-3">
              <div class="relative w-[36px] h-[38px] flex items-center justify-center">
                <span class="absolute rounded-full opacity-0 z-20 w-[3px] h-[3px] left-[12px] bottom-[30px] !bg-[#3a1a00] animate-fly1"></span>
                <span class="absolute rounded-full opacity-0 z-20 w-[4px] h-[4px] left-[20px] bottom-[26px] !bg-[#3a1a00] animate-fly2"></span>
                <span class="absolute rounded-full opacity-0 z-20 w-[2px] h-[2px] left-[5px] bottom-[24px] !bg-[#3a1a00] animate-fly3"></span>
                <span class="absolute rounded-full opacity-0 z-20 w-[3px] h-[3px] left-[17px] bottom-[32px] !bg-[#3a1a00] animate-fly4"></span>
                <span class="absolute rounded-full opacity-0 z-20 w-[2px] h-[2px] left-[8px] bottom-[28px] !bg-[#3a1a00] animate-fly5"></span>
                <svg class="w-[34px] h-[34px] relative z-10 origin-bottom text-[#1a0800] drop-shadow-[0_0_2px_rgba(0,0,0,0.2)] animate-fire-dark" viewBox="0 0 24 24" fill="currentColor">
                  <path d={item.icon}/>
                </svg>
              </div>
              <span class="text-[10px] font-bold text-[#0A0910]">Deals</span>
            </div>

          {:else}
            <div class="flex flex-col items-center gap-1">
              <div class="relative w-[36px] h-[38px] flex items-center justify-center">
                <span class="absolute rounded-full opacity-0 z-20 w-[3px] h-[3px] left-[12px] bottom-[30px] bg-[#ffaa00] animate-fly1"></span>
                <span class="absolute rounded-full opacity-0 z-20 w-[4px] h-[4px] left-[20px] bottom-[26px] bg-[#ff4400] animate-fly2"></span>
                <span class="absolute rounded-full opacity-0 z-20 w-[2px] h-[2px] left-[5px] bottom-[24px] bg-[#ffdd00] animate-fly3"></span>
                <span class="absolute rounded-full opacity-0 z-20 w-[3px] h-[3px] left-[17px] bottom-[32px] bg-[#ff6600] animate-fly4"></span>
                <span class="absolute rounded-full opacity-0 z-20 w-[2px] h-[2px] left-[8px] bottom-[28px] bg-[#ff2200] animate-fly5"></span>
                <svg class="w-[34px] h-[34px] relative z-10 origin-bottom [filter:drop-shadow(0_0_5px_rgba(255,80,0,0.95))_drop-shadow(0_0_12px_rgba(255,150,0,0.5))] animate-fire-blaze" viewBox="0 0 24 24" fill="currentColor">
                  <path d={item.icon}/>
                </svg>
              </div>
              <span class="text-[10px] font-semibold text-orange-500">Deals</span>
            </div>
          {/if}

        {:else}

          {#if activeTab === item.id}
            <div class="absolute bottom-2 flex flex-col items-center gap-1 px-4 py-2 bg-[#AAEF45] rounded-2xl shadow-[0_4px_24px_rgba(170,239,69,0.35)] -translate-y-3">
              <svg class="w-6 h-6 text-[#0A0910]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d={item.icon}/>
              </svg>
              <span class="text-[10px] font-bold text-[#0A0910]">{item.label}</span>
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