<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import api from '$lib/axios';
  import BottomNav from '$lib/components/admin/layout/BottomNav.svelte';

  let activeTab = $state('Pending');
  let searchQuery = $state('');
  let mounted = $state(false);
  let pollingInterval;
  
  /** @type {any[]} */
  let pendingListings = $state([]);
  /** @type {any[]} */
  let verifiedListings = $state([]);
  /** @type {any[]} */
  let rejectedListings = $state([]);
  let rejectedCount = $state(0);
  
  /** @type {any[]} */
  let tickets = $state([]);
  let isLoading = $state(true);

  onMount(async () => {
    mounted = true;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        goto('/login');
        return;
      }
      
      const userRes = await api.get('/auth/me');
      const user = userRes.data.data || userRes.data;
      if (user.email !== 'admin@tixloop.com') {
        goto('/home');
        return;
      }

      await fetchData();
    } catch (err) {
      console.error(err);
      goto('/login');
    } finally {
      isLoading = false;
    }
    
    // Refresh data when user switches back to this tab
    const handleFocus = () => fetchData();
    window.addEventListener('focus', handleFocus);
    
    pollingInterval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      if (pollingInterval) clearInterval(pollingInterval);
    };
  });

  async function fetchData() {
    try {
      const [pendingRes, verifiedRes, wasteRes] = await Promise.all([
        api.get('/admin/listings'),
        api.get('/marketplace/listings'),
        api.get('/dashboard/waste')
      ]);

      const sellerDeletedIds = [];

      const extractListings = (resData) => Array.isArray(resData) ? resData : (Array.isArray(resData?.data) ? resData.data : []);

      const pendingData = extractListings(pendingRes.data.data);
      pendingListings = pendingData
        .filter(listing => !sellerDeletedIds.includes(String(listing.id)) && !sellerDeletedIds.includes(String(listing.ticket?.id)))
        .map(listing => mapListing(listing, 'Pending'));
      
      const rejectedIds = [];
      
      const verifiedData = extractListings(verifiedRes.data.data);
      verifiedListings = verifiedData
        .map(listing => mapListing(listing, 'Terverifikasi'));
      
      rejectedListings = [];
      
      rejectedCount = wasteRes.data.data.listings_breakdown.rejected_listings;
      
      tickets = [...pendingListings, ...verifiedListings];
      
    } catch (err) {
      console.error('Error fetching fraud data', err);
    }
  }

  function mapListing(listing, status) {
    const tcode = listing?.ticket?.ticket_code || 'TKT-' + listing.id.substring(0, 5).toUpperCase();
    const eventName = listing?.ticket?.event?.name || 'Unknown Event';
    const seat = listing?.ticket?.seat_number || 'Regular';
    const date = listing.created_at || listing.listed_at || new Date().toISOString();

    return {
      id: tcode,
      listing_id: listing.id,
      name: listing?.seller?.name || 'Unknown',
      event: eventName,
      category: seat,
      gate: 'Gate ' + (tcode.charAt(tcode.length - 1).toUpperCase() || 'A'),
      time: new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
      status: status
    };
  }

  let stats = $derived([
    { label: 'Pending', value: pendingListings.length, class: 'text-amber-500 border-amber-500/20 bg-amber-500/10', icon: 'clock' },
    { label: 'Terverifikasi', value: verifiedListings.length, class: 'text-[#C2F04B] border-[#C2F04B]/20 bg-[#C2F04B]/10', icon: 'check' },
    { label: 'Ditolak', value: rejectedCount, class: 'text-red-500 border-red-500/20 bg-red-500/10', icon: 'x-circle' },
  ]);

  const tabs = ['Semua', 'Pending', 'Terverifikasi', 'Ditolak'];

  let filteredTickets = $derived(activeTab === 'Semua'
    ? tickets
    : tickets.filter(t => t.status === activeTab));

  let displayTickets = $derived(searchQuery
    ? filteredTickets.filter(t =>
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.event.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredTickets);
</script>

<main class="bg-[#06060E] min-h-screen text-white font-sans pb-24 transition-opacity duration-500 {mounted ? 'opacity-100' : 'opacity-0'}">
  <!-- Search -->
  <div class="px-4 pt-4 mb-4">
    <div class="relative">
      <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input type="text" placeholder="Cari pengguna, tiket..." bind:value={searchQuery} class="w-full bg-[#14121E] border border-[#232033] rounded-2xl py-3 pl-11 pr-4 text-sm text-gray-200 outline-none focus:border-indigo-500/40 focus:bg-[#1A1825] transition-colors placeholder-gray-500" />
    </div>
  </div>

  <!-- Dashboard Header -->
  <div class="px-5 pt-4 pb-1">
    <h1 class="text-xl font-bold text-white tracking-tight">Deteksi Fraud</h1>
    <p class="text-xs text-gray-400 font-medium mt-0.5">Pantau dan investigasi indikasi penipuan transaksi</p>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-3 gap-3 px-4 mb-5">
    {#each stats as stat}
      <div class="bg-[#14121E] border border-[#232033] rounded-2xl py-3 px-2 flex flex-col items-center gap-1.5 hover:-translate-y-0.5 transition">
        <div class="w-8 h-8 rounded-full flex items-center justify-center border {stat.class}">
          {#if stat.icon === 'clock'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {:else if stat.icon === 'check'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          {:else}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          {/if}
        </div>
        <span class="text-xl font-extrabold text-white leading-none tracking-tight">{stat.value}</span>
        <span class="text-[10px] font-semibold text-gray-400">{stat.label}</span>
      </div>
    {/each}
  </div>

  <!-- Tabs -->
  <div class="flex overflow-x-auto hide-scrollbar gap-2 px-4 mb-4">
    {#each tabs as tab}
      <button 
        class="px-4 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors {activeTab === tab ? 'bg-[#C2F04B] text-[#06060E]' : 'bg-[#14121E] border border-[#232033] text-gray-400'}"
        onclick={() => (activeTab = tab)}
      >
        {tab}
      </button>
    {/each}
  </div>

  <!-- Ticket List -->
  <div class="px-4 flex flex-col gap-3">
    {#each displayTickets as ticket}
      <button 
        class="bg-[#14121E] border border-[#232033] rounded-2xl p-4 text-left w-full hover:-translate-y-0.5 hover:border-white/10 transition flex flex-col gap-3"
        onclick={() => goto('/admin/fraud/ticket/' + ticket.listing_id)}
      >
        <!-- Header -->
        <div class="flex justify-between items-start">
          <div class="flex gap-2.5">
            <span class="w-2 h-2 rounded-full mt-1.5 shrink-0 {ticket.status === 'Pending' ? 'bg-amber-500' : ticket.status === 'Terverifikasi' ? 'bg-[#C2F04B]' : 'bg-red-500'}"></span>
            <div>
              <div class="text-sm font-bold text-gray-100">{ticket.id}</div>
              <div class="text-xs text-gray-400">{ticket.name}</div>
            </div>
          </div>
          <span class="text-[10px] font-medium text-gray-500 whitespace-nowrap">{ticket.time}</span>
        </div>

        <!-- Meta -->
        <div class="grid grid-cols-3 gap-2">
          <div class="flex flex-col gap-1">
            <span class="text-[10px] text-gray-500">Event</span>
            <span class="text-xs font-medium text-gray-300 truncate">{ticket.event}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[10px] text-gray-500">Kategori</span>
            <span class="text-xs font-bold text-gray-100">{ticket.category}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[10px] text-gray-500">Gate</span>
            <span class="text-xs font-bold text-gray-100">{ticket.gate}</span>
          </div>
        </div>
      </button>
    {/each}

    {#if displayTickets.length === 0}
      <div class="flex flex-col items-center justify-center py-12 gap-3 text-center text-gray-500">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
        <p class="text-sm">Tidak ada tiket ditemukan</p>
      </div>
    {/if}
  </div>
  
  <BottomNav activeTab="fraud" />
</main>

