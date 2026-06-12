<script>
  import { page } from '$app/stores';

  import { onMount } from 'svelte';
  import api from '$lib/axios';

  const ticketId = $page.params.id;
  let ticket = $state(null);
  let isLoading = $state(true);

  onMount(async () => {
    try {
      const res = await api.get(`/tickets/${ticketId}`);
      const t = res.data.data || res.data;
      
      ticket = {
        id: t.id,
        ticketCode: t.ticket_code || t.id,
        eventName: t.event?.event_name || 'Event',
        date: new Date(t.event?.event_datetime).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        venue: t.event?.venue_name || 'Venue',
        proofImage: null
      };

      try {
        const photoRes = await api.get(`/tickets/${t.id}/physical-photo`, { responseType: 'blob' });
        ticket.proofImage = URL.createObjectURL(photoRes.data);
      } catch (err) {
        console.warn('Gagal memuat physical photo, mencoba invoice proof...');
        try {
          const proofRes = await api.get(`/tickets/${t.id}/proof`, { responseType: 'blob' });
          ticket.proofImage = URL.createObjectURL(proofRes.data);
        } catch (err2) {
          console.warn('Gagal memuat kedua gambar tiket:', err2);
        }
      }

    } catch (error) {
      console.error(error);
    } finally {
      isLoading = false;
    }
  });
</script>

{#if isLoading}
  <div class="flex justify-center items-center min-h-screen bg-[#0A0910]">
    <div class="w-8 h-8 border-4 border-[#D4FF00] border-t-transparent rounded-full animate-spin"></div>
  </div>
{:else if ticket}

<main class="bg-[#0A0910] min-h-screen text-white font-sans flex flex-col justify-center items-center px-4 relative">
  <!-- Back Button -->
  <div class="absolute top-12 left-4 z-50">
    <a href="javascript:history.back()" class="w-10 h-10 bg-[#14121E] border border-[#232033] rounded-full flex items-center justify-center transition-transform active:scale-95">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
    </a>
  </div>

  <div class="w-full max-w-sm bg-[#14121E] rounded-3xl p-8 border border-[#232033] flex flex-col items-center relative overflow-hidden shadow-2xl">
    <!-- Brightness reminder -->
    <div class="mb-6 flex items-center justify-center gap-2 text-[#D4FF00] bg-[#D4FF00]/10 px-4 py-2 rounded-full border border-[#D4FF00]/30 text-[10px] font-bold">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
      Tingkatkan Kecerahan Layar
    </div>

    <!-- Ticket Container -->
    <div class="bg-white p-2 rounded-xl mb-6 w-full flex items-center justify-center shadow-[0_0_30px_rgba(212,255,0,0.3)] overflow-hidden">
      {#if ticket.proofImage}
        <img src={ticket.proofImage} alt="Bukti Tiket" class="w-full h-auto object-contain max-h-[400px]" />
      {:else}
        <div class="w-full aspect-square flex items-center justify-center">
          <p class="text-sm text-gray-500">Gambar tiket tidak tersedia</p>
        </div>
      {/if}
    </div>
    
    <!-- Ticket Info -->
    <div class="flex items-center gap-2 bg-[#1A1825] border border-[#232033] px-6 py-3 rounded-2xl mb-6">
      <span class="text-[#D4FF00] font-mono font-bold text-lg tracking-widest">{ticket.ticketCode}</span>
    </div>

    <div class="text-center w-full">
      <h2 class="font-bold text-lg text-white mb-1">{ticket.eventName}</h2>
      <p class="text-xs text-gray-400">{ticket.date}</p>
      <p class="text-[10px] text-gray-500 mt-1">{ticket.venue}</p>
    </div>
  </div>
</main>
{/if}