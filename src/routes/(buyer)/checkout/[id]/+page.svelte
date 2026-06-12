<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import api from '$lib/axios';
  import { resolveImageUrl } from '$lib/utils/image';

  let listingId = $page.params.id;
  let listing = $state(null);
  let isLoading = $state(true);
  let isCheckingOut = $state(false);
  let errorMsg = $state('');
  let pendingTransactionId = $state(null);

  let selectedPayment = $state('gopay');
  const serviceFee = 15000;
  const escrowFee = 5000;
  let total = $derived(listing ? listing.current_asking_price + serviceFee + escrowFee : 0);

  const payments = [
    { id: 'gopay', name: 'GoPay', icon: 'G', color: 'bg-[#00AED6]', desc: 'Saldo: Rp 1.250.000' },
    { id: 'ovo', name: 'OVO', icon: 'O', color: 'bg-[#4C2A86]', desc: 'Saldo: Rp 800.000' },
    { id: 'bca', name: 'BCA Virtual Account', icon: 'B', color: 'bg-[#0066AE]', desc: 'Transfer bank BCA' },
    { id: 'bni', name: 'BNI Virtual Account', icon: 'N', color: 'bg-[#F15A24]', desc: 'Transfer bank BNI' },
  ];

  onMount(async () => {
    try {
      const res = await api.get(`/marketplace/listings/${listingId}`);
      listing = res.data.data || res.data;
    } catch (e) {
      console.error(e);
      errorMsg = 'Listing tidak ditemukan atau sudah terjual.';
    } finally {
      isLoading = false;
    }
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount || 0);
  };

  async function handleCheckout() {
    if (isCheckingOut) return;
    isCheckingOut = true;
    errorMsg = '';
    
    try {
      let transactionId = pendingTransactionId;

      if (!transactionId) {
        // 1. Checkout (Create Pending Transaction)
        const res = await api.post(`/marketplace/listings/${listingId}/checkout`);
        transactionId = res.data.data.id;
        
        // Simpan ID jika langkah selanjutnya gagal
        pendingTransactionId = transactionId;
      }
      
      // 2. Simulate Payment to release escrow immediately (untuk keperluan demo MVP)
      await api.post(`/transactions/${transactionId}/simulate-payment`);
      
      // 3. Release Escrow to transfer ownership
      await api.post(`/transactions/${transactionId}/release-escrow`);
      
      // 3. Redirect ke success page
      goto(`/checkout/success?transaction_id=${transactionId}`);
      
    } catch (e) {
      console.error(e);
      errorMsg = e.response?.data?.message || 'Terjadi kesalahan saat checkout. Pastikan Anda tidak membeli tiket Anda sendiri dan sudah login.';
    } finally {
      isCheckingOut = false;
    }
  }
</script>

{#if isLoading}
  <div class="flex justify-center items-center min-h-screen bg-[#0A0910]">
    <div class="w-8 h-8 border-4 border-[#D4FF00] border-t-transparent rounded-full animate-spin"></div>
  </div>
{:else if listing}
<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-32 pt-12">
  <div class="px-4 flex items-center gap-4 mb-6">
    <a href="javascript:history.back()" class="w-10 h-10 bg-[#1A1825] rounded-full flex items-center justify-center">
      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
    </a>
    <h1 class="text-xl font-bold">Checkout</h1>
  </div>

  {#if errorMsg}
    <div class="px-4 mb-4">
      <div class="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm">
        {errorMsg}
      </div>
    </div>
  {/if}

  <div class="px-4 space-y-4">
    <div class="bg-[#14121E] p-4 rounded-2xl border border-[#232033]">
      <p class="text-[10px] text-gray-400 font-bold tracking-wider mb-3">RINGKASAN PESANAN</p>
      <div class="flex gap-3 mb-4">
        <img src={resolveImageUrl(listing.ticket.event.event_poster_url)} class="w-16 h-16 rounded-xl object-cover" alt={listing.ticket.event.name || 'Event'} />
        <div>
          <h3 class="font-bold text-sm mb-1">{listing.ticket.event.name}</h3>
          <p class="text-xs text-gray-400 mb-2">{listing.ticket.metadata?.type || 'General'} • {listing.ticket.metadata?.gate || '-'}</p>
          <div class="flex items-center gap-1 text-[10px] text-gray-400">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            {new Date(listing.ticket.event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>
      <div class="bg-[#1A1825] p-3 rounded-xl flex items-center gap-2 text-[10px] text-gray-300">
        <svg class="w-4 h-4 text-[#C7A4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
        {listing.ticket.event.venue}, {listing.ticket.event.city}
      </div>
    </div>

    <div class="bg-[#1A112C] p-4 rounded-2xl border border-[#3E3166]">
      <div class="flex items-center gap-2 mb-2">
        <svg class="w-5 h-5 text-[#C7A4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        <h3 class="font-bold text-sm text-[#C7A4FF]">Escrow Protection Aktif</h3>
      </div>
      <p class="text-[10px] text-[#A89EC4] leading-relaxed">
        Dana kamu ditahan oleh TixLoop dan baru diteruskan ke penjual setelah tiket berhasil kamu terima. Jika ada masalah, kamu akan mendapat 100% refund.
      </p>
    </div>

    <div>
      <p class="text-[10px] text-gray-400 font-bold tracking-wider mb-3 mt-6">METODE PEMBAYARAN</p>
      <div class="space-y-3">
        {#each payments as pay}
          <div class="p-4 rounded-2xl border transition-all cursor-pointer {selectedPayment === pay.id ? 'bg-[#1A2000] border-[#D4FF00]' : 'bg-[#14121E] border-[#232033]'}" on:click={() => selectedPayment = pay.id}>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 {pay.color} rounded-full flex items-center justify-center font-bold text-white text-lg">
                  {pay.icon}
                </div>
                <div>
                  <p class="font-bold text-sm text-white">{pay.name}</p>
                  <p class="text-[10px] text-gray-400">{pay.desc}</p>
                </div>
              </div>
              <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center {selectedPayment === pay.id ? 'border-[#D4FF00]' : 'border-gray-500'}">
                {#if selectedPayment === pay.id}
                  <div class="w-2.5 h-2.5 bg-[#D4FF00] rounded-full"></div>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="bg-[#14121E] p-5 rounded-2xl border border-[#232033] mt-6">
      <p class="text-[10px] text-gray-400 font-bold tracking-wider mb-4">RINCIAN HARGA</p>
      <div class="space-y-3 text-sm text-gray-300 mb-4">
        <div class="flex justify-between">
          <span>Harga Tiket</span>
          <span>{formatCurrency(listing.current_asking_price)}</span>
        </div>
        <div class="flex justify-between">
          <span>Biaya Layanan</span>
          <span>{formatCurrency(serviceFee)}</span>
        </div>
        <div class="flex justify-between">
          <span>Biaya Escrow</span>
          <span>{formatCurrency(escrowFee)}</span>
        </div>
      </div>
      <div class="border-t border-[#232033] pt-4 flex justify-between items-center font-bold">
        <span class="text-white">Total</span>
        <span class="text-[#D4FF00] text-lg">{formatCurrency(total)}</span>
      </div>
    </div>
  </div>

  <div class="fixed bottom-0 w-full bg-[#0A0910] border-t border-[#232033] p-4 z-40 pb-[env(safe-area-inset-bottom,1rem)]">
    <div class="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 mb-3">
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
      Transaksi anda terenkripsi
    </div>
    <button on:click={handleCheckout} disabled={isCheckingOut} class="w-full bg-[#D4FF00] text-black font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50">
      {#if isCheckingOut}
        <svg class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
        Memproses...
      {:else}
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        Konfirmasi Pembayaran • {formatCurrency(total)}
      {/if}
    </button>
  </div>
</main>
{:else}
  <div class="flex flex-col justify-center items-center min-h-screen bg-[#0A0910] text-white">
    <svg class="w-16 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2z"></path></svg>
    <h2 class="text-xl font-bold mb-2">Gagal Memuat Checkout</h2>
    <p class="text-gray-400 text-sm mb-6">{errorMsg || 'Listing tidak ditemukan.'}</p>
    <a href="/explore" class="bg-[#2D234A] text-white px-6 py-2 rounded-full text-sm font-semibold">Kembali ke Explore</a>
  </div>
{/if}

