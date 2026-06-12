<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import BottomNav from '$lib/components/seller/layout/BottomNav.svelte';
  import api from '$lib/axios';
  import { showToast } from '$lib/stores/toast.svelte.js';

  let seller = $state({
    name: 'Memuat...',
    email: '...',
    verified: false,
    avatar: '?',
    stats: {
      sold: 24,
      rating: 4.9,
      reviews: 18,
    },
  });

  onMount(async () => {
    try {
      const response = await api.get('/auth/me');
      const userData = response.data.data.user || response.data.data;
      
      seller.name = userData.name || 'Seller';
      seller.email = userData.email || '';
      seller.avatar = (userData.name || 'S').charAt(0).toUpperCase();
      seller.verified = !!userData.email_verified_at;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      if (error.response?.status === 401) {
        goto('/login');
      }
    }
  });

  const menuItems = [
    {
      id: 'bank',
      label: 'Bank & Payout',
      icon: `<rect x="1" y="7" width="16" height="10" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M1 10H17" stroke="currentColor" stroke-width="1.8"/><path d="M5 7V5C5 3.9 6.8 3 9 3C11.2 3 13 3.9 13 5V7" stroke="currentColor" stroke-width="1.8"/>`
    },
    {
      id: 'security',
      label: 'Security',
      icon: `<path d="M9 1L2 4.5V9C2 12.7 5.1 16.1 9 17C12.9 16.1 16 12.7 16 9V4.5L9 1Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M6 9L8 11L12 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`
    },
    {
      id: 'help',
      label: 'Help Center',
      icon: `<circle cx="9" cy="9" r="8" stroke="currentColor" stroke-width="1.8"/><path d="M6.5 6.5C6.5 5.1 7.6 4 9 4C10.4 4 11.5 5.1 11.5 6.5C11.5 7.6 10.8 8.5 9.8 8.8C9.3 9 9 9.4 9 9.9V10.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="13" r="1" fill="currentColor"/>`
    },
  ];

  let isSwitching = $state(false);

  async function handleSwitchToBuyer() {
    if (isSwitching) return;
    isSwitching = true;
    // Simulasi loading sebentar agar feel-nya responsif
    await new Promise(r => setTimeout(r, 400));
    // Arahkan ke halaman beranda pembeli
    goto('/'); 
  }
</script>

<BottomNav activeTab="profil" />

<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-24">
  
  <div class="px-4 pt-12 pb-3 flex items-center justify-between">
    <h1 class="text-xl font-bold text-white tracking-tight">Seller Profile</h1>
    <button class="w-9 h-9 bg-[#1A1825] rounded-full flex items-center justify-center relative active:scale-95 transition-transform">
      <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
      </svg>
      <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-[#AAEF45] rounded-full border border-[#0A0910]"></span>
    </button>
  </div>

  <div class="px-4 space-y-5">
    
    <div class="bg-[#14121E] border border-[#232033] rounded-2xl p-4 space-y-4">
      
      <div class="flex items-center gap-3">
        <div class="w-14 h-14 rounded-2xl bg-[#AAEF45] flex items-center justify-center shrink-0">
          <span class="text-2xl font-black text-[#0A0910]">{seller.avatar}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5">
            <p class="text-sm font-bold text-white truncate">{seller.name}</p>
            {#if seller.verified}
              <svg class="w-4 h-4 text-[#AAEF45] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            {/if}
          </div>
          <p class="text-xs text-gray-500 font-medium mt-0.5 truncate">{seller.email}</p>
          <span class="inline-block mt-1 text-[10px] font-bold bg-[#AAEF45]/15 text-[#AAEF45] px-2 py-0.5 rounded-full border border-[#AAEF45]/25">
            Verified Seller
          </span>
        </div>
      </div>

      <div class="h-px bg-[#232033]"></div>

      <div class="flex justify-around items-center">
        <div class="flex flex-col items-center gap-1 flex-1">
          <span class="text-xl font-black text-[#E6C83D] tracking-tight leading-none">{seller.stats.sold}</span>
          <span class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Sold</span>
        </div>
        
        <div class="w-px h-8 bg-[#232033]"></div>
        
        <div class="flex flex-col items-center gap-1 flex-1">
          <span class="text-xl font-black text-[#E6C83D] tracking-tight leading-none">{seller.stats.rating}</span>
          <span class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Rating</span>
        </div>
        
        <div class="w-px h-8 bg-[#232033]"></div>
        
        <div class="flex flex-col items-center gap-1 flex-1">
          <span class="text-xl font-black text-[#A88FE6] tracking-tight leading-none">{seller.stats.reviews}</span>
          <span class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Reviews</span>
        </div>
      </div>
      
    </div>

    <button
      onclick={handleSwitchToBuyer}
      disabled={isSwitching}
      class="w-full bg-[#C4A8FF]/10 border border-[#C4A8FF]/25 rounded-2xl py-3.5 flex items-center justify-center gap-2 active:scale-[0.98] transition-all {isSwitching ? 'opacity-70' : ''}"
    >
      {#if isSwitching}
        <svg class="w-4 h-4 animate-spin text-[#C4A8FF]" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <span class="text-sm font-bold text-[#C4A8FF]">Beralih...</span>
      {:else}
        <svg class="w-4 h-4 text-[#C4A8FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        <span class="text-sm font-bold text-[#C4A8FF]">Kembali ke Buyer Mode</span>
      {/if}
    </button>

    <div>
      <p class="text-xs font-bold text-gray-500 uppercase mb-3">Manajemen Toko</p>
      <div class="bg-[#14121E] border border-[#232033] rounded-2xl overflow-hidden">
        {#each menuItems as item, i}
          <button onclick={() => showToast('Fitur ini akan segera hadir!', 'info')} class="w-full flex items-center gap-3 px-4 py-3.5 active:bg-[#1A1825] transition-colors {i < menuItems.length - 1 ? 'border-b border-[#1E1C2E]' : ''}">
            <div class="w-8 h-8 rounded-xl bg-[#1A1825] flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" class="text-gray-400">
                {@html item.icon}
              </svg>
            </div>
            <span class="flex-1 text-sm font-semibold text-white text-left">{item.label}</span>
            <svg class="w-4 h-4 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        {/each}
      </div>
    </div>

  </div>
</main>