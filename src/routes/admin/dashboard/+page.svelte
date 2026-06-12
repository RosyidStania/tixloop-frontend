<script>
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import api from '$lib/axios';
  import { showToast } from '$lib/stores/toast.svelte.js';
  import BottomNav from '$lib/components/admin/layout/BottomNav.svelte';

  let mounted = $state(false);
  let pollingInterval;
  /** @type {any} */
  let user = $state(null);
  let isLoading = $state(true);

  /** @type {any} */
  let wasteData = $state(null);
  /** @type {any} */
  let burnData = $state(null);
  /** @type {any[]} */
  let pendingListings = $state([]);

  let showVerifyConfirm = $state(false);
  let showRejectConfirm = $state(false);
  let selectedListingId = $state(null);
  let rejectReason = $state('');


  onMount(async () => {
    mounted = true;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        goto('/login');
        return;
      }

      const response = await api.get('/auth/me');
      user = response.data.data || response.data;

      if (user.email !== 'admin@tixloop.com') {
        goto('/home');
        return;
      }
      localStorage.setItem('user', JSON.stringify(user));

      await fetchData();

      pollingInterval = setInterval(() => {
        fetchData();
      }, 5000);

    } catch (error) {
      console.error('Unauthorized', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      goto('/login');
    } finally {
      isLoading = false;
    }
  });

  onDestroy(() => {
    if (pollingInterval) clearInterval(pollingInterval);
  });

  async function fetchData() {
    try {
      const [wasteRes, burnRes, listingsRes] = await Promise.all([
        api.get('/dashboard/waste'),
        api.get('/dashboard/burn-prevention'),
        api.get('/admin/listings')
      ]);

      wasteData = wasteRes.data.data;
      burnData = burnRes.data.data;
      pendingListings = listingsRes.data.data;

    } catch (err) {
      console.error('Gagal mengambil data dashboard', err);
    }
  }

  function verifyListing(id) {
    selectedListingId = id;
    showVerifyConfirm = true;
  }

  async function submitVerify() {
    showVerifyConfirm = false;
    try {
      await api.post(`/admin/listings/${selectedListingId}/verify`);
      await fetchData();
      showToast('Listing berhasil diverifikasi!');
    } catch (err) {
      console.error(err);
      showToast('Gagal memverifikasi listing.', 'error');
    }
  }

  function rejectListing(id) {
    selectedListingId = id;
    rejectReason = '';
    showRejectConfirm = true;
  }

  async function submitReject() {
    if (!rejectReason || rejectReason.length < 10) {
      showToast('Alasan penolakan harus minimal 10 karakter.', 'error');
      return;
    }
    showRejectConfirm = false;
    try {
      await api.post(`/admin/listings/${selectedListingId}/reject`, { rejection_reason: rejectReason });
      await fetchData();
      showToast('Listing berhasil ditolak!');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Gagal menolak listing.';
      showToast(msg, 'error');
    }
  }

  function formatRp(val) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  }

  function formatShort(val) {
    if (val >= 1_000_000_000) return (val / 1_000_000_000).toFixed(1).replace('.0','') + 'B';
    if (val >= 1_000_000) return (val / 1_000_000).toFixed(1).replace('.0','') + 'M';
    if (val >= 1_000) return (val / 1_000).toFixed(1).replace('.0','') + 'K';
    return val;
  }
</script>

<main class="bg-[#06060E] min-h-screen text-white font-sans pb-24 transition-opacity duration-500 {mounted ? 'opacity-100' : 'opacity-0'}">
  <!-- Top bar -->
  <div class="flex items-center justify-between px-5 pt-12 pb-4">
    <div class="flex items-center gap-3">
      <svg class="w-7 h-7 text-[#D4FF00]" viewBox="0 0 24 24" fill="currentColor">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M6 4C4.89543 4 4 4.89543 4 6V9C5.10457 9 6 9.89543 6 11C6 12.1046 5.10457 13 4 13V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V13C18.8954 13 18 12.1046 18 11C18 9.89543 18.8954 9 20 9V6C20 4.89543 19.1046 4 18 4H6ZM11.5 6C11.2239 6 11 6.22386 11 6.5V8.5C11 8.77614 11.2239 9 11.5 9H12.5C12.7761 9 13 8.77614 13 8.5V6.5C13 6.22386 12.7761 6 12.5 6H11.5ZM11 11.5C11 11.2239 11.2239 11 11.5 11H12.5C12.7761 11 13 11.2239 13 11.5V13.5C13 13.7761 12.7761 14 12.5 14H11.5C11.2239 14 11 13.7761 11 13.5V11.5ZM11.5 16C11.2239 16 11 16.2239 11 16.5V18.5C11 18.7761 11.2239 19 11.5 19H12.5C12.7761 19 13 18.7761 13 18.5V16.5C13 16.2239 12.7761 16 12.5 16H11.5Z" />
      </svg>
      <div>
        <span class="block text-[15px] font-bold text-gray-100 leading-tight">TixLoop</span>
        <span class="block text-[11px] text-gray-500 font-medium">Admin Panel</span>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <button class="relative w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 transition">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 border border-[#06060E]"></span>
      </button>
      <div class="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
        {user && user.name ? user.name.charAt(0).toUpperCase() : 'A'}
      </div>
    </div>
  </div>

  <!-- Search -->
  <div class="relative mx-5 mb-2">
    <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
    <input type="text" placeholder="Cari pengguna, tiket..." class="w-full bg-[#14121E] border border-[#232033] rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-200 outline-none focus:border-indigo-500/40 focus:bg-[#1A1825] transition-colors placeholder-gray-500" />
  </div>

  <!-- Dashboard Header -->
  <div class="px-5 pt-4 pb-3">
    <h1 class="text-xl font-bold text-white tracking-tight">Beranda</h1>
    <p class="text-xs text-gray-400 font-medium mt-1">Ringkasan platform</p>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-2 gap-3 px-5 mt-1">
    <!-- Total Pengguna -->
    <div class="bg-[#14121E] border border-[#232033] rounded-2xl p-4 hover:-translate-y-0.5 hover:border-[#C2F04B]/30 transition-all duration-200">
      <div class="flex items-center justify-between mb-3">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-[#C2F04B]/20">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C2F04B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <span class="text-[11px] font-bold text-[#C2F04B] bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">+12%</span>
      </div>
      <div class="text-2xl font-extrabold text-white leading-tight tracking-tight">{wasteData ? formatShort(wasteData.listings_breakdown.total_listings) : '48,392'}</div>
      <div class="text-[11px] font-medium text-gray-400 mt-1">Total Pengguna</div>
    </div>

    <!-- Transaksi Hari Ini -->
    <div class="bg-[#14121E] border border-[#232033] rounded-2xl p-4 hover:-translate-y-0.5 hover:border-cyan-500/30 transition-all duration-200">
      <div class="flex items-center justify-between mb-3">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-cyan-500/20">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <span class="text-[11px] font-bold text-[#C2F04B] bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">+8%</span>
      </div>
      <div class="text-2xl font-extrabold text-white leading-tight tracking-tight">{wasteData ? formatShort(wasteData.potential_impact.verified_listings) : '1,284'}</div>
      <div class="text-[11px] font-medium text-gray-400 mt-1">Transaksi Hari Ini</div>
    </div>

    <!-- Pendapatan -->
    <div class="bg-[#14121E] border border-[#232033] rounded-2xl p-4 hover:-translate-y-0.5 hover:border-amber-500/30 transition-all duration-200">
      <div class="flex items-center justify-between mb-3">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500/20">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <span class="text-[11px] font-bold text-[#C2F04B] bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">+23%</span>
      </div>
      <div class="text-2xl font-extrabold text-white leading-tight tracking-tight">{wasteData ? formatShort(wasteData.listings_breakdown.total_listing_value) : '2.4B'}</div>
      <div class="text-[11px] font-medium text-gray-400 mt-1">Pendapatan</div>
    </div>

    <!-- Total Tiket Terjual -->
    <div class="bg-[#14121E] border border-[#232033] rounded-2xl p-4 hover:-translate-y-0.5 hover:border-purple-500/30 transition-all duration-200">
      <div class="flex items-center justify-between mb-3">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-500/20">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
        </div>
        <span class="text-[11px] font-bold text-[#C2F04B] bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">+15%</span>
      </div>
      <div class="text-2xl font-extrabold text-white leading-tight tracking-tight">{burnData ? formatShort(burnData.summary.high_risk_count + burnData.summary.medium_risk_count + burnData.summary.low_risk_count) : '12,847'}</div>
      <div class="text-[11px] font-medium text-gray-400 mt-1">Total Tiket Terjual</div>
    </div>
  </div>


  <BottomNav activeTab="dashboard" />

  <!-- Modals -->
  {#if showVerifyConfirm}
    <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-[#14121E] border border-[#232033] rounded-2xl w-full max-w-[340px] p-5 shadow-2xl">
        <h3 class="text-lg font-bold text-gray-100 mb-2">Verifikasi Tiket?</h3>
        <p class="text-sm text-gray-400 mb-6 leading-relaxed">Tiket <strong class="text-gray-200">{selectedListingId}</strong> akan disetujui dan tayang di marketplace.</p>
        <div class="flex gap-3">
          <button class="flex-1 bg-[#1A1825] border border-[#232033] text-gray-300 rounded-xl py-2.5 text-sm font-semibold hover:bg-[#232033] transition" onclick={() => showVerifyConfirm = false}>Batal</button>
          <button class="flex-1 bg-[#C2F04B] text-[#06060E] rounded-xl py-2.5 text-sm font-bold hover:bg-[#C2F04B]/90 transition" onclick={submitVerify}>Verifikasi</button>
        </div>
      </div>
    </div>
  {/if}

  {#if showRejectConfirm}
    <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-[#14121E] border border-[#232033] rounded-2xl w-full max-w-[340px] p-5 shadow-2xl">
        <h3 class="text-lg font-bold text-red-500 mb-2">Tolak Tiket?</h3>
        <p class="text-sm text-gray-400 mb-4 leading-relaxed">Tiket <strong class="text-gray-200">{selectedListingId}</strong> akan ditolak.</p>
        <input type="text" placeholder="Masukkan alasan (min 10 karakter)" bind:value={rejectReason} class="w-full bg-[#1A1825] border border-[#232033] rounded-xl py-3 px-4 text-sm text-gray-200 outline-none focus:border-red-500/40 focus:bg-[#14121E] transition-colors placeholder-gray-500 mb-6" />
        <div class="flex gap-3">
          <button class="flex-1 bg-[#1A1825] border border-[#232033] text-gray-300 rounded-xl py-2.5 text-sm font-semibold hover:bg-[#232033] transition" onclick={() => showRejectConfirm = false}>Batal</button>
          <button class="flex-1 bg-red-500 text-white rounded-xl py-2.5 text-sm font-bold hover:bg-red-600 transition" onclick={submitReject}>Tolak</button>
        </div>
      </div>
    </div>
  {/if}
</main>
