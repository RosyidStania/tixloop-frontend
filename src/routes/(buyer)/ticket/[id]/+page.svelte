<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import api from '$lib/axios';

  let listingId = $page.params.id;
  let listing = $state(null);
  let isLoading = $state(true);

  onMount(async () => {
    try {
      const response = await api.get(`/marketplace/listings/${listingId}`);
      listing = response.data.data || response.data;
    } catch (error) {
      console.error('Failed to load listing', error);
    } finally {
      isLoading = false;
    }
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount || 0);
  };
</script>

{#if isLoading}
  <div class="flex justify-center items-center min-h-screen bg-[#0A0910]">
    <div class="w-8 h-8 border-4 border-[#D4FF00] border-t-transparent rounded-full animate-spin"></div>
  </div>
{:else if listing}
<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-32">
  <div class="relative h-72 bg-cover bg-center" style="background-image: url('{listing.ticket.event.event_poster_url || listing.ticket.event.poster_url || 'https://images.unsplash.com/photo-1540039155733-d7696d54af58?q=80&w=800&auto=format&fit=crop'}');">
    <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#0A0910]"></div>
    
    <div class="absolute top-0 w-full px-4 pt-12 flex justify-between items-center z-10">
      <a href="javascript:history.back()" class="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center transition-transform active:scale-95">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </a>
      <div class="flex gap-3">
        <button class="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center transition-transform active:scale-95">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        </button>
        <button class="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center transition-transform active:scale-95">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
        </button>
      </div>
    </div>

    <div class="absolute bottom-4 left-4 right-4 flex justify-between items-end">
      <div class="flex gap-2">
        {#if listing.verification_status === 'verified'}
          <span class="bg-[#D4FF00] text-black text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg> Verified</span>
        {/if}
        <span class="bg-[#C7A4FF] text-black text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">📈 Trending</span>
      </div>
      {#if listing.original_price > listing.current_asking_price}
        <div class="bg-[#FF3366] text-white text-xs font-bold px-3 py-1 rounded-full">-{Math.round((1 - listing.current_asking_price / listing.original_price) * 100)}%</div>
      {/if}
    </div>
  </div>

  <div class="px-5 pt-4">
    <div class="mb-6">
      <div class="flex items-center gap-1 text-xs text-gray-400 mb-2">🎵 {listing.ticket.event.category || 'Event'}</div>
      <h1 class="text-2xl font-bold mb-1">{listing.ticket.event.name || 'Unknown Event'}</h1>
      
      <div class="space-y-2.5 mt-4">
        <div class="flex items-center gap-3 text-sm text-gray-300">
          <svg class="w-5 h-5 text-[#D4FF00]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {listing.ticket.event.date ? new Date(listing.ticket.event.date).toLocaleString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
        </div>
        <div class="flex items-center justify-between text-sm text-gray-300">
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-[#C7A4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
            {listing.ticket.event.venue || '-'}, {listing.ticket.event.city || '-'}
          </div>
        </div>
      </div>
    </div>

    <h2 class="text-sm font-bold mb-3">Detail Tiket</h2>
    <div class="bg-[#14121E] p-4 rounded-2xl border border-[#232033] mb-8">
      <div class="flex justify-between items-center mb-2">
        <p class="text-gray-400 text-xs">Tipe</p>
        <p class="font-bold text-sm text-white">{listing.ticket.metadata?.type || 'General'}</p>
      </div>
      <div class="flex justify-between items-center mb-2">
        <p class="text-gray-400 text-xs">Gate / Row</p>
        <p class="font-bold text-sm text-white">{listing.ticket.metadata?.gate || '-'}</p>
      </div>
      <div class="flex justify-between items-center">
        <p class="text-gray-400 text-xs">Harga Asli (Face Value)</p>
        <p class="font-bold text-sm text-gray-300 {listing.original_price > listing.current_asking_price ? 'line-through' : ''}">{formatCurrency(listing.original_price)}</p>
      </div>
    </div>

    <h2 class="text-sm font-bold mb-3">Informasi Penjual</h2>
    <div class="bg-[#14121E] p-4 rounded-2xl border border-[#232033] mb-8">
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-[#C7A4FF] text-black font-bold text-lg rounded-full flex items-center justify-center">
            {listing.seller.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div class="flex items-center gap-1">
              <p class="font-bold text-sm text-white">{listing.seller.name}</p>
              {#if listing.verification_status === 'verified'}
                <svg class="w-4 h-4 text-[#D4FF00]" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
              {/if}
            </div>
            <p class="text-[10px] text-gray-400">Terverifikasi</p>
          </div>
        </div>
      </div>
      <div class="flex gap-3">
        <div class="flex-1 bg-[#1A1825] py-2 rounded-xl text-center border border-[#232033]">
          <p class="text-[#D4FF00] font-bold text-sm">Aman</p>
          <p class="text-[10px] text-gray-400">Escrow Protected</p>
        </div>
        <div class="flex-1 bg-[#1A1825] py-2 rounded-xl text-center border border-[#232033]">
          <p class="text-[#D4FF00] font-bold text-sm">TixLoop</p>
          <p class="text-[10px] text-gray-400">Verified Seller</p>
        </div>
      </div>
    </div>
  </div>

  <div class="fixed bottom-0 w-full bg-[#0A0910] border-t border-[#232033] p-4 z-40 pb-safe shadow-[0_-10px_20px_-5px_rgba(10,9,16,0.9)]">
    <div class="flex justify-between items-center mb-3">
      <div>
        <p class="text-[10px] text-gray-400">Harga Jual</p>
        <div class="flex items-end gap-2">
          <p class="text-[#D4FF00] font-bold text-xl">{formatCurrency(listing.current_asking_price)}</p>
          {#if listing.original_price > listing.current_asking_price}
            <p class="text-[10px] text-gray-500 line-through mb-1">{formatCurrency(listing.original_price)}</p>
          {/if}
        </div>
      </div>
      <div class="text-right">
        <p class="text-xs text-gray-300">{listing.ticket.metadata?.type || 'General'}</p>
        <p class="text-[10px] text-gray-500">1 tiket tersedia</p>
      </div>
    </div>
    <a href="/checkout/{listing.id}" class="w-full bg-[#D4FF00] text-black font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 transition-transform active:scale-[0.98]">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
      Beli Tiket Sekarang
    </a>
  </div>
</main>
{:else}
  <div class="flex flex-col justify-center items-center min-h-screen bg-[#0A0910] text-white">
    <svg class="w-16 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    <h2 class="text-xl font-bold mb-2">Tiket Tidak Ditemukan</h2>
    <p class="text-gray-400 text-sm mb-6">Listing mungkin sudah kadaluarsa atau ditarik.</p>
    <a href="/explore" class="bg-[#2D234A] text-white px-6 py-2 rounded-full text-sm font-semibold">Kembali ke Explore</a>
  </div>
{/if}

<style>
  .pb-safe { padding-bottom: env(safe-area-inset-bottom, 1rem); }
</style>
