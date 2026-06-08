<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import BottomNav from '$lib/components/seller/layout/BottomNav.svelte';
  import { ticketService } from '$lib/services/api/ticketService';

  // State untuk listing
  let listing = $state({
    id: '',
    title: 'Loading...',
    category: '',
    date: '',
    location: '',
    harga: '0',
    originalHarga: '0',
    views: 0,
    watchers: 0,
    daysLeft: 0,
    autoDrop: true,
    status: 'active'
  });

  let hargaDisplay = $state('0');
  let autoDrop = $state(true);
  let isSaving = $state(false);
  let showDraftModal = $state(false);
  let isLoading = $state(true);

  onMount(async () => {
    try {
      const response = await ticketService.getTicketDetail($page.params.id);
      const t = response.data;
      listing = {
        id: t.id,
        title: t.event ? t.event.event_name : 'Unknown Event',
        category: t.ticket_category || 'General',
        date: t.event ? new Date(t.event.event_datetime).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}) : '',
        location: t.event ? t.event.venue_name : '',
        harga: t.original_price,
        originalHarga: Number(t.original_price || 0).toLocaleString('id-ID'),
        views: t.views || 0,
        watchers: t.watchers || 0,
        daysLeft: 0,
        autoDrop: true,
        status: t.status || 'active'
      };
      hargaDisplay = listing.harga;
    } catch (error) {
      console.error(error);
    } finally {
      isLoading = false;
    }
  });

  function handleHargaInput(e) {
    const digits = e.target.value.replace(/\D/g, '');
    hargaDisplay = digits;
  }

  function formatRp(val) {
    return val; // Disesuaikan dengan mockup yang tidak menggunakan titik pada input aktif
  }

  async function handleSave() {
    if (isSaving) return;
    isSaving = true;
    await new Promise(r => setTimeout(r, 1200)); // TODO: Call update API later
    isSaving = false;
    goto('/seller/listings');
  }
</script>

<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-28">

  <div class="px-4 pt-12 pb-4 flex items-center justify-between">
    <button onclick={() => goto('/seller/listings')} class="w-8 h-8 bg-[#1A1825] rounded-full flex items-center justify-center active:scale-90 transition-transform">
      <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
    <h1 class="text-base font-black">Edit Listing</h1>
    <button class="w-8 h-8 flex items-center justify-center active:scale-90 transition-transform">
      <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 6h18"/>
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
        <line x1="10" y1="11" x2="10" y2="17"/>
        <line x1="14" y1="11" x2="14" y2="17"/>
      </svg>
    </button>
  </div>

  <div class="px-4 space-y-4">

    <div class="bg-[#14121E] border border-[#232033] rounded-2xl p-4 space-y-3">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-[#1C2210] flex items-center justify-center shrink-0">
          <svg class="w-6 h-6 text-[#AAEF45]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 9a1 1 0 011-1h18a1 1 0 011 1v1a2 2 0 010 4v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-1a2 2 0 010-4V9z"/>
            <line x1="12" y1="8" x2="12" y2="16" stroke-dasharray="2 2"/>
          </svg>
        </div>
        <div>
          <p class="text-sm font-black text-white">{listing.title}</p>
          <p class="text-[11px] font-medium text-gray-500">{listing.category}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 pt-3 border-t border-[#1E1C2E]">
        <div class="bg-[#1A1825] rounded-xl p-3 text-center">
          <p class="text-[10px] text-gray-500 mb-0.5">Date</p>
          <p class="text-[12px] font-bold text-white">{listing.date}</p>
        </div>
        <div class="bg-[#1A1825] rounded-xl p-3 text-center">
          <p class="text-[10px] text-gray-500 mb-0.5">Location</p>
          <p class="text-[12px] font-bold text-white truncate px-1">{listing.location}</p>
        </div>
      </div>
    </div>

    <div class="flex flex-row gap-3"> 
      <div class="flex-1 bg-[#14121E] border border-[#232033] rounded-2xl p-3 flex flex-col items-center justify-center text-center">
        <svg class="w-5 h-5 text-[#A855F7] mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        <p class="text-base font-black text-white">{listing.views}</p>
        <p class="text-[10px] text-gray-500 mt-0.5">Views</p>
      </div>

      <div class="flex-1 bg-[#14121E] border border-[#232033] rounded-2xl p-3 flex flex-col items-center justify-center text-center">
        <svg class="w-5 h-5 text-[#EAB308] mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <p class="text-base font-black text-white">{listing.watchers}</p>
        <p class="text-[10px] text-gray-500 mt-0.5">Watchers</p>
      </div>

      <div class="flex-1 bg-[#14121E] border border-[#232033] rounded-2xl p-3 flex flex-col items-center justify-center text-center">
        <svg class="w-5 h-5 text-[#F97316] mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
          <path d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"/>
        </svg>
        <p class="text-base font-black text-white">{listing.daysLeft}d</p>
        <p class="text-[10px] text-gray-500 mt-0.5">Days Left</p>
      </div>
    </div>

    <div>
      <p class="text-[11px] font-black text-gray-500 tracking-widest uppercase mb-2">Harga Jual</p>
      <div class="bg-[#14121E] border border-[#232033] rounded-xl flex items-center px-4 py-4 transition-colors">
        <span class="text-sm font-bold text-gray-500 shrink-0 mr-3">Rp</span>
        <input
          type="text"
          inputmode="numeric"
          value={formatRp(hargaDisplay)}
          oninput={handleHargaInput}
          class="flex-1 bg-transparent text-sm font-black text-[#AAEF45] outline-none"
        />
      </div>
      <p class="text-[11px] text-gray-600 mt-2">Original: Rp {listing.originalHarga}</p>
    </div>

    <div class="bg-[#14121E] border border-[#AAEF45]/30 rounded-2xl p-4">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-[#AAEF45]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          <span class="text-sm font-bold text-white">Auto Drop Price</span>
        </div>
        <button
          onclick={() => autoDrop = !autoDrop}
          class="relative w-11 h-6 rounded-full transition-colors duration-200 {autoDrop ? 'bg-[#AAEF45]' : 'bg-[#2a2840]'}"
        >
          <span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 {autoDrop ? 'translate-x-5' : 'translate-x-0'}"></span>
        </button>
      </div>
      <p class="text-[11px] text-gray-500 leading-relaxed pr-4">Turunkan harga otomatis 10% setiap 7 hari mendekati tanggal event</p>
    </div>

    <div class="bg-[#14121E] border border-[#AAEF45]/30 rounded-2xl p-4 flex items-start gap-3">
      <svg class="w-5 h-5 text-[#AAEF45] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <div>
        <p class="text-sm font-bold text-[#AAEF45]">Listing Aktif</p>
        <p class="text-[11px] text-gray-500 mt-1">Tiket ini sedang ditampilkan di marketplace</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 pt-2">
      <button
        onclick={() => showDraftModal = true}
        class="py-4 rounded-xl bg-[#E11D48]/10 border border-[#E11D48]/20 text-[#E11D48] text-sm font-bold active:scale-[0.98] transition-transform"
      >
        Pause Listing
      </button>
      <button class="py-4 rounded-xl bg-[#EA580C]/10 border border-[#EA580C]/20 text-[#EA580C] text-sm font-bold active:scale-[0.98] transition-transform">
        Mark as Sold
      </button>
    </div>

    <button
      onclick={handleSave}
      disabled={isSaving}
      class="w-full mt-2 py-4 rounded-xl bg-[#AAEF45] text-[#0A0910] text-sm font-black shadow-[0_0_20px_rgba(170,239,69,0.2)] active:scale-[0.98] transition-all {isSaving ? 'opacity-70' : ''}"
    >
      {#if isSaving}
        <span class="flex items-center justify-center gap-2">
          <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Menyimpan...
        </span>
      {:else}
        Save Changes
      {/if}
    </button>

  </div>
</main>

<BottomNav activeTab="listings" />

{#if showDraftModal}
  <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center px-4 pb-8" onclick={() => showDraftModal = false}>
    <div class="w-full bg-[#14121E] border border-[#232033] rounded-3xl overflow-hidden" onclick={(e) => e.stopPropagation()}>
      <div class="flex justify-center pt-3 pb-1">
        <div class="w-10 h-1 rounded-full bg-[#2a2840]"></div>
      </div>

      <div class="px-5 pb-6 pt-2 space-y-5">
        <div class="flex flex-col items-center text-center gap-3 pt-2">
          <div class="w-14 h-14 rounded-full bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
            <svg class="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div>
            <p class="text-base font-black text-white">Draft Listing?</p>
            <p class="text-[12px] text-gray-500 mt-1 leading-relaxed">Listing akan ditarik dari marketplace dan disimpan sebagai draft</p>
          </div>
        </div>

        <div class="bg-[#1A1825] border border-[#2a2840] rounded-2xl px-4 py-3 flex items-center justify-between">
          <div>
            <p class="text-sm font-bold text-white">{listing.title}</p>
            <p class="text-[11px] text-gray-500 mt-0.5">{listing.category}</p>
          </div>
          <p class="text-sm font-black text-[#AAEF45]">Rp {listing.originalHarga}</p>
        </div>

        <div class="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 flex items-start gap-2.5">
          <svg class="w-4 h-4 text-orange-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div>
            <p class="text-[12px] font-bold text-orange-400">Perhatian</p>
            <p class="text-[11px] text-orange-300/70 mt-0.5 leading-relaxed">{listing.watchers} watcher akan kehilangan akses ke listing ini. Stats views dan watchers akan direset.</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="bg-[#1A1825] border border-[#2a2840] rounded-xl p-3 text-center">
            <p class="text-[10px] text-gray-600 mb-1">Current Views</p>
            <p class="text-lg font-black text-white">{listing.views}</p>
          </div>
          <div class="bg-[#1A1825] border border-[#2a2840] rounded-xl p-3 text-center">
            <p class="text-[10px] text-gray-600 mb-1">Current Watchers</p>
            <p class="text-lg font-black text-white">{listing.watchers}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button
            onclick={() => showDraftModal = false}
            class="py-3.5 rounded-2xl bg-[#1A1825] border border-[#2a2840] text-sm font-bold text-gray-300 active:scale-95 transition-transform"
          >
            Batal
          </button>
          <button
            onclick={() => { showDraftModal = false; goto('/seller/listings'); }}
            class="py-3.5 rounded-2xl bg-orange-500 text-white text-sm font-bold active:scale-95 transition-transform shadow-[0_4px_16px_rgba(249,115,22,0.3)]"
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}