<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import api from '$lib/axios';
  import { showToast } from '$lib/stores/toast.svelte.js';

  // Auth token dari local storage / store
  const token = typeof localStorage !== 'undefined'
    ? localStorage.getItem('auth_token')
    : null;

  // ─── State (Svelte 5 Runes) ──────────────────────────────────────────────────
  let transaction = $state(null);
  let loading = $state(true);
  let error = $state(null);
  let simulatingPayment = $state(false);

  // ─── Fetch Transaction ────────────────────────────────────────────────────────
  async function fetchTransaction() {
    loading = true;
    error = null;
    try {
      const transactionId = $page.params.id;
      const res = await api.get(`/transactions/${transactionId}`);
      transaction = res.data.data;
    } catch (e) {
      error = e.response?.data?.message || e.message;
    } finally {
      loading = false;
    }
  }

  // ─── Simulate Payment ─────────────────────────────────────────────────────────
  async function simulatePayment() {
    if (simulatingPayment) return;
    simulatingPayment = true;
    try {
      const transactionId = $page.params.id;
      const res = await api.post(`/transactions/${transactionId}/simulate-payment`);
      transaction = res.data.data;
    } catch (e) {
      showToast(`Gagal: ${e.response?.data?.message || e.message}`, 'error');
    } finally {
      simulatingPayment = false;
    }
  }

  onMount(fetchTransaction);

  // ─── Helpers ──────────────────────────────────────────────────────────────────
  function formatRupiah(amount) {
    if (amount == null) return 'Rp 0';
    return 'Rp ' + Number(amount).toLocaleString('id-ID');
  }

  function formatDate(iso) {
    if (!iso) return '-';
    const d = new Date(iso);
    return d.toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: false
    }).replace(',', ',');
  }

  function formatShortDate(iso) {
    if (!iso) return '-';
    const d = new Date(iso);
    return d.toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: false
    });
  }

  // ─── Derived State (Svelte 5 Runes) ───────────────────────────────────────────
  let isBuyer = $derived(transaction && transaction.buyer);

  // Status banner config
  let escrowBanner = $derived((() => {
    if (!transaction) return null;
    const { status } = transaction;
    
    if (status === 'completed' || status === 'paid') {
      const eventDate = new Date(transaction.ticket?.event?.event_datetime || transaction.created_at);
      const threeDaysAfterEvent = new Date(eventDate.getTime() + 3 * 24 * 60 * 60 * 1000);
      const now = new Date();
      
      if (now > threeDaysAfterEvent) {
        return { type: 'success', icon: '✓', title: 'Dana Sudah Masuk', sub: 'Transaksi selesai' };
      } else {
        return { type: 'escrow', icon: '⏱', title: 'Dana Ditahan Escrow', sub: 'Dana akan masuk otomatis (H+3 event)' };
      }
    }
    
    if (status === 'pending') {
      return { type: 'pending', icon: '●', title: 'Menunggu Pembayaran', sub: 'Buyer belum melakukan pembayaran' };
    }
    return { type: 'default', icon: '○', title: status, sub: '' };
  })());

  // Timeline steps
  let timelineSteps = $derived((() => {
    if (!transaction) return [];
    const { status, created_at, paid_at, released_at, completed_at } = transaction;

    const eventDate = new Date(transaction.ticket?.event?.event_datetime || transaction.created_at);
    const threeDaysAfterEvent = new Date(eventDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    const now = new Date();
    
    const isReleased = now > threeDaysAfterEvent && (status === 'completed' || status === 'paid');
    const isPaid = status === 'completed' || status === 'paid';

    return [
      { label: 'Pesanan dibuat', date: created_at, done: true },
      { label: 'Pembayaran diterima', date: paid_at, done: !!paid_at || isPaid },
      {
        label: 'Dana ditahan',
        date: paid_at,
        done: isPaid,
        active: isPaid && !isReleased
      },
      { label: 'Masa Retensi Selesai (H+3)', date: isReleased ? (released_at || completed_at || now.toISOString()) : null, done: isReleased },
      {
        label: 'Dana masuk ke seller',
        date: isReleased ? (released_at || completed_at || now.toISOString()) : null,
        done: isReleased
      }
    ];
  })());

  // Platform fee (5%)
  let platformFee = $derived(transaction ? transaction.service_fee || (transaction.amount * 0.05) : 0);
  let netAmount = $derived(transaction ? transaction.amount - platformFee : 0);
</script>

<div class="min-h-[100dvh] bg-[#0A0910] text-[#E8E8EC] font-sans text-sm w-full mx-auto relative">
  <!-- Back Button -->
  <div class="px-4 pt-12 pb-4 z-50">
    <a href="javascript:history.back()" class="w-10 h-10 bg-[#1A1825] border border-[#232033] rounded-full flex items-center justify-center transition-transform active:scale-95 text-white">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
    </a>
  </div>

  <main class="p-4 pb-24 flex flex-col gap-2">
    {#if loading}
      <div class="flex flex-col items-center justify-center gap-4 py-20 px-5">
        <div class="w-7 h-7 border-2 border-white/10 border-t-[#4AE38A] rounded-full animate-spin"></div>
        <p class="text-[#666] text-center">Memuat detail transaksi…</p>
      </div>

    {:else if error}
      <div class="flex flex-col items-center justify-center gap-4 py-20 px-5">
        <p class="text-red-400 text-center">{error}</p>
        <button class="bg-white/10 border-none rounded-lg text-[#E8E8EC] px-5 py-2.5 cursor-pointer text-sm" onclick={fetchTransaction}>Coba Lagi</button>
      </div>

    {:else if transaction}

      {#if escrowBanner}
        <div class="rounded-[14px] px-4 py-3.5 flex items-center gap-3 mb-1 {escrowBanner.type === 'success' ? 'bg-[#4AE38A]/10 border border-[#4AE38A]/20' : escrowBanner.type === 'escrow' ? 'bg-orange-400/10 border border-orange-400/25' : escrowBanner.type === 'pending' ? 'bg-slate-400/10 border border-slate-400/20' : 'bg-white/5 border border-white/10'}">
          <span class="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0 font-bold {escrowBanner.type === 'success' ? 'bg-[#4AE38A]/20 text-[#4AE38A]' : escrowBanner.type === 'escrow' ? 'bg-orange-400/20 text-orange-400' : escrowBanner.type === 'pending' ? 'bg-slate-400/15 text-slate-400' : 'bg-white/10 text-white'}">{escrowBanner.icon}</span>
          <div>
            <p class="text-sm font-semibold {escrowBanner.type === 'success' ? 'text-[#4AE38A]' : escrowBanner.type === 'escrow' ? 'text-orange-400' : ''}">{escrowBanner.title}</p>
            <p class="text-[11px] text-[#666] mt-0.5">{escrowBanner.sub}</p>
          </div>
        </div>
      {/if}

      <section class="flex flex-col gap-2">
        <h2 class="text-[10px] font-bold tracking-[0.12em] text-[#555] uppercase px-0.5">INFORMASI BUYER</h2>
        <div class="bg-[#16161C] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <span class="text-sm font-semibold">@{transaction.buyer?.name?.toLowerCase().replace(' ', '_') ?? '—'}</span>
                <span class="w-4 h-4 bg-[#4AE38A] rounded-full flex items-center justify-center text-[9px] text-[#0D0D10] font-extrabold">✓</span>
              </div>
              <div class="flex items-center gap-1 mt-1">
                <span class="text-amber-400 text-xs">★</span>
                <span class="text-xs font-semibold text-[#E8E8EC]">4.8</span>
                <span class="text-[11px] text-[#555]">· Verified Buyer</span>
              </div>
            </div>
          </div>
          <button class="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-[#E8E8EC] transition-colors hover:bg-white/10 shrink-0" title="Hubungi Buyer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </section>

      <section class="flex flex-col gap-2 mt-2">
        <h2 class="text-[10px] font-bold tracking-[0.12em] text-[#555] uppercase px-0.5">DETAIL TIKET</h2>
        <div class="bg-[#16161C] border border-white/5 rounded-2xl p-4">
          <p class="text-base font-bold mb-3.5 tracking-tight">
            {transaction.ticket?.event?.event_name ?? transaction.ticket?.id ?? 'Event'}
          </p>
          <div class="flex flex-col gap-3">
            <div class="flex items-start gap-2.5">
              <span class="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center text-[#888] shrink-0 mt-px">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/>
                  <path d="M3 9h18M9 4v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </span>
              <div class="flex flex-col gap-px">
                <span class="text-[10px] text-[#555] uppercase tracking-wider">Tanggal Event</span>
                <span class="text-[13px] font-medium text-[#D0D0D8]">
                  {transaction.ticket?.event?.event_datetime
                    ? new Date(transaction.ticket.event.event_datetime).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                    : '—'}
                </span>
              </div>
            </div>
            <div class="flex items-start gap-2.5">
              <span class="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center text-[#888] shrink-0 mt-px">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" stroke-width="1.8"/>
                  <circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.8"/>
                </svg>
              </span>
              <div class="flex flex-col gap-px">
                <span class="text-[10px] text-[#555] uppercase tracking-wider">Lokasi</span>
                <span class="text-[13px] font-medium text-[#D0D0D8]">
                  {transaction.ticket?.event?.venue_name ?? '—'}
                  {#if transaction.ticket?.event?.city}, {transaction.ticket.event.city}{/if}
                </span>
              </div>
            </div>
            <div class="flex items-start gap-2.5">
              <span class="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center text-[#888] shrink-0 mt-px">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
                  <path d="M9 9h3v6m0 0H9m3 0h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </span>
              <div class="flex flex-col gap-px">
                <span class="text-[10px] text-[#555] uppercase tracking-wider">Kategori</span>
                <span class="text-[13px] font-medium text-[#D0D0D8]">VIP</span>
              </div>
            </div>
            <div class="flex items-start gap-2.5">
              <span class="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center text-[#888] shrink-0 mt-px">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/>
                  <path d="M7 7V5a5 5 0 0 1 10 0v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </span>
              <div class="flex flex-col gap-px">
                <span class="text-[10px] text-[#555] uppercase tracking-wider">Order ID</span>
                <span class="font-mono text-[13px] font-medium text-[#D0D0D8]">{transaction.ticket?.id?.slice(-8).toUpperCase() ?? '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="flex flex-col gap-2 mt-2">
        <h2 class="text-[10px] font-bold tracking-[0.12em] text-[#555] uppercase px-0.5">DETAIL TRANSAKSI</h2>
        <div class="bg-[#16161C] border border-white/5 rounded-2xl p-4 flex flex-col gap-2.5">
          <div class="flex justify-between items-center">
            <span class="text-[13px] text-[#777]">Tanggal Pembelian</span>
            <span class="text-[13px] font-medium text-[#D0D0D8]">{formatDate(transaction.created_at)}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[13px] text-[#777]">Metode Pembayaran</span>
            <span class="flex items-center gap-1.5 text-[13px] font-medium text-[#D0D0D8]">
              <span class="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-extrabold text-white bg-[#00AED6]">G</span>GoPay
            </span>
          </div>
          <div class="h-px bg-white/5 my-1"></div>
          <div class="flex justify-between items-center">
            <span class="text-[13px] text-[#777]">Harga Tiket</span>
            <span class="text-[13px] font-medium text-[#D0D0D8]">{formatRupiah(transaction.amount)}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[13px] text-[#777]">Platform Fee (5%)</span>
            <span class="text-[13px] font-medium text-[#D0D0D8] !text-red-400">{formatRupiah(platformFee)}</span>
          </div>
          <div class="h-px bg-white/5 my-1"></div>
          <div class="flex justify-between items-center mt-0.5">
            <span class="text-sm font-semibold text-[#E8E8EC]">Pendapatan Kamu</span>
            <span class="text-base font-bold text-[#4AE38A] tracking-tight">{formatRupiah(netAmount)}</span>
          </div>
        </div>
      </section>

      <section class="flex flex-col gap-2 mt-2">
        <h2 class="text-[10px] font-bold tracking-[0.12em] text-[#555] uppercase px-0.5">TIMELINE</h2>
        <div class="bg-[#16161C] border border-white/5 rounded-2xl pt-4 px-4 pb-2 flex flex-col">
          {#each timelineSteps as step, i}
            <div class="flex gap-3">
              <div class="flex flex-col items-center w-5 shrink-0">
                <div class="w-5 h-5 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-200 {step.done ? 'bg-[#4AE38A] border-[#4AE38A]' : step.active ? 'bg-orange-400 border-orange-400 shadow-[0_0_0_rgba(251,146,60,0.4)] animate-[pulse_1.5s_infinite]' : 'bg-[#222229] border-[#333]'}">
                  {#if step.done}
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  {:else}
                    <div class="w-1.5 h-1.5 rounded-full bg-[#444]"></div>
                  {/if}
                </div>
                {#if i < timelineSteps.length - 1}
                  <div class="w-0.5 flex-1 min-h-[20px] my-1 {step.done ? 'bg-[#4AE38A]/30' : 'bg-[#252528]'}"></div>
                {/if}
              </div>
              <div class="flex-1 pt-px pb-4 {i === timelineSteps.length - 1 ? '!pb-0' : ''}">
                <p class="text-[13px] font-medium {step.done ? 'text-[#D0D0D8]' : 'text-[#666]'}">{step.label}</p>
                {#if step.date}
                  <p class="text-[11px] text-[#444] mt-1">{formatShortDate(step.date)}</p>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </section>

      {#if transaction.status === 'pending'}
        <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 pt-3 pb-[env(safe-area-inset-bottom,1rem)] bg-[#0A0910]/95 backdrop-blur-md border-t border-[#232033] z-20 shadow-[0_-10px_20px_-5px_rgba(10,9,16,0.9)]">
          <button class="w-full p-4 bg-[#4AE38A] text-[#0D0D10] border-none rounded-xl text-[15px] font-bold cursor-pointer transition-all active:scale-95 disabled:opacity-50 tracking-tight" onclick={simulatePayment} disabled={simulatingPayment}>
            {simulatingPayment ? 'Memproses…' : 'Simulasikan Pembayaran'}
          </button>
        </div>
      {/if}

    {/if}
  </main>
</div>