<script>
  let { activeTab = 'home' } = $props();

  const navItems = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: 'M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.06 1.06l8.69-8.69zM12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z', 
      path: '/' 
    },
    { 
      id: 'explore', 
      label: 'Explore', 
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
      label: 'Activity', 
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 002-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', 
      path: '/activity' 
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', 
      path: '/profile' 
    }
  ];
</script>

<!-- Navbar wrapper: tinggi tetap 64px, tidak berubah saat tab apapun aktif -->
<div class="fixed bottom-0 w-full bg-[#0A0910]/95 backdrop-blur-md border-t border-[#1E1C2E] px-4 z-50 pb-safe">
  <div class="flex justify-between items-end h-16">

    {#each navItems as item}
      <!-- Setiap tab punya tinggi penuh h-16, posisi konten dari bawah -->
      <a href={item.path} class="relative flex flex-col items-center justify-end h-full pb-2 w-14">

        <!-- ── DEALS TAB ── -->
        {#if item.id === 'deals'}

          {#if activeTab === 'deals'}
            <!-- Deals AKTIF: pill hijau, absolute agar tidak pengaruhi tinggi -->
            <div class="absolute bottom-2 flex flex-col items-center gap-1 px-4 py-2 bg-[#AAEF45] rounded-2xl shadow-[0_4px_24px_rgba(170,239,69,0.35)] -translate-y-3">
              <div class="fire-wrap">
                <span class="spark s1 dark"></span>
                <span class="spark s2 dark"></span>
                <span class="spark s3 dark"></span>
                <span class="spark s4 dark"></span>
                <span class="spark s5 dark"></span>
                <svg class="fire-svg fire-dark" viewBox="0 0 24 24" fill="currentColor">
                  <path d={item.icon}/>
                </svg>
              </div>
              <span class="text-[10px] font-bold text-[#0A0910]">Deals</span>
            </div>

          {:else}
            <!-- Deals TIDAK AKTIF -->
            <div class="flex flex-col items-center gap-1">
              <div class="fire-wrap">
                <span class="spark s1"></span>
                <span class="spark s2"></span>
                <span class="spark s3"></span>
                <span class="spark s4"></span>
                <span class="spark s5"></span>
                <svg class="fire-svg fire-blaze" viewBox="0 0 24 24" fill="currentColor">
                  <path d={item.icon}/>
                </svg>
              </div>
              <span class="text-[10px] font-semibold text-orange-500">Deals</span>
            </div>
          {/if}

        <!-- ── TAB LAINNYA ── -->
        {:else}

          {#if activeTab === item.id}
            <!-- Aktif: pill hijau, absolute agar tidak pengaruhi tinggi navbar -->
            <div class="absolute bottom-2 flex flex-col items-center gap-1 px-4 py-2 bg-[#AAEF45] rounded-2xl shadow-[0_4px_24px_rgba(170,239,69,0.35)] -translate-y-3">
              <svg class="w-6 h-6 text-[#0A0910]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d={item.icon}/>
              </svg>
              <span class="text-[10px] font-bold text-[#0A0910]">{item.label}</span>
            </div>

          {:else}
            <!-- Tidak aktif: abu-abu statis -->
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

  .fire-wrap {
    position: relative;
    width: 36px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fire-svg {
    width: 34px;
    height: 34px;
    position: relative;
    z-index: 2;
    transform-origin: bottom center;
  }

  .fire-blaze {
    animation:
      blazeColor 1.4s ease-in-out infinite alternate,
      fireWobble 0.8s ease-in-out infinite alternate;
    filter:
      drop-shadow(0 0 5px rgba(255, 80, 0, 0.95))
      drop-shadow(0 0 12px rgba(255, 150, 0, 0.5));
  }

  .fire-dark {
    color: #1a0800;
    animation: fireWobble 0.8s ease-in-out infinite alternate;
    filter: drop-shadow(0 0 2px rgba(0,0,0,0.2));
  }

  .spark {
    position: absolute;
    border-radius: 50%;
    opacity: 0;
    z-index: 3;
  }

  .s1 { width: 3px; height: 3px; left: 12px; bottom: 30px; background: #ffaa00; animation: fly1 1.1s ease-in infinite 0.0s; }
  .s2 { width: 4px; height: 4px; left: 20px; bottom: 26px; background: #ff4400; animation: fly2 0.95s ease-in infinite 0.25s; }
  .s3 { width: 2px; height: 2px; left: 5px;  bottom: 24px; background: #ffdd00; animation: fly3 1.3s ease-in infinite 0.55s; }
  .s4 { width: 3px; height: 3px; left: 17px; bottom: 32px; background: #ff6600; animation: fly4 0.85s ease-in infinite 0.1s; }
  .s5 { width: 2px; height: 2px; left: 8px;  bottom: 28px; background: #ff2200; animation: fly5 1.15s ease-in infinite 0.4s; }

  .dark { background: #3a1a00 !important; }

  @keyframes blazeColor {
    0%   { color: #ff1a00; }
    25%  { color: #ff6600; }
    50%  { color: #ffaa00; }
    75%  { color: #ff4400; }
    100% { color: #ff2200; }
  }

  @keyframes fireWobble {
    0%   { transform: scaleY(1)    scaleX(1)    rotate(-1.5deg); }
    30%  { transform: scaleY(1.07) scaleX(0.95) rotate(1.5deg);  }
    60%  { transform: scaleY(0.96) scaleX(1.05) rotate(-1deg);   }
    100% { transform: scaleY(1.04) scaleX(0.98) rotate(2deg);    }
  }

  @keyframes fly1 {
    0%   { opacity: 0;   transform: translate(0, 0)     scale(1);   }
    15%  { opacity: 1; }
    100% { opacity: 0;   transform: translate(-5px, -20px) scale(0.2); }
  }
  @keyframes fly2 {
    0%   { opacity: 0;   transform: translate(0, 0)    scale(1);   }
    15%  { opacity: 0.9; }
    100% { opacity: 0;   transform: translate(6px, -24px) scale(0.2); }
  }
  @keyframes fly3 {
    0%   { opacity: 0;   transform: translate(0, 0)     scale(1);   }
    20%  { opacity: 1; }
    100% { opacity: 0;   transform: translate(-3px, -18px) scale(0.3); }
  }
  @keyframes fly4 {
    0%   { opacity: 0;   transform: translate(0, 0)    scale(1);   }
    10%  { opacity: 0.8; }
    100% { opacity: 0;   transform: translate(4px, -22px) scale(0.2); }
  }
  @keyframes fly5 {
    0%   { opacity: 0;   transform: translate(0, 0)     scale(1);   }
    25%  { opacity: 1; }
    100% { opacity: 0;   transform: translate(-6px, -16px) scale(0.25); }
  }
</style>