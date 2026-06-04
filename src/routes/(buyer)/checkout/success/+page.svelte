<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import api from '$lib/axios';

  let transactionId = $page.url.searchParams.get('transaction_id');
  let transaction = $state(null);
  let isLoading = $state(true);
  let errorMsg = $state('');

  onMount(async () => {
    if (!transactionId) {
      errorMsg = 'Transaction ID tidak ditemukan di URL.';
      isLoading = false;
      return;
    }
    
    try {
      const res = await api.get(`/transactions/${transactionId}`);
      transaction = res.data.data || res.data;
    } catch (e) {
      console.error('Failed to load transaction', e);
      errorMsg = 'Gagal memuat detail transaksi.';
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
{:else if transaction}
  <main class="bg-[#0A0910] min-h-screen text-white font-sans flex flex-col pt-16 px-5 pb-8">
    <div class="flex flex-col items-center text-center mb-8">
      <div class="w-24 h-24 bg-[#1A2000] rounded-full flex items-center justify-center mb-6">
        <div class="w-16 h-16 bg-[#D4FF00] rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-black" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
        </div>
      </div>
      <h1 class="text-2xl font-bold mb-2">Pembayaran Berhasil!</h1>
      <p class="text-xs text-gray-400 leading-relaxed">
        Tiket kamu berhasil diamankan dan kepemilikan telah berpindah ke kamu.<br/>Kamu dapat melihat tiket QR di halaman Activity.
      </p>
    </div>

    <div class="bg-[#14121E] rounded-3xl relative overflow-hidden flex-1 border border-[#232033] flex flex-col max-h-[400px]">
      <div class="p-6">
        <div class="flex items-center gap-4 mb-4">
          <img src="https://images.unsplash.com/photo-1540039155733-d7696d54af58?w=100&h=100&fit=crop" class="w-12 h-12 rounded-xl object-cover" alt="Event" />
          <div>
            <h3 class="font-bold text-sm">Tiket telah menjadi milikmu</h3>
            <p class="text-[10px] text-gray-400">Escrow berhasil di-release</p>
          </div>
        </div>
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-[10px] text-gray-300">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            Selesai pada: {new Date(transaction.completed_at || transaction.created_at).toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      <div class="relative flex items-center justify-center">
        <div class="absolute left-[-12px] w-6 h-6 bg-[#0A0910] rounded-full border-r border-[#232033]"></div>
        <div class="w-full border-t-2 border-dashed border-[#232033] mx-6"></div>
        <div class="absolute right-[-12px] w-6 h-6 bg-[#0A0910] rounded-full border-l border-[#232033]"></div>
      </div>

      <div class="p-6 flex flex-col items-center justify-center flex-1">
        <div class="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-black" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <p class="text-[10px] text-gray-500 mb-1">Order ID</p>
        <p class="text-[#D4FF00] font-mono font-bold text-[10px] tracking-wider mb-6">{transaction.id}</p>

        <div class="w-full bg-[#1A1825] p-4 rounded-xl flex justify-between items-center">
          <span class="text-xs text-gray-400">Total Dibayar</span>
          <span class="text-[#D4FF00] font-bold text-sm">{formatCurrency(transaction.amount + transaction.service_fee)}</span>
        </div>
      </div>
    </div>

    <div class="flex justify-center items-center gap-2 text-[10px] text-[#A89EC4] mt-6 mb-8">
      <svg class="w-3.5 h-3.5 text-[#C7A4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
      Dilindungi TixLoop
    </div>

    <div class="space-y-3 mt-auto pb-safe">
      <a href="/activity" class="w-full bg-[#D4FF00] text-black font-bold py-3.5 rounded-xl flex justify-center items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
        Lihat Tiket Saya
      </a>
      <a href="/" class="w-full bg-[#1A1825] text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
        Kembali ke Beranda
      </a>
    </div>
  </main>
{:else}
  <div class="flex flex-col justify-center items-center min-h-screen bg-[#0A0910] text-white">
    <svg class="w-16 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    <h2 class="text-xl font-bold mb-2">Gagal Memuat</h2>
    <p class="text-gray-400 text-sm mb-6">{errorMsg || 'Transaksi tidak ditemukan.'}</p>
    <a href="/explore" class="bg-[#2D234A] text-white px-6 py-2 rounded-full text-sm font-semibold">Kembali ke Explore</a>
  </div>
{/if}

<style>
  .pb-safe { padding-bottom: env(safe-area-inset-bottom, 1rem); }
</style>
