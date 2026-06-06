<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  let { isOpen = $bindable(false) } = $props();

  let locations = ['All', 'Jakarta', 'Tangerang', 'Bandung', 'Surabaya'];
  // Tambahkan $state()
  let activeLocation = $state('All');

  let dates = ['Any', 'This Week', 'This Month', 'June 2026', 'July 2026'];
  // Tambahkan $state()
  let activeDate = $state('Any');

  // Tambahkan $state()
  let verifiedOnly = $state(false);
  let nearEvent = $state(false);
  let maxPrice = $state(1500000);

  function applyFilter() {
    let count = 0;
    if (activeLocation !== 'all') count++;
    if (activeDate !== 'Any') count++;
    if (verifiedOnly) count++;
    if (nearEvent) count++;
    
    dispatch('apply', { 
      count, 
      filters: {
        activeLocation,
        activeDate,
        verifiedOnly,
        nearEvent,
        maxPrice
      } 
    });
    close();
  }

  function close() {
    isOpen = false;
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 bg-black/60 z-50 transition-opacity" on:click={close}></div>
  
  <div class="fixed bottom-0 w-full bg-[#1A1825] rounded-t-3xl p-6 z-50 transform transition-transform duration-300">
    <div class="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6"></div>
    
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-white">Filter</h2>
      <button on:click={close} class="w-8 h-8 bg-[#232033] rounded-full flex items-center justify-center text-gray-400">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>

    <div class="mb-6">
      <h3 class="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <svg class="w-4 h-4 text-[#D4FF00]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
        Harga Maksimal
      </h3>
      <input type="range" min="200000" max="1500000" bind:value={maxPrice} class="w-full accent-[#D4FF00] h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
      <div class="flex justify-between text-xs text-gray-400 mt-2">
        <span>Rp 200.000</span>
        <span>Rp 1.500.000</span>
      </div>
    </div>

    <div class="mb-6">
      <h3 class="text-sm font-semibold text-white mb-3 flex items-center gap-2">
        <svg class="w-4 h-4 text-[#C7A4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
        Lokasi
      </h3>
      <div class="flex flex-wrap gap-2">
        {#each locations as loc}
          <button on:click={() => activeLocation = loc} class="px-4 py-1.5 rounded-full text-xs font-medium border {activeLocation === loc ? 'bg-[#C7A4FF] text-black border-[#C7A4FF]' : 'bg-[#232033] text-gray-300 border-[#2D234A]'}">{loc}</button>
        {/each}
      </div>
    </div>

    <div class="mb-6">
      <h3 class="text-sm font-semibold text-white mb-3 flex items-center gap-2">
        <svg class="w-4 h-4 text-[#FF8A00]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        Tanggal
      </h3>
      <div class="flex flex-wrap gap-2">
        {#each dates as date}
          <button on:click={() => activeDate = date} class="px-4 py-1.5 rounded-full text-xs font-medium border {activeDate === date ? 'bg-[#FF8A00] text-black border-[#FF8A00]' : 'bg-[#232033] text-gray-300 border-[#2D234A]'}">{date}</button>
        {/each}
      </div>
    </div>

    <div class="space-y-4 mb-8">
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-300 flex items-center gap-2"><svg class="w-4 h-4 text-[#D4FF00]" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg> Verified Only</span>
        <button on:click={() => verifiedOnly = !verifiedOnly} class="w-11 h-6 rounded-full relative transition-colors {verifiedOnly ? 'bg-[#D4FF00]' : 'bg-gray-600'}">
          <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform {verifiedOnly ? 'translate-x-5' : 'translate-x-0.5'}"></div>
        </button>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-300 flex items-center gap-2"><svg class="w-4 h-4 text-[#FF8A00]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> Near Event</span>
        <button on:click={() => nearEvent = !nearEvent} class="w-11 h-6 rounded-full relative transition-colors {nearEvent ? 'bg-[#D4FF00]' : 'bg-gray-600'}">
          <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform {nearEvent ? 'translate-x-5' : 'translate-x-0.5'}"></div>
        </button>
      </div>
    </div>

    <button on:click={applyFilter} class="w-full bg-[#D4FF00] text-black font-bold py-3.5 rounded-xl mb-4">
      Terapkan Filter
    </button>
  </div>
{/if}