<script>
  import BottomNav from '$lib/components/buyer/layout/BottomNav.svelte';
  import FilterSheet from '$lib/components/buyer/explore/FilterSheet.svelte';
  import { resolveImageUrl } from '$lib/utils/image';

  import { onMount } from 'svelte';
  import api from '$lib/axios';

  let isFilterOpen = $state(false);
  let activeFilterCount = $state(0);
  let isLoading = $state(true);

  let filterCriteria = $state({
    location: 'All',
    date: 'Any',
    verifiedOnly: false,
    nearEvent: false,
    minPrice: 0,
    maxPrice: 1500000
  });

  let searchQuery = $state('');

  function handleApplyFilter(event) {
    activeFilterCount = event.detail.count;
    if (event.detail.filters) {
      filterCriteria = {
        location: event.detail.filters.activeLocation,
        date: event.detail.filters.activeDate,
        verifiedOnly: event.detail.filters.verifiedOnly,
        nearEvent: event.detail.filters.nearEvent,
        minPrice: event.detail.filters.minPrice || 0,
        maxPrice: event.detail.filters.maxPrice
      };
    }
  }

  let activeFilter = $state('Semua');
  const filters = ['Semua', 'Konser', 'Bioskop', 'Olahraga', 'Events'];

  let dealsTickets = $state([]);

  onMount(async () => {
    try {
      const response = await api.get('/marketplace/listings?deals=true');
      const listings = response.data.data || response.data;
      
      const sellerListingIds = JSON.parse(localStorage.getItem('seller_all_listing_ids') || '[]').map(String);
      const publishedIds = JSON.parse(localStorage.getItem('seller_published_tickets') || '[]').map(String);

      const filteredListings = listings.filter(item => {
        if (sellerListingIds.includes(String(item.id))) {
           return publishedIds.includes(String(item.id));
        }
        return true;
      });
      
      dealsTickets = filteredListings
        .map(l => {
          const dropAmount = l.original_price - l.current_asking_price;
          const dropPercentage = Math.round((dropAmount / l.original_price) * 100);
          
          return {
            id: l.id,
            category: l.ticket?.event?.category || 'Events',
            title: l.ticket?.event?.event_name || 'Acara',
            artist: 'Berbagai Artis', // Backend event might not have an artist string, fallback
            venue: `${l.ticket?.event?.venue_name || 'Venue'}, ${l.ticket?.event?.city || 'Kota'}`,
            originalPrice: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(l.original_price),
            currentPrice: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(l.current_asking_price),
            priceDropAmount: `Turun Rp ${dropAmount.toLocaleString('id-ID')} (${dropPercentage}%)`,
            priceDropTime: 'Baru saja', // Bisa disesuaikan dengan updated_at
            timeLeft: 'Tersedia', // Countdown mock
            distance: '2.1 km', // Mock distance
            image: resolveImageUrl(l.ticket?.event?.event_poster_url),
            priceValue: l.current_asking_price
          };
        });
    } catch (error) {
      console.error('Failed to load deals tickets:', error);
    } finally {
      isLoading = false;
    }
  });

  let filteredDealsTickets = $derived(
    dealsTickets.filter(ticket => {
      const matchCategory = activeFilter === 'Semua' || activeFilter === 'All' || ticket.category.toLowerCase() === activeFilter.toLowerCase();
      const matchSearch = !searchQuery || 
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.artist.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchLocation = filterCriteria.location === 'All' || ticket.venue.toLowerCase().includes(filterCriteria.location.toLowerCase());
      const matchPrice = ticket.priceValue >= filterCriteria.minPrice && ticket.priceValue <= filterCriteria.maxPrice;
      
      return matchCategory && matchSearch && matchLocation && matchPrice;
    })
  );
</script>

<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-28 overflow-x-hidden">

  <div class="sticky top-0 z-40 bg-[#0A0910] px-4 pt-12 pb-2">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 h-8">
      <h1 class="text-2xl font-black text-white tracking-tight leading-none">Last Minute Deals</h1>
      <button on:click={() => isFilterOpen = true} class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-colors {activeFilterCount > 0 ? 'bg-[#2D234A] border-[#C7A4FF] text-[#C7A4FF]' : 'bg-[#1E1530] text-[#A67CFF] border-[#3B2A5A]'}">
        <!-- Funnel/filter icon -->
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
        </svg>
        Filter {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
      </button>
    </div>

    <div class="relative mb-6">
        <svg class="w-5 h-5 absolute left-4 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input type="text" bind:value={searchQuery} placeholder="Cari event, artis, kota..." class="w-full bg-[#1A1825] text-sm text-white rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-1 focus:ring-[#D4FF00] placeholder-gray-500" />
    </div>

    <!-- Filter Pills -->
    <div class="flex overflow-x-auto hide-scrollbar gap-2.5 mb-5">
      {#each filters as filter}
        <button
          class="px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors
            {activeFilter === filter
              ? 'bg-[#D4FF00] text-black'
              : 'bg-[#13111D] text-gray-400 border border-[#1E1C2E]'}"
          on:click={() => activeFilter = filter}
        >
          {filter}
        </button>
      {/each}
    </div>
  </div>

  <div class="px-4">
    <!-- Ticket Cards -->
    <div class="space-y-4">
      {#if isLoading}
        <div class="flex justify-center items-center py-24">
          <div class="w-8 h-8 border-[3px] border-[#D4FF00] border-t-transparent rounded-full animate-spin"></div>
        </div>
      {:else if filteredDealsTickets.length === 0}
        <div class="flex flex-col items-center justify-center p-8 text-center bg-[#14121E] rounded-2xl border border-[#232033] mt-4">
          <svg class="w-12 h-12 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2z"></path></svg>
          <h3 class="text-white font-bold text-lg mb-2">Tiket Tidak Ditemukan</h3>
          <p class="text-sm text-gray-400">Maaf, kami tidak menemukan tiket yang sesuai dengan filter Anda. Silakan ubah filter untuk mencari tiket lainnya.</p>
        </div>
      {:else}
        {#each filteredDealsTickets as ticket}
          <div class="bg-[#13111D] rounded-3xl overflow-hidden border border-[#1E1C2E]">

            <!-- Image Section -->
            <div
              class="h-44 bg-cover bg-center relative"
              style="background-image: url('{ticket.image}');"
            >
              <!-- Gradient overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-[#13111D] via-transparent to-transparent"></div>

              <!-- Verified Badge -->
              <div class="absolute top-3 left-3">
                <span class="bg-[#D4FF00] text-black text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  Terverifikasi
                </span>
              </div>

              <!-- Timer & Distance -->
              <div class="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                <!-- Countdown timer -->
                <div class="bg-[#E93B5C] text-white text-[12px] font-bold px-3.5 py-2 rounded-full flex items-center gap-1.5 shadow-lg">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {ticket.timeLeft}
                </div>
                <!-- Distance -->
                <div class="text-white text-[11px] flex items-center gap-1 font-semibold drop-shadow-md pb-0.5">
                  <!-- Send/navigation icon rotated -->
                  <svg class="w-3.5 h-3.5 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                  </svg>
                  {ticket.distance}
                </div>
              </div>
            </div>

            <!-- Card Body -->
            <div class="px-4 pt-3.5 pb-4">

              <!-- Category -->
              <div class="flex items-center gap-1 text-[10px] text-gray-400 font-bold mb-1">
                <span>🎵</span>
                <span>{ticket.category}</span>
              </div>

              <!-- Title -->
              <h3 class="font-bold text-sm text-white mb-1 truncate">{ticket.title}</h3>
              <!-- Artist -->
              <p class="text-xs text-[#A89EC4] font-medium mb-3 truncate">Penjual: {ticket.artist}</p>

              <!-- Venue -->
              <div class="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium mb-4">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span class="truncate">{ticket.venue}</span>
              </div>

              <!-- Price Drop Banner -->
              <div class="flex items-center justify-between bg-[#1E1019] border border-[#3D1E28] px-3 py-2.5 rounded-xl mb-4">
                <div class="flex items-center gap-2">
                  <!-- Trending down icon -->
                  <svg class="w-4 h-4 text-[#E67E42]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
                  </svg>
                  <span class="text-[#E67E42] text-[11px] font-semibold">{ticket.priceDropAmount}</span>
                  <span class="text-gray-500 text-[10px]">{ticket.priceDropTime}</span>
                </div>
                <!-- Status dot -->
                <div class="w-2 h-2 bg-[#E67E42] rounded-full"></div>
              </div>

              <!-- Price & CTA -->
              <div class="flex justify-between items-center">
                <div class="flex flex-col min-w-0 pr-2">
                  <p class="text-[#D4FF00] font-bold text-base tracking-wide truncate">
                    {ticket.currentPrice}
                  </p>
                  <p class="text-[10px] text-gray-500 line-through mt-0.5 truncate">{ticket.originalPrice}</p>
                </div>
                <a href="/checkout/{ticket.id}" class="bg-[#D4FF00] text-black text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-[#bce600] active:scale-95 transition-all">
                  Beli Sekarang
                </a>
              </div>

            </div>
          </div>
        {/each}
      {/if}
    </div>

  </div>

  <BottomNav activeTab="deals" />

  <FilterSheet bind:isOpen={isFilterOpen} on:apply={handleApplyFilter} />
</main>

