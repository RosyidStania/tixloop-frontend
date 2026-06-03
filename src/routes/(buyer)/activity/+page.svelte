<script>
  import BottomNav from '$lib/components/layout/BottomNav.svelte';

  // --- STATE SVELTE 5 ---
  let activeCategory = $state('All');
  const categories = ['All', 'Concert', 'Cinema', 'Sports', 'Festival'];

  let activeTab = $state('aktif'); 
  const statusTabs = [
    { id: 'aktif', label: 'Tiket Aktif', count: 2, icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
    { id: 'riwayat', label: 'Riwayat', count: 2, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'dispute', label: 'Dispute', count: 1, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' }
  ];

  // State untuk Dropdown Tab Riwayat
  let expandedTickets = $state({});
  function toggleDropdown(id) {
    expandedTickets[id] = !expandedTickets[id];
  }

  // --- DATA DUMMY ---
  
  // 1. Data Tiket Aktif
  const activeTickets = [
    {
      id: 'TIX-2026-10132',
      status: 'Dikonfirmasi',
      statusColor: 'text-[#D4FF00]',
      statusIcon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
      timeLeft: '25d lagi',
      title: 'Cold Play 2026',
      desc: 'General Admission • Juni 15, 2026',
      location: 'Jakarta Convention Center, Jakarta',
      escrowStatus: 'Dana Terkirim',
      escrowColor: 'text-[#D4FF00] border-[#D4FF00]/30 bg-[#D4FF00]/10',
      price: 'Rp 450.000',
      image: 'https://images.unsplash.com/photo-1540039155733-d7696d54af58?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'TIX-2026-10089',
      status: 'Dalam Transfer',
      statusColor: 'text-[#FF8A00]',
      statusIcon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>',
      timeLeft: '28d lagi',
      title: 'Rock Night Live',
      desc: 'Festival Area • June 18, 2026',
      location: 'Gelora Bung Karno, Jakarta',
      escrowStatus: 'Dana Ditahan',
      escrowColor: 'text-[#FF8A00] border-[#FF8A00]/30 bg-[#FF8A00]/10',
      price: 'Rp 595.000',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80'
    }
  ];

  // 2. Data Riwayat (Selesai)
  const historyTickets = [
    {
      id: 'TIX-2026-10132',
      status: 'Selesai',
      title: 'Cold Play 2026',
      desc: 'General Admission • 20 Juni 2026',
      location: 'Jakarta Convention Center, Jakarta',
      price: 450000,
      serviceFee: 15000,
      escrowFee: 5000,
      totalPrice: 'Rp 470.000',
      paymentMethod: 'GoPay',
      purchaseDate: '20 Mei 2026',
      image: 'https://images.unsplash.com/photo-1540039155733-d7696d54af58?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'TIX-2026-09882',
      status: 'Selesai',
      title: 'Jazz Festival 2026',
      desc: 'VIP Area • 10 Mei 2026',
      location: 'JIExpo Kemayoran, Jakarta',
      price: 830000,
      serviceFee: 15000,
      escrowFee: 5000,
      totalPrice: 'Rp 850.000',
      paymentMethod: 'BCA Virtual Account',
      purchaseDate: '02 Mei 2026',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80'
    }
  ];

  // 3. Data Dispute
  const disputeTickets = [
    {
      id: 'TIX-2026-10132',
      status: 'Menunggu Respon Penjual',
      statusColor: 'text-[#FF3366] bg-[#FF3366]/10 border-[#FF3366]/30',
      deadline: 'Batas respon: 23j 45m',
      title: 'Cold Play 2026',
      desc: 'General Admission • 20 Juni 2026',
      location: 'Jakarta Convention Center, Jakarta',
      price: 'Rp 470.000',
      image: 'https://images.unsplash.com/photo-1540039155733-d7696d54af58?w=600&auto=format&fit=crop&q=80'
    }
  ];
</script>

<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-28 pt-12 overflow-x-hidden">
  <div class="px-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Activity</h1>
      <button class="flex items-center gap-2 px-4 py-2 rounded-full border bg-[#2D234A] border-[#C7A4FF] text-[#C7A4FF] transition-transform active:scale-95">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
        <span class="text-sm font-semibold">Filter</span>
      </button>
    </div>

    <div class="relative mb-6">
      <svg class="w-5 h-5 absolute left-4 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
      <input type="text" placeholder="Search event, artist, city..." class="w-full bg-[#1A1825] text-sm text-white rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-1 focus:ring-[#D4FF00] placeholder-gray-500" />
    </div>

    <div class="flex overflow-x-auto hide-scrollbar gap-3 mb-6">
      {#each categories as cat}
        <button 
          class="px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors {activeCategory === cat ? 'bg-[#D4FF00] text-black' : 'bg-[#1A1825] text-gray-400'}"
          on:click={() => activeCategory = cat}>
          {cat}
        </button>
      {/each}
    </div>

    <div class="bg-[#14121E] rounded-2xl p-1.5 flex gap-1 mb-6 border border-[#232033]">
      {#each statusTabs as tab}
        <div class="flex-1 rounded-xl py-2.5 flex items-center justify-center gap-2 cursor-pointer transition-all {activeTab === tab.id ? 'bg-[#232033] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}" on:click={() => activeTab = tab.id}>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={tab.icon}></path>
          </svg>
          <span class="text-xs font-semibold">{tab.label}</span>
          <span class="w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold {activeTab === tab.id ? 'bg-[#D4FF00] text-black' : 'bg-[#1A1825] text-gray-500'}">{tab.count}</span>
        </div>
      {/each}
    </div>

    {#if activeTab === 'aktif'}
      <div class="space-y-4">
        {#each activeTickets as ticket}
          <div class="bg-[#14121E] rounded-3xl overflow-hidden border border-[#232033]">
            <div class="relative h-28 bg-cover bg-center" style="background-image: url('{ticket.image}');">
              <div class="absolute inset-0 bg-gradient-to-b from-[#14121E]/80 via-[#14121E]/90 to-[#14121E]"></div>
              <div class="absolute inset-0 p-4 flex flex-col justify-between">
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-1.5 {ticket.statusColor} text-[10px] font-bold">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{@html ticket.statusIcon}</svg>
                    {ticket.status}
                  </div>
                  <span class="text-[10px] text-gray-400 font-medium">{ticket.timeLeft}</span>
                </div>
                <div>
                  <h3 class="font-bold text-lg text-white mb-0.5">{ticket.title}</h3>
                  <p class="text-[10px] text-gray-400">{ticket.desc}</p>
                </div>
              </div>
            </div>

            <div class="p-4 pt-2">
              <div class="flex items-center gap-1.5 text-[10px] text-gray-400 mb-4">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                {ticket.location}
              </div>

              <div class="rounded-xl p-3 flex justify-between items-center mb-4 {ticket.escrowColor} border">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  <span class="text-xs font-bold">{ticket.escrowStatus}</span>
                </div>
                <span class="text-xs font-bold text-gray-300">{ticket.price}</span>
              </div>

              <div class="flex flex-col items-center border-t border-dashed border-[#232033] pt-4 mt-2">
                <p class="text-[11px] text-gray-400 mb-3">Tunjukkan QR ini ke Petugas Scan</p>
                <a href="/my-ticket/{ticket.id}" class="w-full bg-[#D4FF00] text-[#0A0910] text-sm font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-[0_4px_15px_rgba(212,255,0,0.15)]">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Lihat Tiket QR
                </a>
              </div>
              
            </div>
          </div>
        {/each}
      </div>

    {:else if activeTab === 'riwayat'}
      <div class="space-y-4">
        {#each historyTickets as history}
          <div class="bg-[#14121E] rounded-3xl overflow-hidden border border-[#232033] transition-all duration-300">
            <div class="p-4 cursor-pointer hover:bg-[#1A1825]/40 transition-colors flex justify-between items-center" on:click={() => toggleDropdown(history.id)}>
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl overflow-hidden grayscale relative">
                  <img src={history.image} alt="Event" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-[#14121E]/30"></div>
                </div>
                <div>
                  <h3 class="font-bold text-sm text-white mb-0.5">{history.title}</h3>
                  <p class="text-[10px] text-gray-400">{history.desc}</p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <div class="flex items-center gap-1 bg-[#1A2000] border border-[#D4FF00]/30 text-[#D4FF00] px-2 py-0.5 rounded-full text-[9px] font-bold">
                  Selesai
                </div>
                <svg class="w-5 h-5 text-gray-500 transition-transform duration-300 {expandedTickets[history.id] ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>

            {#if expandedTickets[history.id]}
              <div class="px-5 py-4 bg-[#181524] border-t border-[#232033] space-y-3 text-xs text-gray-300">
                <div class="flex items-center gap-1.5 text-[10px] text-gray-400 mb-2">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                  {history.location}
                </div>
                <div class="bg-[#12101A] p-3 rounded-xl space-y-2 border border-[#232033]/50 font-sans">
                  <div class="flex justify-between text-[11px]">
                    <span class="text-gray-400">Harga Tiket</span>
                    <span>Rp {history.price.toLocaleString('id-ID')}</span>
                  </div>
                  <div class="flex justify-between text-[11px]">
                    <span class="text-gray-400">Biaya Layanan & Escrow</span>
                    <span>Rp {(history.serviceFee + history.escrowFee).toLocaleString('id-ID')}</span>
                  </div>
                  <div class="flex justify-between text-[11px]">
                    <span class="text-gray-400">Metode Pembayaran</span>
                    <span class="text-white font-medium">{history.paymentMethod}</span>
                  </div>
                  <div class="flex justify-between text-[11px] pt-1.5 border-t border-gray-800 font-bold">
                    <span class="text-white">Total Dibayar</span>
                    <span class="text-[#D4FF00]">{history.totalPrice}</span>
                  </div>
                </div>
                <p class="text-[9px] text-gray-500 font-mono">Order ID: {history.id} • Dibeli pada {history.purchaseDate}</p>
              </div>
            {/if}

            <div class="p-4 bg-[#1A1825]/50 border-t border-[#232033]/40 flex justify-between items-center">
              <div>
                <p class="text-[9px] text-gray-500 mb-0.5">Total Harga</p>
                <p class="text-xs font-bold text-white">{history.totalPrice}</p>
              </div>
              <div class="flex gap-2">
                <a href="/invoice/{history.id}" class="px-4 py-2 rounded-xl border border-[#232033] text-gray-300 text-xs font-bold transition-transform active:scale-95 flex items-center">E-Receipt</a>
                <button class="px-4 py-2 rounded-xl bg-[#D4FF00] text-black text-xs font-bold transition-transform active:scale-95">Beli Lagi</button>
              </div>
            </div>
          </div>
        {/each}
      </div>

    {:else if activeTab === 'dispute'}
      <div class="space-y-4">
        {#each disputeTickets as dispute}
          <div class="bg-[#14121E] rounded-3xl overflow-hidden border border-[#FF3366]/30 shadow-[0_0_15px_rgba(255,51,102,0.05)]">
            <div class="p-4 border-b border-[#232033]">
              <div class="flex justify-between items-center mb-3">
                <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold {dispute.statusColor} border">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {dispute.status}
                </div>
                <span class="text-[10px] font-bold text-[#FF8A00]">{dispute.deadline}</span>
              </div>
              
              <div class="flex items-center gap-3">
                <div class="w-16 h-16 rounded-xl overflow-hidden relative">
                  <img src={dispute.image} alt="Event" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-[#14121E]/10"></div>
                </div>
                <div>
                  <h3 class="font-bold text-sm text-white mb-0.5">{dispute.title}</h3>
                  <p class="text-[10px] text-gray-400 mb-1">{dispute.desc}</p>
                  <div class="flex items-center gap-1 text-[9px] text-gray-500">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                    {dispute.location}
                  </div>
                </div>
              </div>
            </div>

            <div class="p-4 bg-[#1A1825]/50 flex justify-between items-center">
              <div>
                <p class="text-[9px] text-gray-500 mb-0.5">Total Harga</p>
                <p class="text-xs font-bold text-white">{dispute.price}</p>
              </div>
              <a href="/dispute/{dispute.id}" class="px-5 py-2.5 rounded-xl bg-[#FF3366] text-white text-xs font-bold transition-transform active:scale-95 flex items-center gap-1.5">
                Detail Dispute
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </a>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <BottomNav activeTab="activity" />
</main>

<style>
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>