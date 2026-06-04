<script>
  import { goto } from '$app/navigation';
  import BottomNav from '$lib/components/seller/layout/BottomNav.svelte';

  let seller = $state({
    name: 'Andi Prasetyo',
    verified: true,
    avatar: 'A',
    stats: {
      sold: 24,
      rating: 4.9,
      reviews: 18,
    },
  });

  const menuItems = [
    {
      id: 'bank',
      label: 'Bank & Payout',
      icon: `<rect x="1" y="7" width="16" height="10" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M1 10H17" stroke="currentColor" stroke-width="1.4"/><path d="M5 7V5C5 3.9 6.8 3 9 3C11.2 3 13 3.9 13 5V7" stroke="currentColor" stroke-width="1.4"/>`
    },
    {
      id: 'security',
      label: 'Security',
      icon: `<path d="M9 1L2 4.5V9C2 12.7 5.1 16.1 9 17C12.9 16.1 16 12.7 16 9V4.5L9 1Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M6 9L8 11L12 7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`
    },
    {
      id: 'help',
      label: 'Help Center',
      icon: `<circle cx="9" cy="9" r="8" stroke="currentColor" stroke-width="1.4"/><path d="M6.5 6.5C6.5 5.1 7.6 4 9 4C10.4 4 11.5 5.1 11.5 6.5C11.5 7.6 10.8 8.5 9.8 8.8C9.3 9 9 9.4 9 9.9V10.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="9" cy="13" r="0.8" fill="currentColor"/>`
    },
  ];

  let isSwitching = $state(false);

  async function handleSwitchToBuyer() {
    if (isSwitching) return;
    isSwitching = true;
    // Simulasi loading sebentar agar feel-nya responsif
    await new Promise(r => setTimeout(r, 400));
    // Arahkan ke halaman beranda pembeli (sesuaikan rutenya)
    goto('/home'); 
  }
</script>

<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-28">
  
  <div class="px-5 pt-14 pb-6">
    <h1 class="text-[26px] font-bold text-white tracking-tight">Seller Profile</h1>
    <p class="text-[13px] text-gray-500 mt-1">Manage akun seller kamu</p>
  </div>

  <div class="px-5 space-y-4">
    
    <div class="bg-[#1C1C1E] border border-white/5 rounded-[18px] p-5 shadow-lg">
      
      <div class="flex items-center gap-3.5">
        <div class="w-[52px] h-[52px] rounded-full bg-[#AAEF45] flex items-center justify-center shrink-0">
          <span class="text-[22px] font-bold text-[#1A1825]">{seller.avatar}</span>
        </div>
        
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-1.5">
            <span class="text-base font-bold text-white">{seller.name}</span>
            {#if seller.verified}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="9" fill="#AAEF45"/>
                <path d="M5 9L7.5 11.5L13 6.5" stroke="#1a1a1a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            {/if}
          </div>
          <span class="text-[12px] font-medium text-gray-400">Verified Seller</span>
        </div>
      </div>

      <div class="h-px bg-white/5 my-[18px]"></div>

      <div class="flex justify-around items-center">
        <div class="flex flex-col items-center gap-1 flex-1">
          <span class="text-[22px] font-bold text-[#E6C83D] tracking-tight leading-none">{seller.stats.sold}</span>
          <span class="text-[12px] font-medium text-gray-500">Sold</span>
        </div>
        
        <div class="w-px h-8 bg-white/5"></div>
        
        <div class="flex flex-col items-center gap-1 flex-1">
          <span class="text-[22px] font-bold text-[#E6C83D] tracking-tight leading-none">{seller.stats.rating}</span>
          <span class="text-[12px] font-medium text-gray-500">Rating</span>
        </div>
        
        <div class="w-px h-8 bg-white/5"></div>
        
        <div class="flex flex-col items-center gap-1 flex-1">
          <span class="text-[22px] font-bold text-[#A88FE6] tracking-tight leading-none">{seller.stats.reviews}</span>
          <span class="text-[12px] font-medium text-gray-500">Reviews</span>
        </div>
      </div>
      
    </div>

    <div class="bg-[#1C1C1E] border border-white/5 rounded-[18px] py-1 shadow-lg">
      {#each menuItems as item, i}
        <button class="w-full flex items-center justify-between px-[18px] py-4 active:bg-white/5 transition-colors group">
          <div class="flex items-center gap-3.5">
            <div class="w-5 flex items-center justify-center text-[#888] group-hover:text-gray-300 transition-colors">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                {@html item.icon}
              </svg>
            </div>
            <span class="text-[14px] font-medium text-[#CCCCCC] group-hover:text-white transition-colors">{item.label}</span>
          </div>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none" class="text-[#444] group-hover:text-gray-400 transition-colors">
            <path d="M1 1L7 7L1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        {#if i < menuItems.length - 1}
          <div class="mx-[18px] h-px bg-white/5"></div>
        {/if}
      {/each}
    </div>

    <button
      onclick={handleSwitchToBuyer}
      disabled={isSwitching}
      class="w-full mt-2 bg-[#2A1F5C] hover:bg-[#321F70] text-[#C4A8FF] rounded-[18px] py-[18px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all {isSwitching ? 'opacity-70' : ''}"
    >
      {#if isSwitching}
        <svg class="w-4 h-4 animate-spin text-[#C4A8FF]" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <span class="text-[15px] font-semibold tracking-wide">Beralih...</span>
      {:else}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="text-[#C4A8FF]">
          <path d="M10 2L4 8L10 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="text-[15px] font-semibold tracking-wide">Kembali ke Buyer Mode</span>
      {/if}
    </button>

  </div>
</main>

<BottomNav activeTab="profile" />