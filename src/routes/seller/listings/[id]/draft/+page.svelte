<script>
  import { goto } from '$app/navigation';

  // Simulasi data listing dari route param
  let listing = $state({
    title: 'Jazz Festival 2026',
    category: 'VIP',
    harga: '850.000',
    views: 234,
    watchers: 12
  });

  let isWithdrawing = $state(false);

  async function handleWithdraw() {
    if (isWithdrawing) return;
    isWithdrawing = true;
    await new Promise(r => setTimeout(r, 900));
    isWithdrawing = false;
    goto('/seller/listings');
  }

  function handleClose() {
    goto('/seller/listings');
  }
</script>

<!-- Backdrop / Page background -->
<div class="min-h-screen bg-[#0A0910] flex items-end sm:items-center justify-center px-4 pb-8 pt-8">
  <!-- Sheet / Modal Container -->
  <div class="w-full max-w-md bg-[#14121E] border border-[#232033] rounded-3xl overflow-hidden shadow-2xl">
    
    <!-- Handle bar (for mobile feel) -->
    <div class="flex justify-center pt-3 pb-1 sm:hidden">
      <div class="w-10 h-1 rounded-full bg-[#2a2840]"></div>
    </div>

    <div class="px-5 pb-6 pt-2 space-y-5">
      <!-- Warning icon + title -->
      <div class="flex flex-col items-center text-center gap-3 pt-2">
        <div class="w-14 h-14 rounded-full bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
          <svg class="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div>
          <p class="text-base font-black text-white">Draft Listing?</p>
          <p class="text-[12px] text-gray-500 mt-1 leading-relaxed">
            Listing akan ditarik dari marketplace dan disimpan sebagai draft
          </p>
        </div>
      </div>

      <!-- Listing summary card -->
      <div class="bg-[#1A1825] border border-[#2a2840] rounded-2xl px-4 py-3 flex items-center justify-between">
        <div>
          <p class="text-sm font-bold text-white">{listing.title}</p>
          <p class="text-[11px] text-gray-500 mt-0.5">{listing.category}</p>
        </div>
        <p class="text-sm font-black text-[#AAEF45]">Rp {listing.harga}</p>
      </div>

      <!-- Warning banner -->
      <div class="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 flex items-start gap-2.5">
        <svg class="w-4 h-4 text-orange-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <div>
          <p class="text-[12px] font-bold text-orange-400">Perhatian</p>
          <p class="text-[11px] text-orange-300/70 mt-0.5 leading-relaxed">
            {listing.watchers} watcher akan kehilangan akses ke listing ini. Stats views dan watchers akan direset.
          </p>
        </div>
      </div>

      <!-- Current stats -->
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-[#1A1825] border border-[#2a2840] rounded-xl p-3 text-center">
          <p class="text-[10px] text-gray-600 mb-1">Current Views</p>
          <p class="text-xl font-black text-white">{listing.views}</p>
        </div>
        <div class="bg-[#1A1825] border border-[#2a2840] rounded-xl p-3 text-center">
          <p class="text-[10px] text-gray-600 mb-1">Current Watchers</p>
          <p class="text-xl font-black text-white">{listing.watchers}</p>
        </div>
      </div>

      <!-- Buttons -->
      <div class="grid grid-cols-2 gap-3">
        <button
          onclick={handleClose}
          class="py-3.5 rounded-2xl bg-[#1A1825] border border-[#2a2840] text-sm font-bold text-gray-300 active:scale-95 transition-transform"
        >
          Batal
        </button>
        <button
          onclick={handleWithdraw}
          disabled={isWithdrawing}
          class="py-3.5 rounded-2xl bg-orange-500 text-white text-sm font-bold active:scale-95 transition-transform shadow-[0_4px_16px_rgba(249,115,22,0.3)] {isWithdrawing ? 'opacity-70' : ''}"
        >
          {#if isWithdrawing}
            <span class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Menarik...
            </span>
          {:else}
            Withdraw
          {/if}
        </button>
      </div>

    </div>
  </div>
</div>