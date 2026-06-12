<script>
  import BottomNav from '$lib/components/buyer/layout/BottomNav.svelte';
  import FilterSheet from '$lib/components/buyer/explore/FilterSheet.svelte';
  import { onMount } from 'svelte';
  import api from '$lib/axios';
  import { resolveImageUrl } from '$lib/utils/image';
  import { showToast } from '$lib/stores/toast.svelte.js';

  let isFilterOpen = $state(false);
  let activeFilterCount = $state(0);

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

  let activeCategory = $state('Semua');
  const categories = ['Semua', 'Konser', 'Bioskop', 'Olahraga', 'Festival'];

  let activeTab = $state('aktif');

  let activeTickets = $state([]);
  let historyTickets = $state([]);
  let refundTickets = $state([]);
  let isLoading = $state(true);
  let isGuest = $state(false);

  let statusTabs = $derived([
    { id: 'aktif', label: 'Tiket Aktif', count: activeTickets.length, icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
    { id: 'riwayat', label: 'Riwayat', count: historyTickets.length, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'refund', label: 'Refund', count: refundTickets.length, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' }
  ]);

  let expandedTickets = $state({});
  function toggleDropdown(id) {
    expandedTickets[id] = !expandedTickets[id];
  }

  onMount(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      isGuest = true;
      isLoading = false;
      return;
    }

    try {
      const response = await api.get('/tickets');
      const tickets = response.data.data || [];

      const activeList = [];
      const historyList = [];

      tickets.forEach(t => {
        const isDihantar = t.status === 'dalam_transfer';
        let priceValue = 450000;
        if (typeof t.ticket_metadata?.price === 'number') {
          priceValue = t.ticket_metadata.price;
        }

        const ticketData = {
          ...t,
          id: t.id,
          status: isDihantar ? 'Dalam Transfer' : 'Dikonfirmasi',
          statusColor: isDihantar ? 'text-orange-400' : 'text-[#D4FF00]',
          statusBg: isDihantar ? 'bg-orange-400/10' : 'bg-[#D4FF00]/10',
          statusIconPath: isDihantar
            ? 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
            : 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
          timeLeft: isDihantar ? '28d lagi' : '25d lagi',
          title: t.event?.event_name || 'Nama Event',
          ticketType: t.ticket_metadata?.type || 'Reguler',
          eventDate: new Date(t.event?.event_datetime).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          location: `${t.event?.venue_name || 'Venue'}, ${t.event?.city || 'City'}`,
          escrowLabel: isDihantar ? 'Dana Ditahan' : 'Dana Terkirim',
          escrowColor: isDihantar
            ? 'text-orange-400 border-orange-400/30 bg-orange-400/10'
            : 'text-[#D4FF00] border-[#D4FF00]/30 bg-[#D4FF00]/10',
          escrowIconPath: isDihantar
            ? 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
            : 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
          price: `Rp ${priceValue.toLocaleString('id-ID')}`,
          priceValue: priceValue,
          orderId: `TTX-2026-${t.id?.toString().padStart(5, '0') || '10132'}`,
          image: resolveImageUrl(t.event?.event_poster_url),
          category: t.event?.event_category || 'Konser'
        };

        const eventDate = new Date(t.event?.event_datetime);
        const threeDaysAfterEvent = new Date(eventDate.getTime() + 3 * 24 * 60 * 60 * 1000);
        const now = new Date();

        if (now > threeDaysAfterEvent) {
          historyList.push(ticketData);
        } else {
          activeList.push(ticketData);
        }
      });

      activeTickets = activeList;
      historyTickets = historyList;

      refundTickets = []; // Dummy data removed or replace with actual refund logic later
  } catch (e) {
    console.error('Failed to load tickets:', e);
  } finally {
    isLoading = false;
  }
});

let filteredActiveTickets = $derived(
  activeTickets.filter(ticket => {
    const matchCategory = activeCategory === 'Semua' || activeCategory === 'All' || ticket.category?.toLowerCase() === activeCategory.toLowerCase();
    const matchSearch = !searchQuery || ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || ticket.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLocation = filterCriteria.location === 'All' || ticket.location.toLowerCase().includes(filterCriteria.location.toLowerCase());
    const matchPrice = ticket.priceValue >= filterCriteria.minPrice && ticket.priceValue <= filterCriteria.maxPrice;
    return matchCategory && matchSearch && matchLocation && matchPrice;
  })
);

let filteredHistoryTickets = $derived(
  historyTickets.filter(ticket => {
    const matchCategory = activeCategory === 'Semua' || activeCategory === 'All' || ticket.category?.toLowerCase() === activeCategory.toLowerCase();
    const matchSearch = !searchQuery || ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || ticket.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLocation = filterCriteria.location === 'All' || ticket.location.toLowerCase().includes(filterCriteria.location.toLowerCase());
    const matchPrice = ticket.priceValue >= filterCriteria.minPrice && ticket.priceValue <= filterCriteria.maxPrice;
    return matchCategory && matchSearch && matchLocation && matchPrice;
  })
);

let filteredRefundTickets = $derived(
  refundTickets.filter(ticket => {
    const matchCategory = activeCategory === 'Semua' || activeCategory === 'All' || ticket.category?.toLowerCase() === activeCategory.toLowerCase();
    const matchSearch = !searchQuery || ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || ticket.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLocation = filterCriteria.location === 'All' || ticket.location.toLowerCase().includes(filterCriteria.location.toLowerCase());
    const matchPrice = ticket.priceValue >= filterCriteria.minPrice && ticket.priceValue <= filterCriteria.maxPrice;
    return matchCategory && matchSearch && matchLocation && matchPrice;
  })
);
</script>

<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-28">
  <div class="sticky top-0 z-40 bg-[#0A0910] px-4 pt-12 pb-2">
    <div class="flex justify-between items-center mb-6 h-8">
      <h1 class="text-2xl font-black text-white tracking-tight leading-none">Aktivitas</h1>
      <button onclick={() => isFilterOpen = true} class="flex items-center gap-2 px-4 py-2 rounded-full border transition-transform active:scale-95 text-sm font-semibold {activeFilterCount > 0 ? 'bg-[#2D234A] border-[#C7A4FF] text-[#C7A4FF]' : 'bg-[#1A1825] border-transparent text-gray-400'}">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
        </svg>
        Filter {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
      </button>
    </div>

    <!-- Search -->
    <div class="relative mb-6">
      <svg class="w-5 h-5 absolute left-4 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
      <input type="text" bind:value={searchQuery} placeholder="Cari event, artis, kota..." class="w-full bg-[#1A1825] text-sm text-white rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-1 focus:ring-[#D4FF00] placeholder-gray-500" />
    </div>

    <!-- Tab Bar -->
    <div class="bg-[#14121E] rounded-2xl p-1.5 flex gap-1 border border-[#232033] mb-6">
      {#each statusTabs as tab}
        <button
          class="flex-1 rounded-xl py-2.5 flex items-center justify-center gap-1.5 transition-all active:scale-95
            {activeTab === tab.id ? 'bg-[#2A2540] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}"
          onclick={() => {
            if (tab.id === 'refund') {
              showToast('Fitur ini akan segera hadir!', 'info');
            } else {
              activeTab = tab.id;
            }
          }}>
          <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={tab.icon}/>
          </svg>
          <span class="text-[11px] font-semibold">{tab.label}</span>
          <span class="w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold leading-none shrink-0
            {activeTab === tab.id ? 'bg-[#D4FF00] text-black' : 'bg-[#1A1825] text-gray-500'}">
            {tab.count}
          </span>
        </button>
      {/each}
    </div>

    <!-- Category Pills -->
    <div class="flex overflow-x-auto hide-scrollbar gap-2 mb-2">
      {#each categories as cat}
        <button
          class="px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all active:scale-95
            {activeCategory === cat
              ? 'bg-[#D4FF00] text-black shadow-[0_2px_12px_rgba(212,255,0,0.2)]'
              : 'bg-[#1A1825] text-gray-400 border border-[#232033]'}"
          onclick={() => activeCategory = cat}>
          {cat}
        </button>
      {/each}
    </div>
  </div>

  <div class="px-4 pt-4">

    <!-- Content -->
    {#if isLoading}
      <div class="flex justify-center items-center py-24">
        <div class="w-8 h-8 border-[3px] border-[#D4FF00] border-t-transparent rounded-full animate-spin"></div>
      </div>

    {:else if isGuest}
      <div class="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div class="w-16 h-16 bg-[#1A1825] border border-[#232033] rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-white mb-2">Belum Login</h2>
        <p class="text-sm text-gray-400 mb-6">Silakan masuk ke akun Anda untuk melihat tiket, riwayat, dan aktivitas terbaru.</p>
        <a href="/login" class="bg-[#D4FF00] text-black font-bold py-3 px-8 rounded-full active:scale-95 transition-transform">
          Login Sekarang
        </a>
      </div>

    {:else if activeTab === 'aktif'}
      <div class="space-y-4">
        {#if filteredActiveTickets.length === 0}
          <div class="flex flex-col items-center justify-center p-8 text-center bg-[#14121E] rounded-2xl border border-[#232033] mt-4">
            <svg class="w-12 h-12 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2z"></path></svg>
            <h3 class="text-white font-bold text-lg mb-2">Tiket Tidak Ditemukan</h3>
            <p class="text-sm text-gray-400">Maaf, kami tidak menemukan tiket yang sesuai dengan filter Anda.</p>
          </div>
        {:else}
          {#each filteredActiveTickets as ticket}
            <div class="bg-[#14121E] rounded-3xl overflow-hidden border border-[#232033]">

              <!-- Card Hero Image -->
              <div class="relative h-32">
                <img src={ticket.image} alt={ticket.title} class="absolute inset-0 w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-[#14121E] via-[#14121E]/70 to-transparent"></div>

                <!-- Status badge + timer -->
                <div class="absolute top-3 left-4 right-4 flex justify-between items-center">
                  <div class="flex items-center gap-1.5 {ticket.statusColor} {ticket.statusBg} px-2.5 py-1 rounded-full border border-current/20 text-[10px] font-bold">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={ticket.statusIconPath}/>
                    </svg>
                    {ticket.status}
                  </div>
                  <span class="text-[10px] text-gray-400 font-medium">{ticket.timeLeft}</span>
                </div>

                <!-- Title over image -->
                <div class="absolute bottom-3 left-4 right-4">
                  <h3 class="font-bold text-base text-white leading-tight">{ticket.title}</h3>
                  <p class="text-xs text-gray-400 mt-0.5 font-medium">{ticket.ticketType} · {ticket.eventDate}</p>
                </div>
              </div>

              <!-- Card Body -->
              <div class="px-4 pt-3 pb-4 space-y-3">

                <!-- Location -->
                <div class="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                  <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  </svg>
                  {ticket.location}
                </div>

                <!-- Escrow Badge -->
                <div class="rounded-xl px-3 py-2.5 flex justify-between items-center border {ticket.escrowColor}">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={ticket.escrowIconPath}/>
                    </svg>
                    <span class="text-xs font-bold">{ticket.escrowLabel}</span>
                  </div>
                  <span class="text-xs font-bold">{ticket.price}</span>
                </div>

                <!-- Order ID -->
                <p class="text-[10px] text-gray-600 font-mono font-bold">Order : {ticket.orderId}</p>

                <!-- Actions -->
                <div class="flex gap-2 pt-1">
                  <a
                    href="/my-ticket/{ticket.id}/qr"
                    class="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-[#2E2B45] bg-[#1A1825] text-white text-xs font-bold transition-transform active:scale-95">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                    </svg>
                    Lihat E-Tiket
                  </a>
                  <a
                    href="/my-ticket/{ticket.id}"
                    class="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#D4FF00] text-[#0A0910] text-xs font-bold transition-transform active:scale-95 shadow-[0_4px_16px_rgba(212,255,0,0.15)]">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                    Detail
                  </a>
                </div>

              </div>
            </div>
          {/each}
        {/if}
      </div>

    {:else if activeTab === 'riwayat'}
      <div class="space-y-4">
        {#if filteredHistoryTickets.length === 0}
          <div class="flex flex-col items-center justify-center p-8 text-center bg-[#14121E] rounded-2xl border border-[#232033] mt-4">
            <svg class="w-12 h-12 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2z"></path></svg>
            <h3 class="text-white font-bold text-lg mb-2">Tiket Tidak Ditemukan</h3>
            <p class="text-sm text-gray-400">Maaf, kami tidak menemukan tiket riwayat yang sesuai dengan filter Anda.</p>
          </div>
        {:else}
          {#each filteredHistoryTickets as history}
            <div class="bg-[#14121E] rounded-3xl overflow-hidden border border-[#232033]">
              <div
                class="p-4 flex justify-between items-center cursor-pointer hover:bg-[#1A1825]/40 transition-colors"
                onclick={() => toggleDropdown(history.id)}>
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl overflow-hidden grayscale">
                    <img src={history.image} alt="Event" class="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 class="font-bold text-sm text-white">{history.title}</h3>
                    <p class="text-[10px] text-gray-400 mt-0.5">{history.desc}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="bg-[#1A2000] border border-[#D4FF00]/30 text-[#D4FF00] px-2 py-0.5 rounded-full text-[9px] font-bold">Selesai</span>
                  <svg class="w-4 h-4 text-gray-500 transition-transform duration-300 {expandedTickets[history.id] ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>

              {#if expandedTickets[history.id]}
                <div class="px-4 pb-4 bg-[#181524] border-t border-[#232033] pt-4 space-y-2.5 text-xs">
                  <div class="flex items-center gap-1.5 text-[10px] text-gray-400">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    </svg>
                    {history.location}
                  </div>
                  <div class="bg-[#12101A] p-3 rounded-xl border border-[#232033]/50 space-y-2">
                    <div class="flex justify-between text-[11px]">
                      <span class="text-gray-400">Harga Tiket</span>
                      <span>Rp {history.price?.toLocaleString('id-ID')}</span>
                    </div>
                    <div class="flex justify-between text-[11px]">
                      <span class="text-gray-400">Biaya Layanan & Escrow</span>
                      <span>Rp {((history.serviceFee || 0) + (history.escrowFee || 0)).toLocaleString('id-ID')}</span>
                    </div>
                    <div class="flex justify-between text-[11px]">
                      <span class="text-gray-400">Metode Pembayaran</span>
                      <span class="font-medium">{history.paymentMethod}</span>
                    </div>
                    <div class="flex justify-between text-[11px] pt-1.5 border-t border-gray-800 font-bold">
                      <span>Total Dibayar</span>
                      <span class="text-[#D4FF00]">{history.totalPrice}</span>
                    </div>
                  </div>
                  <p class="text-[9px] text-gray-600 font-mono">Order ID: {history.id} · Dibeli pada {history.purchaseDate}</p>
                </div>
              {/if}

              <div class="p-4 bg-[#1A1825]/50 border-t border-[#232033]/40 flex justify-between items-center">
                <div>
                  <p class="text-[9px] text-gray-500 mb-0.5">Total Harga</p>
                  <p class="text-xs font-bold">{history.totalPrice}</p>
                </div>
                <div class="flex gap-2">
                  <a href="/invoice/{history.id}" class="px-4 py-2 rounded-xl border border-[#232033] text-gray-300 text-xs font-bold active:scale-95 transition-transform">E-Receipt</a>
                  <button class="px-4 py-2 rounded-xl bg-[#D4FF00] text-black text-xs font-bold active:scale-95 transition-transform">Beli Lagi</button>
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </div>

    {:else if activeTab === 'refund'}
      <div class="space-y-4">
        {#if filteredRefundTickets.length === 0}
          <div class="flex flex-col items-center justify-center p-8 text-center bg-[#14121E] rounded-2xl border border-[#232033] mt-4">
            <svg class="w-12 h-12 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2z"></path></svg>
            <h3 class="text-white font-bold text-lg mb-2">Tiket Tidak Ditemukan</h3>
            <p class="text-sm text-gray-400">Maaf, kami tidak menemukan tiket refund yang sesuai dengan filter Anda.</p>
          </div>
        {:else}
          {#each filteredRefundTickets as refund}
            <div class="bg-[#14121E] rounded-3xl overflow-hidden border border-[#FF3366]/30">
              <div class="p-4 border-b border-[#232033]">
                <div class="flex justify-between items-center mb-3">
                  <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold {refund.statusColor} border border-current/20">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {refund.status}
                  </div>
                  <span class="text-[10px] font-bold text-orange-400">{refund.deadline}</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-16 h-16 rounded-xl overflow-hidden">
                    <img src={refund.image} alt="Event" class="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 class="font-bold text-sm text-white">{refund.title}</h3>
                    <p class="text-[10px] text-gray-400 mt-0.5">{refund.desc}</p>
                    <div class="flex items-center gap-1 text-[9px] text-gray-500 mt-1">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      </svg>
                      {refund.location}
                    </div>
                  </div>
                </div>
              </div>
              <div class="p-4 bg-[#1A1825]/50 flex justify-between items-center">
                <div>
                  <p class="text-[9px] text-gray-500 mb-0.5">Total Harga</p>
                  <p class="text-xs font-bold">{refund.price}</p>
                </div>
                <a href="/refund/{refund.id}" class="px-5 py-2.5 rounded-xl bg-[#FF3366] text-white text-xs font-bold active:scale-95 transition-transform flex items-center gap-1.5">
                  Detail Refund
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    {/if}

  </div>

  <BottomNav activeTab="activity" />

  <FilterSheet bind:isOpen={isFilterOpen} on:apply={handleApplyFilter} />
</main>
