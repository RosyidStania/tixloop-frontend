<script>
  import { onMount } from 'svelte';
  import BottomNav from '$lib/components/seller/layout/BottomNav.svelte';
  import { dashboardService } from '$lib/services/api/dashboardService';
  import api from '$lib/axios';

  let isLoading = $state(true);
  let burnPreventionData = $state(null);
  let transactions = $state([]);
  let error = $state(null);
  
  let totalPendapatan = $state(0);
  let totalTiketTerjual = $state(0);
  let dynamicRecentTransactions = $state([]);

  onMount(async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.id;

      // Fetch all required data concurrently
      const [bpRes, trxRes] = await Promise.allSettled([
        dashboardService.getBurnPreventionMetrics(),
        api.get('/transactions')
      ]);

      if (bpRes.status === 'fulfilled' && bpRes.value.success) {
        burnPreventionData = bpRes.value.data;
      }

      if (trxRes.status === 'fulfilled') {
        const trxData = trxRes.value.data.data || trxRes.value.data;
        if (Array.isArray(trxData)) {
          // Filter transactions where user is the seller
          const sellerTrx = trxData.filter(t => t.seller?.id === userId);
          
          // Compute revenue for completed transactions
          totalPendapatan = sellerTrx
            .filter(t => t.status === 'completed' || t.status === 'released')
            .reduce((sum, t) => sum + Number(t.amount || 0), 0);
            
          // Compute tickets sold
          totalTiketTerjual = sellerTrx.filter(t => t.status === 'completed' || t.status === 'released').length;

          // Map recent transactions
          dynamicRecentTransactions = sellerTrx.slice(0, 5).map(t => ({
            event: t.ticket?.event?.name || t.ticket?.event?.event_name || 'Event',
            category: t.ticket?.type || 'General',
            price: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(t.amount),
            status: t.status === 'completed' || t.status === 'released' ? 'Selesai' : (t.status === 'escrow' ? 'Dana Ditahan' : 'Menunggu Pembayaran'),
            date: new Date(t.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
            id: `TRX-${t.id.toString().substring(0, 6).toUpperCase()}`
          }));
        }
      }
    } catch (err) {
      error = err.message || 'Gagal memuat data dashboard';
      console.error(err);
    } finally {
      isLoading = false;
    }
  });

  let dashboardStats = $derived([
    { label: 'Total Pendapatan', value: `Rp ${totalPendapatan.toLocaleString('id-ID')}`, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-[#AAEF45]', bg: 'bg-[#AAEF45]/10' },
    { label: 'Tiket Terjual', value: totalTiketTerjual.toString(), icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z', color: 'text-[#C7A4FF]', bg: 'bg-[#C7A4FF]/10' },
    { label: 'Total Value at Risk', value: burnPreventionData ? `Rp ${burnPreventionData.summary.total_value_at_risk.toLocaleString('id-ID')}` : 'Rp 0', icon: 'M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-orange-400', bg: 'bg-orange-400/10' }
  ]);
</script>

<BottomNav activeTab="dashboard" />

<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-24">
  <!-- Header -->
  <div class="px-4 pt-12 pb-6 flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold text-white tracking-tight">Beranda</h1>
      <p class="text-xs text-gray-500 font-medium mt-0.5">Kelola tiket dan penjualanmu</p>
    </div>
    <div class="w-10 h-10 rounded-full bg-[#1A1825] border border-[#232033] flex items-center justify-center">
      <svg class="w-5 h-5 text-[#AAEF45]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
  </div>

  <div class="px-4 space-y-6">
    <!-- Quick Stats -->
    <div class="grid grid-cols-2 gap-3">
      {#each dashboardStats as stat}
        <div class="bg-[#14121E] border border-[#232033] rounded-2xl p-4 {stat.label === 'Total Pendapatan' ? 'col-span-2 flex items-center gap-4' : 'flex flex-col gap-2'}">
          <div class="w-10 h-10 rounded-xl {stat.bg} flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 {stat.color}" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d={stat.icon} />
            </svg>
          </div>
          <div>
            <p class="text-[10px] font-semibold text-gray-500">{stat.label}</p>
            <p class="text-base font-bold text-white mt-0.5">{stat.value}</p>
          </div>
        </div>
      {/each}
    </div>

    <!-- Quick Actions -->
    <div>
      <h2 class="text-lg font-bold mb-3 text-white">Aksi Cepat</h2>
      <div class="grid grid-cols-2 gap-3">
        <a href="/seller/sell" class="bg-[#AAEF45]/10 border border-[#AAEF45]/20 rounded-xl py-3 flex items-center justify-center gap-2 active:scale-95 transition-transform">
          <svg class="w-4 h-4 text-[#AAEF45]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span class="text-sm font-bold text-[#AAEF45]">Jual Tiket</span>
        </a>
        <button class="bg-[#14121E] border border-[#232033] rounded-xl py-3 flex items-center justify-center gap-2 active:scale-95 transition-transform">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span class="text-sm font-bold text-white">Tarik Saldo</span>
        </button>
      </div>
    </div>

    <!-- Burn Prevention / Listings at Risk -->
    {#if isLoading}
      <div class="flex justify-center py-6">
        <div class="animate-spin w-6 h-6 border-2 border-[#AAEF45] border-t-transparent rounded-full"></div>
      </div>
    {:else if error}
      <div class="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center">
        <p class="text-xs text-red-400">{error}</p>
      </div>
    {:else if burnPreventionData && burnPreventionData.user_listings_at_risk && burnPreventionData.user_listings_at_risk.length > 0}
      <div>
        <h2 class="text-lg font-bold mb-3 text-red-400">Peringatan: Burn Prevention</h2>
        <div class="space-y-3">
          {#each burnPreventionData.user_listings_at_risk as risk}
            <div class="bg-[#14121E] border border-red-500/30 rounded-2xl p-4">
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1 min-w-0 pr-3">
                  <p class="text-sm font-bold text-white truncate">{risk.event_name}</p>
                  <p class="text-[10px] text-gray-400 mt-1">Waktu tersisa: <span class="font-bold text-red-400">{risk.time_to_event_hours} jam</span></p>
                </div>
                <div class="text-right shrink-0">
                  <span class="px-2 py-1 bg-red-500/20 text-red-400 text-[10px] font-bold rounded-md uppercase">{risk.risk_level} RISK</span>
                </div>
              </div>
              <div class="mt-2 bg-[#0A0910] rounded-xl p-3 border border-[#232033]">
                <p class="text-[10px] text-gray-400 mb-1">Rekomendasi sistem:</p>
                <p class="text-xs font-semibold text-white">{risk.recommendation}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Recent Transactions -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-bold text-white">Transaksi Terbaru</h2>
        <button class="text-xs font-bold text-[#AAEF45]">Lihat Semua</button>
      </div>
      <div class="space-y-3">
        {#if dynamicRecentTransactions.length === 0}
          <div class="bg-[#14121E] border border-[#232033] rounded-2xl p-4 text-center">
            <p class="text-xs text-gray-500">Belum ada transaksi</p>
          </div>
        {:else}
          {#each dynamicRecentTransactions as trx}
            <div class="bg-[#14121E] border border-[#232033] rounded-2xl p-4">
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1 min-w-0 pr-3">
                  <p class="text-sm font-bold text-white truncate">{trx.event}</p>
                  <p class="text-xs text-gray-400 mt-0.5">{trx.category} • {trx.id}</p>
                </div>
                <div class="text-right shrink-0">
                  <p class="text-sm font-bold text-[#AAEF45]">{trx.price}</p>
                  <p class="text-[10px] font-medium text-gray-500 mt-0.5">{trx.date}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                {#if trx.status === 'Selesai'}
                  <div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span class="text-[10px] font-semibold text-green-400">{trx.status}</span>
                {:else if trx.status === 'Dana Ditahan'}
                  <div class="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                  <span class="text-[10px] font-semibold text-orange-400">{trx.status}</span>
                {:else}
                  <div class="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                  <span class="text-[10px] font-semibold text-yellow-400">{trx.status}</span>
                {/if}
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </div>
</main>
