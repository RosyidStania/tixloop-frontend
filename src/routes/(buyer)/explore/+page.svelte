<script>
  import { onMount } from 'svelte';
  import api from '$lib/axios';
  import BottomNav from '$lib/components/buyer/layout/BottomNav.svelte';
  import FilterSheet from '$lib/components/buyer/explore/FilterSheet.svelte';

  import { page } from '$app/stores';

  // Menggunakan Svelte 5 Runes
  let activeCategory = $state($page.url.searchParams.get('category') || 'Semua');
  const categories = ['Semua', 'Konser', 'Bioskop', 'Olahraga', 'Festival'];
  
  let isFilterOpen = $state(false);
  let activeFilterCount = $state(0);
  
  let listings = $state([]);
  let isLoading = $state(true);

  let searchQuery = $state($page.url.searchParams.get('q') || '');
  
  let filterCriteria = $state({
    location: 'All',
    date: 'Any',
    verifiedOnly: false,
    nearEvent: false,
    maxPrice: 1500000
  });
  
  let filteredListings = $derived(
    listings.filter(item => {
      const matchCategory = activeCategory === 'Semua' || activeCategory === 'All' || item.ticket?.event?.category?.toLowerCase() === activeCategory.toLowerCase();
      const matchSearch = !searchQuery || 
        item.ticket?.event?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ticket?.event?.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ticket?.event?.city?.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchLocation = filterCriteria.location === 'All' || item.ticket?.event?.city?.toLowerCase() === filterCriteria.location.toLowerCase();
      const matchPrice = item.current_asking_price <= filterCriteria.maxPrice;
      const matchVerified = !filterCriteria.verifiedOnly || item.verification_status === 'verified';
      
      return matchCategory && matchSearch && matchLocation && matchPrice && matchVerified;
    })
  );

  onMount(async () => {
    try {
      const response = await api.get('/marketplace/listings?per_page=50');
      listings = response.data.data || response.data || [];
    } catch (error) {
      console.error('Failed to load listings', error);
    } finally {
      isLoading = false;
    }
  });

  function handleApplyFilter(event) {
    activeFilterCount = event.detail.count;
    if (event.detail.filters) {
      filterCriteria = {
        location: event.detail.filters.activeLocation,
        date: event.detail.filters.activeDate,
        verifiedOnly: event.detail.filters.verifiedOnly,
        nearEvent: event.detail.filters.nearEvent,
        maxPrice: event.detail.filters.maxPrice
      };
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };
</script>

<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-24 overflow-x-hidden pt-12">
  <div class="px-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Jelajahi</h1>
      <button on:click={() => isFilterOpen = true} class="flex items-center gap-2 px-4 py-2 rounded-full border transition-colors {activeFilterCount > 0 ? 'bg-[#2D234A] border-[#C7A4FF] text-[#C7A4FF]' : 'bg-[#1A1825] border-transparent text-gray-400'}">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
        <span class="text-sm font-semibold">Filter {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
      </button>
    </div>

    <div class="relative mb-6">
      <svg class="w-5 h-5 absolute left-4 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
      <input type="text" bind:value={searchQuery} placeholder="Cari event, artis, kota..." class="w-full bg-[#1A1825] text-sm text-white rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-1 focus:ring-[#D4FF00] placeholder-gray-500" />
    </div>

    <div class="flex overflow-x-auto hide-scrollbar gap-3 mb-6">
      {#each categories as cat}
        <button 
          class="px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors {activeCategory === cat ? 'bg-[#D4FF00] text-black' : 'bg-[#1A1825] text-gray-400'}"
          on:click={() => activeCategory = cat}>
          {cat}
        </button>
      {/each}
    </div>

    {#if isLoading}
      <div class="flex justify-center p-8">
        <div class="w-8 h-8 border-4 border-[#D4FF00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    {:else}
      {#if activeFilterCount > 0 || filteredListings.length > 0}
        <p class="text-sm text-[#A89EC4] mb-4">{filteredListings.length} tiket ditemukan</p>
      {/if}

      {#if filteredListings.length === 0}
        <div class="flex flex-col items-center justify-center p-8 text-center bg-[#14121E] rounded-2xl border border-[#232033] mt-4">
          <svg class="w-12 h-12 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3 class="text-white font-bold text-lg mb-2">Tiket Tidak Ditemukan</h3>
          <p class="text-sm text-gray-400">Maaf, kami tidak menemukan tiket yang sesuai dengan filter Anda. Silakan ubah filter untuk mencari tiket lainnya.</p>
        </div>
      {:else}
      <div class="space-y-4">
        {#each filteredListings as item}
          <a href="/ticket/{item.id}" class="bg-[#14121E] rounded-2xl p-4 flex gap-4 border border-[#232033] relative block transition-all active:scale-[0.98] hover:border-[#3E3166]">
            
            <button class="absolute top-4 right-4 text-gray-500 hover:text-[#FF3366] z-10" on:click|preventDefault={() => { /* logika save wishlist */ }}>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </button>

            <img src={item.event_poster_url || item.ticket?.event?.event_poster_url || item.ticket?.event?.poster_url || "https://picsum.photos/seed/picsum/200/200"} class="w-24 h-24 rounded-xl object-cover" alt={item.ticket?.event?.name || 'Concert'} />

            
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5 mb-1.5">
                <span class="text-[10px] text-gray-400 truncate max-w-[80px]">🎵 {item.ticket?.event?.category || 'Event'}</span>
                <svg class="w-3.5 h-3.5 text-[#D4FF00] shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                <svg class="w-3 h-3 text-[#C7A4FF] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              </div>
              
              <h3 class="font-bold text-sm mb-1 truncate">{item.ticket?.event?.name || 'Event Tidak Diketahui'}</h3>
              <p class="text-[10px] text-[#A89EC4] mb-2 truncate">Penjual: {item.seller?.name || 'Tidak Diketahui'}</p>
              
              <div class="flex items-center gap-1 text-[9px] text-gray-400 mb-1 truncate">
                <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {item.ticket?.event?.date ? new Date(item.ticket.event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
              </div>
              <div class="flex items-center gap-1 text-[9px] text-gray-400 mb-3 truncate">
                <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                {item.ticket?.event?.venue || '-'}, {item.ticket?.event?.city || '-'}
              </div>

              <div class="flex justify-between items-center">
                <p class="text-[#D4FF00] font-bold text-sm tracking-wide truncate pr-2">{formatCurrency(item.current_asking_price)}</p>
                <div class="flex items-center gap-1 text-[10px] font-semibold text-gray-300 shrink-0">
                  <svg class="w-3 h-3 text-[#D4FF00]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  4.8
                </div>
              </div>
            </div>
          </a>
        {/each}
      </div>
      {/if}
    {/if}
  </div>

  <BottomNav activeTab="explore" />
  
  <FilterSheet bind:isOpen={isFilterOpen} on:apply={handleApplyFilter} />
</main>

<style>
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
