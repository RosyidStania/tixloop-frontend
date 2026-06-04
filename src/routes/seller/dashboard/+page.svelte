<script>
  import BottomNav from '$lib/components/seller/layout/BottomNav.svelte';

  const dashboardStats = [
    { label: 'Total Pendapatan', value: 'Rp 4.500.000', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Tiket Terjual', value: '18', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z', color: 'text-[#AAEF45]', bg: 'bg-[#AAEF45]/10' },
    { label: 'Sedang Dijual', value: '5', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'text-orange-400', bg: 'bg-orange-400/10' }
  ];

  const recentTransactions = [
    { event: 'Coldplay: Music of the Spheres', category: 'CAT 3', price: 'Rp 3.500.000', status: 'Selesai', date: 'Hari ini, 14:30', id: 'TRX-123984' },
    { event: 'Pestapora 2024 - 3 Day Pass', category: 'Festival', price: 'Rp 1.000.000', status: 'Menunggu Pembayaran', date: 'Kemarin, 09:15', id: 'TRX-123985' }
  ];
</script>

<BottomNav activeTab="dashboard" />

<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-24">
  <!-- Header -->
  <div class="px-4 pt-12 pb-6 flex items-center justify-between">
    <div>
      <h1 class="text-xl font-black">Seller Dashboard</h1>
      <p class="text-[11px] text-gray-500 mt-0.5">Kelola tiket dan penjualanmu</p>
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
            <p class="text-[11px] font-semibold text-gray-500">{stat.label}</p>
            <p class="text-lg font-black text-white mt-0.5">{stat.value}</p>
          </div>
        </div>
      {/each}
    </div>

    <!-- Quick Actions -->
    <div>
      <h2 class="text-sm font-black mb-3 text-gray-300">Aksi Cepat</h2>
      <div class="grid grid-cols-2 gap-3">
        <button class="bg-[#AAEF45]/10 border border-[#AAEF45]/20 rounded-xl py-3 flex items-center justify-center gap-2 active:scale-95 transition-transform">
          <svg class="w-4 h-4 text-[#AAEF45]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span class="text-[12px] font-bold text-[#AAEF45]">Jual Tiket</span>
        </button>
        <button class="bg-[#14121E] border border-[#232033] rounded-xl py-3 flex items-center justify-center gap-2 active:scale-95 transition-transform">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span class="text-[12px] font-bold text-white">Tarik Saldo</span>
        </button>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-black text-gray-300">Transaksi Terbaru</h2>
        <button class="text-[11px] font-bold text-[#AAEF45]">Lihat Semua</button>
      </div>
      <div class="space-y-3">
        {#each recentTransactions as trx}
          <div class="bg-[#14121E] border border-[#232033] rounded-2xl p-4">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1 min-w-0 pr-3">
                <p class="text-[12px] font-bold text-white truncate">{trx.event}</p>
                <p class="text-[11px] text-gray-500 mt-0.5">{trx.category} • {trx.id}</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-[12px] font-black text-[#AAEF45]">{trx.price}</p>
                <p class="text-[9px] text-gray-600 mt-0.5">{trx.date}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              {#if trx.status === 'Selesai'}
                <div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span class="text-[10px] font-semibold text-green-400">{trx.status}</span>
              {:else}
                <div class="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                <span class="text-[10px] font-semibold text-orange-400">{trx.status}</span>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</main>
