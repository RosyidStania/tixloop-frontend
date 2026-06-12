<script>
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
  import api from '$lib/axios';
  import BottomNav from '$lib/components/seller/layout/BottomNav.svelte';
  import { ticketService } from '$lib/services/api/ticketService';
  import { marketplaceService } from '$lib/services/api/marketplaceService';
  import { showToast } from '$lib/stores/toast.svelte.js';

  // Menggunakan Svelte 5 Runes
  let currentSubTab = $state('dijual');
  let isLoading = $state(true);
  let error = $state(null);
  
  let showConfirmModal = $state(false);
  let confirmMessage = $state('');
  let confirmAction = $state(() => {});

  // Initialize tab from url if available (pindah ke bawah di onMount utama)

  const tabs = [
    { id: 'dijual', label: 'Dijual' },
    { id: 'koleksi', label: 'Koleksi' },
    { id: 'terjual', label: 'Terjual' },
  ];

  let dijualItems = $state([]);
  let koleksiItems = $state([]);
  let terjualItems = $state([]);

  let showRelistModal = $state(false);
  let relistItem = $state(null);
  let relistPrice = $state('');
  let relistAutoDrop = $state(true);
  let pollingInterval;

  async function fetchProduk() {
    try {
      const ticketsRes = await ticketService.getMyTickets();
      const listingsRes = await marketplaceService.getMyListings(); 

      if (ticketsRes?.success) {
        const allTickets = ticketsRes.data || [];
        const listingsResData = listingsRes?.success ? (listingsRes.data || []) : [];
        const listedTicketIds = listingsResData.map(l => l.ticket?.id);
        
        koleksiItems = allTickets
           .filter(t => (t.status === 'available' || !t.is_listed) && !listedTicketIds.includes(t.id))
           .map(mapTicketToUI);
           
        let ticketSold = allTickets.filter(t => t.status === 'sold' || t.status === 'terjual').map(mapTicketToUI);
        terjualItems = [...ticketSold];
      }

      if (listingsRes?.success) {
         const allListings = listingsRes.data || [];
         
         const pendingListings = allListings.filter(l => l.verification_status === 'pending');
         const verifiedListings = allListings.filter(l => l.verification_status === 'verified');
         const rejectedListingsLocal = allListings.filter(l => l.verification_status === 'rejected');
         
         // 1. Dijual = Verified AND Not Sold
         dijualItems = verifiedListings
            .filter(l => l.listing_status !== 'terjual' && l.listing_status !== 'sold')
            .map(mapListingToUI);
            
         // Tambahkan listing yang terjual ke tab Terjual
         const soldListings = allListings
            .filter(l => l.listing_status === 'terjual' || l.listing_status === 'sold')
            .map(l => ({ ...mapListingToUI(l), statusLabel: 'Terjual', isListing: true }));
         
         const soldListingTicketIds = soldListings.map(l => l.ticket_id || l.id);
         terjualItems = [
            ...soldListings, 
            ...terjualItems.filter(t => !soldListingTicketIds.includes(t.id))
         ];
            
         // 2. Koleksi = Pending dan Rejected
         const pendingToUI = pendingListings.map(l => ({ ...mapListingToUI(l), isVerified: false, statusLabel: 'Menunggu Verifikasi', isListing: true }));
         const rejectedToUI = rejectedListingsLocal.map(l => ({ ...mapListingToUI(l), isVerified: false, statusLabel: 'Ditolak', isListing: true }));

         koleksiItems = [...koleksiItems, ...pendingToUI, ...rejectedToUI];
      }
    } catch (err) {
      console.error('Error memuat data produk:', err);
      error = err.message || 'Gagal memuat produk dari backend.';
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    const queryTab = get(page).url.searchParams.get('tab');
    if (queryTab && ['dijual', 'koleksi', 'terjual'].includes(queryTab)) {
      currentSubTab = queryTab;
    }
    
    fetchProduk();
    pollingInterval = setInterval(fetchProduk, 5000);
  });

  onDestroy(() => {
    if (pollingInterval) clearInterval(pollingInterval);
  });

  function mapTicketToUI(ticket) {
    return {
      id: ticket.id,
      title: ticket.event?.event_name || ticket.event?.name || ticket.event_name || 'Ticket Event',
      type: ticket.event?.event_category || ticket.event?.category || ticket.category || 'Reguler',
      harga: ticket.price ? `Rp ${Number(ticket.price).toLocaleString('id-ID')}` : 'Belum Dijual',
      dilihat: 0,
      favorit: 0,
      isVerified: false, // Tiket mentah dari koleksi tidak pernah 'Terverifikasi' untuk listing resale
      isListing: false
    };
  }

  function mapListingToUI(listing) {
    return {
      id: listing.id,
      ticket_id: listing.ticket?.id || listing.ticket_id,
      raw_price: listing.current_asking_price || listing.price,
      title: listing.ticket?.event?.name || listing.ticket?.event?.event_name || listing.event_name || 'Listing Event',
      type: listing.ticket?.type || listing.ticket?.event?.category || listing.ticket_category || 'Reguler',
      harga: listing.current_asking_price ? `Rp ${Number(listing.current_asking_price).toLocaleString('id-ID')}` : (listing.price ? `Rp ${Number(listing.price).toLocaleString('id-ID')}` : 'Rp 0'),
      dilihat: listing.views || 0,
      favorit: listing.favorites || 0
    };
  }

  let searchQuery = $state('');
  let showSearch = $state(false);

  // Derive data items berdasarkan tab yang aktif
  let items = $derived(
    (currentSubTab === 'dijual' ? dijualItems : 
     currentSubTab === 'koleksi' ? koleksiItems : 
     terjualItems).filter(item => {
       if (!searchQuery) return true;
       const q = searchQuery.toLowerCase();
       return (item.title && item.title.toLowerCase().includes(q)) || 
              (item.type && item.type.toLowerCase().includes(q));
     })
  );

  function handleEdit(item) { showToast(`Edit: ${item.title}`); }
  async function handleHapus(item) { 
    confirmMessage = `Batalkan penjualan tiket ini?`;
    confirmAction = async () => {
       showConfirmModal = false;
       try {
         await api.delete(`/marketplace/listings/${item.id}`);
         showToast('Penjualan tiket berhasil dibatalkan.');
         location.reload();
       } catch (err) {
         console.error('Gagal membatalkan penjualan:', err);
         const errorMsg = err.response?.data?.message || 'Gagal membatalkan penjualan. Pastikan tiket belum terjual atau tidak ada transaksi aktif.';
         showToast(errorMsg, 'error');
       }
    };
    showConfirmModal = true;
  }

  function handleJual(item) { 
    if (!item.isListing) {
       location.href = `/seller/sell/data-tiket`;
    }
  }

  function handleRelist(item) {
    relistItem = item;
    relistPrice = item.raw_price || '';
    relistAutoDrop = true;
    showRelistModal = true;
  }

  async function submitRelist() {
    try {
      await api.post(`/marketplace/listings`, {
        ticket_id: relistItem.ticket_id || relistItem.id,
        asking_price: relistPrice,
        is_auto_drop: relistAutoDrop
      });
      showToast('Tiket berhasil direlist dan sedang diproses.');
      showRelistModal = false;
      location.reload();
    } catch (err) {
      console.error('Gagal relist tiket:', err);
      showToast(err.response?.data?.message || 'Gagal merekam tiket ulang.', 'error');
    }
  }
</script>

<BottomNav activeTab="produk" />

<main class="bg-[#0A0910] min-h-screen w-full text-white font-sans pb-28">
  
  <div class="px-4 pt-12 mb-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-black text-white tracking-tight">Produk Saya</h1>
        <p class="text-sm text-gray-400 mt-1">Kelola tiket yang kamu jual</p>
      </div>
      <button 
        class="w-10 h-10 rounded-full flex items-center justify-center border transition-all active:scale-95 {showSearch ? 'bg-[#D4FF00] text-black border-[#D4FF00]' : 'bg-[#1A1825] text-gray-400 border-[#232033] hover:text-white'}"
        onclick={() => showSearch = !showSearch}
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {#if showSearch}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          {:else}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          {/if}
        </svg>
      </button>
    </div>

    {#if showSearch}
      <div class="relative mt-5">
        <svg class="w-5 h-5 absolute left-4 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input type="text" bind:value={searchQuery} placeholder="Cari nama event atau tiket..." class="w-full bg-[#1A1825] text-sm text-white rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-1 focus:ring-[#D4FF00] placeholder-gray-500" />
      </div>
    {/if}
  </div>

  <div class="flex gap-3 mb-6 px-4 overflow-x-auto hide-scrollbar">
    {#each tabs as tab}
      <button
        class="px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2
        {currentSubTab === tab.id 
          ? 'bg-[#D4FF00] text-black font-bold' 
          : 'bg-[#1A1825] text-gray-400 hover:text-white'}"
        onclick={() => currentSubTab = tab.id}
      >
        {tab.label}
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold {currentSubTab === tab.id ? 'bg-black/15 text-black' : 'bg-gray-800 text-gray-400'}">
          {tab.id === 'dijual' ? dijualItems.length : tab.id === 'koleksi' ? koleksiItems.length : terjualItems.length}
        </span>
      </button>
    {/each}
  </div>

  <div class="px-4 flex flex-col gap-4">
    {#if isLoading}
      <div class="flex justify-center p-12">
        <div class="w-8 h-8 border-4 border-[#D4FF00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    {:else if items.length === 0}
      <div class="flex flex-col items-center justify-center p-8 text-center bg-[#14121E] rounded-2xl border border-[#232033] mt-2">
        <svg class="w-12 h-12 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2z"></path></svg>
        <h3 class="text-white font-bold text-lg mb-2">Belum Ada Tiket</h3>
        <p class="text-sm text-gray-400">Tidak ada data tiket untuk kategori ini. Coba cek kategori lainnya atau mulai jual tiketmu.</p>
      </div>
    {:else}
      {#each items as item (item.id)}
        <div class="bg-[#14121E] rounded-2xl p-4 border border-[#232033] transition-all hover:border-[#3E3166] relative">
          
          <div class="flex justify-between items-start mb-4">
            <div>
              <div class="flex items-center gap-1.5 mb-1.5 flex-wrap">
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">🎵 {item.type}</span>
                {#if currentSubTab === 'koleksi'}
                  {#if item.statusLabel === 'Ditolak'}
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF3366]/20 text-[#FF3366] border border-[#FF3366]/30">Ditolak</span>
                  {:else if item.isVerified || item.statusLabel === 'Terverifikasi'}
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4FF00]/20 text-[#D4FF00] border border-[#D4FF00]/30">Terverifikasi</span>
                  {:else if item.statusLabel === 'Menunggu Verifikasi'}
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/30">Menunggu Verifikasi</span>
                  {/if}
                {/if}
              </div>
              <h2 class="text-sm font-bold text-white tracking-tight leading-tight mb-1">{item.title}</h2>
            </div>
            <button class="text-gray-500 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-3 gap-3 mb-4 p-3 bg-[#0A0910] rounded-xl border border-[#232033]">
            <div class="flex flex-col gap-0.5">
              <span class="text-[10px] text-gray-500 font-medium">Harga</span>
              <span class="text-sm font-bold text-[#D4FF00] truncate">{item.harga}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-[10px] text-gray-500 font-medium">Dilihat</span>
              <span class="text-xs font-semibold text-white">{item.dilihat} x</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-[10px] text-gray-500 font-medium">Favorit</span>
              <span class="text-xs font-semibold text-white">{item.favorit}</span>
            </div>
          </div>

          <div class="flex gap-2.5">
            {#if currentSubTab === 'dijual'}
              <button class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 bg-[#FF3366]/10 text-[#FF3366] border border-[#FF3366]/20 hover:bg-[#FF3366]/20" onclick={() => handleHapus(item)}>Batalkan Penjualan</button>
            
            {:else if currentSubTab === 'koleksi'}
              {#if item.statusLabel === 'Ditolak'}
                <button class="flex-1 py-2.5 rounded-xl text-sm font-bold bg-[#1A1825] text-[#FF3366] border border-[#232033]" disabled>Ditolak</button>
              {:else if item.statusLabel === 'Terverifikasi' || item.isVerified}
                <button class="flex-1 py-2.5 rounded-xl text-sm font-bold bg-[#1A1825] text-gray-500 border border-[#232033]" disabled>Sedang Dijual</button>
              {:else if item.statusLabel === 'Menunggu Verifikasi'}
                <button class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 bg-[#1A1825] text-gray-300 border border-[#232033]" disabled>Menunggu Verifikasi...</button>
              {:else}
                 <button class="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 bg-[#D4FF00] text-black hover:opacity-90" onclick={() => handleJual(item)}>Jual Tiket</button>
              {/if}
            
            {:else if currentSubTab === 'terjual'}
              <button class="flex-1 py-2.5 rounded-xl text-sm font-bold bg-[#1A1825] text-gray-500 border border-[#232033]" disabled>Tiket Terjual</button>
            {/if}
          </div>

        </div>
      {/each}
    {/if}
  </div>

  <!-- Relist Modal -->
  {#if showRelistModal}
    <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-[#14121E] border border-[#232033] rounded-2xl w-full max-w-[340px] p-5 shadow-2xl">
        <h3 class="text-lg font-bold text-gray-100 mb-2">Ajukan Ulang Tiket</h3>
        <p class="text-sm text-gray-400 mb-4">Ubah detail dan ajukan ulang tiket untuk direview admin.</p>
        
        <div class="mb-4">
          <label class="block text-xs font-medium text-gray-400 mb-1.5">Harga Jual Baru</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
            <input type="number" bind:value={relistPrice} class="w-full bg-[#0A0910] border border-[#232033] rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#D4FF00] transition-colors" placeholder="0">
          </div>
        </div>

        <div class="mb-6 flex items-center justify-between bg-[#0A0910] p-3 rounded-xl border border-[#232033]">
          <div>
            <p class="text-sm font-bold text-gray-200">Deals Ticket</p>
            <p class="text-[10px] text-gray-500">Turunkan harga otomatis?</p>
          </div>
          <button class="w-11 h-6 rounded-full relative transition-colors {relistAutoDrop ? 'bg-[#D4FF00]' : 'bg-[#232033]'}" onclick={() => relistAutoDrop = !relistAutoDrop}>
            <span class="absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full transition-transform shadow-sm {relistAutoDrop ? 'translate-x-[20px]' : 'translate-x-0'}"></span>
          </button>
        </div>

        <div class="flex gap-3">
          <button class="flex-1 bg-[#1A1825] border border-[#232033] text-gray-300 rounded-xl py-2.5 text-sm font-semibold hover:bg-[#232033] transition" onclick={() => showRelistModal = false}>Batal</button>
          <button class="flex-1 bg-[#D4FF00] text-black rounded-xl py-2.5 text-sm font-bold hover:opacity-90 transition" onclick={submitRelist}>Ajukan</button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Custom Confirm Modal -->
  {#if showConfirmModal}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick={() => showConfirmModal = false}></div>
      <div class="bg-[#14121E] border border-[#232033] p-6 rounded-2xl max-w-sm w-full relative z-10 text-center">
        <svg class="w-12 h-12 text-[#FF3366] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <h3 class="text-lg font-bold text-white mb-2">Konfirmasi Aksi</h3>
        <p class="text-sm text-gray-400 mb-6">{confirmMessage}</p>
        <div class="flex gap-3">
          <button class="flex-1 px-4 py-2.5 rounded-xl border border-[#232033] text-gray-400 font-bold active:scale-95 transition-transform" onclick={() => showConfirmModal = false}>Batal</button>
          <button class="flex-1 px-4 py-2.5 rounded-xl bg-[#FF3366] text-white font-bold active:scale-95 transition-transform" onclick={confirmAction}>Ya, Lanjutkan</button>
        </div>
      </div>
    </div>
  {/if}

</main>
