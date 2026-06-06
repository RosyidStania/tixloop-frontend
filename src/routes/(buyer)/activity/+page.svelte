<script>
  import BottomNav from '$lib/components/buyer/layout/BottomNav.svelte';
  import { onMount } from 'svelte';
  import api from '$lib/axios';

  let activeCategory = $state('Semua');
  const categories = ['Semua', 'Konser', 'Bioskop', 'Olahraga', 'Festival'];

  let activeTab = $state('aktif');

  let activeTickets = $state([]);
  let historyTickets = $state([]);
  let refundTickets = $state([]);
  let isLoading = $state(true);

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
    try {
      const response = await api.get('/tickets');
      const tickets = response.data.data || [];

      activeTickets = tickets.map(t => {
        const isDihantar = t.status === 'dalam_transfer';
        return {
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
          price: `Rp ${(t.ticket_metadata?.price || 450000).toLocaleString('id-ID')}`,
          orderId: `TTX-2026-${t.id?.toString().padStart(5, '0') || '10132'}`,
          image: t.event?.event_poster_url || 'https://images.unsplash.com/photo-1540039155733-d7696d54af58?w=600&auto=format&fit=crop&q=80'
        };
      });

      historyTickets = [
        {
          id: 'TIX-2025-00123',
          image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&h=200&fit=crop',
          title: 'Soundrenaline 2025',
          desc: '1 Tiket • VIP Area',
          location: 'Ancol, Jakarta',
          price: 850000,
          serviceFee: 25000,
          escrowFee: 15000,
          paymentMethod: 'BCA Virtual Account',
          totalPrice: 'Rp 890.000',
          purchaseDate: '10 Nov 2025'
        }
      ];
      refundTickets = [
        {
          id: 'TIX-2026-10132',
          status: 'Menunggu Respon Penjual',
          statusColor: 'text-[#FF8A00]',
          deadline: '23j 45m',
          image: 'https://picsum.photos/seed/concert/200/200',
          title: 'Cold Play 2026',
          desc: '1 Tiket • General Admission',
          location: 'Jakarta Convention Center, Jakarta',
          price: 'Rp 470.000'
        }
      ];
    } catch (e) {
      console.error('Failed to load tickets:', e);
    } finally {
      isLoading = false;
    }
  });
</script>

<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-28 pt-12 overflow-x-hidden">
  <div class="px-4">

    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold tracking-tight">Aktivitas</h1>
      <button class="flex items-center gap-2 px-4 py-2 rounded-full border bg-[#2D234A] border-[#C7A4FF]/60 text-[#C7A4FF] text-sm font-semibold transition-transform active:scale-95">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
        </svg>
        Filter
      </button>
    </div>

    <!-- Search -->
    <div class="relative mb-6">
      <svg class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      <input
        type="text"
        placeholder="Cari konser, festival, atau kota..."
        class="w-full bg-[#1A1825] text-sm text-white rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:ring-1 focus:ring-[#D4FF00]/50 placeholder-gray-600 border border-[#232033]"
      />
    </div>

    <!-- Category Pills -->
    <div class="flex overflow-x-auto hide-scrollbar gap-2 mb-6">
      {#each categories as cat}
        <button
          class="px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all active:scale-95
            {activeCategory === cat
              ? 'bg-[#D4FF00] text-black shadow-[0_2px_12px_rgba(212,255,0,0.2)]'
              : 'bg-[#1A1825] text-gray-400 border border-[#232033]'}"
          on:click={() => activeCategory = cat}>
          {cat}
        </button>
      {/each}
    </div>

    <!-- Tab Bar -->
    <div class="bg-[#14121E] rounded-2xl p-1.5 flex gap-1 mb-6 border border-[#232033]">
      {#each statusTabs as tab}
        <button
          class="flex-1 rounded-xl py-2.5 flex items-center justify-center gap-1.5 transition-all active:scale-95
            {activeTab === tab.id ? 'bg-[#2A2540] text-white' : 'text-gray-500 hover:text-gray-300'}"
          on:click={() => activeTab = tab.id}>
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

    <!-- Content -->
    {#if isLoading}
      <div class="flex justify-center items-center py-24">
        <div class="w-8 h-8 border-[3px] border-[#D4FF00] border-t-transparent rounded-full animate-spin"></div>
      </div>

    {:else if activeTab === 'aktif'}
      <div class="space-y-4">
        {#if activeTickets.length === 0}
          <div class="flex flex-col items-center justify-center py-20 text-gray-500 text-center gap-3">
            <svg class="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
            </svg>
            <p class="text-sm">Belum ada tiket aktif.</p>
          </div>
        {:else}
          {#each activeTickets as ticket}
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
                  <h3 class="font-bold text-lg text-white leading-tight">{ticket.title}</h3>
                  <p class="text-[10px] text-gray-400 mt-0.5">{ticket.ticketType} · {ticket.eventDate}</p>
                </div>
              </div>

              <!-- Card Body -->
              <div class="px-4 pt-3 pb-4 space-y-3">

                <!-- Location -->
                <div class="flex items-center gap-1.5 text-[10px] text-gray-400">
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
                <p class="text-[9px] text-gray-600 font-mono">Order : {ticket.orderId}</p>

                <!-- Actions -->
                <div class="flex gap-2 pt-1">
                  <a
                    href="/my-ticket/{ticket.id}/qr"
                    class="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-[#2E2B45] bg-[#1A1825] text-white text-xs font-bold transition-transform active:scale-95">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                    </svg>
                    Tiket QR
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
        {#if historyTickets.length === 0}
          <div class="flex flex-col items-center justify-center py-20 text-gray-500 text-center gap-3">
            <svg class="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-sm">Belum ada riwayat transaksi.</p>
          </div>
        {:else}
          {#each historyTickets as history}
            <div class="bg-[#14121E] rounded-3xl overflow-hidden border border-[#232033]">
              <div
                class="p-4 flex justify-between items-center cursor-pointer hover:bg-[#1A1825]/40 transition-colors"
                on:click={() => toggleDropdown(history.id)}>
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
        {#if refundTickets.length === 0}
          <div class="flex flex-col items-center justify-center py-20 text-gray-500 text-center gap-3">
            <svg class="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <p class="text-sm">Tidak ada refund saat ini.</p>
          </div>
        {:else}
          {#each refundTickets as refund}
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
</main>

<style>
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>