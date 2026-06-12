<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import api from '$lib/axios';
  import { resolveImageUrl } from '$lib/utils/image';

  let ticketId = $page.params.id;
  let ticket = $state(null);
  let isLoading = $state(true);
  let showQR = $state(false);
  let transactionId = $state(null);
  let isEscrowReleased = $state(false);
  let isReleasing = $state(false);
  let debugTx = $state('');

  onMount(async () => {
    try {
      const res = await api.get(`/tickets/${ticketId}`);
      const t = res.data.data || res.data;
      
      const eventDate = new Date(t.event?.event_datetime);
      const diffTime = Math.abs(eventDate - new Date());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      ticket = {
        id: t.id,
        ticketCode: t.ticket_code || t.id,
        status: t.status === 'aktif' ? 'Dikonfirmasi' : t.status,
        eventName: t.event?.event_name || 'Event',
        category: t.ticket_metadata?.type || 'General Admission',
        date: eventDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        time: eventDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        venue: t.event?.venue_name || 'Venue',
        city: t.event?.city || 'City',
        gate: t.ticket_metadata?.gate || '-',
        area: t.seat_number ? `Seat: ${t.seat_number}` : 'Festival',
        countdown: `${diffDays}d lagi`,
        price: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(t.ticket_metadata?.original_price || 0),
        escrowStatus: 'Dana Ditahan',

        image: resolveImageUrl(t.event?.event_poster_url),
        proofImage: null
      };

      try {
        const photoRes = await api.get(`/tickets/${t.id}/physical-photo`, { responseType: 'blob' });
        ticket.proofImage = URL.createObjectURL(photoRes.data);
      } catch (err) {
        console.warn('Gagal memuat physical photo, mencoba invoice proof...', err);
        try {
          const proofRes = await api.get(`/tickets/${t.id}/proof`, { responseType: 'blob' });
          ticket.proofImage = URL.createObjectURL(proofRes.data);
        } catch (err2) {
          console.warn('Gagal memuat kedua gambar tiket:', err2);
        }
      }
      try {
        const txRes = await api.get('/transactions');
        const txData = txRes.data.data || txRes.data;
        
        let found = null;
        if (Array.isArray(txData)) {
          found = txData.find(tx => String(tx.ticket_id) === String(t.id) || (tx.ticket && String(tx.ticket.id) === String(t.id)));
          if (found) {
            transactionId = found.id;
            if (found.status === 'completed') {
              isEscrowReleased = true;
              ticket.escrowStatus = 'Dana Diteruskan';
            }
          } else {
            debugTx = `Tx array length: ${txData.length}. No tx found for ticket_id=${t.id}`;
          }
        } else {
          debugTx = `txData is not an array: ${typeof txData}`;
        }
      } catch (err) {
        debugTx = `Error fetching /transactions: ${err.message}`;
        console.warn('Gagal fetch data transaksi untuk status escrow:', err);
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
<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-12 overflow-x-hidden">
  <div class="fixed top-0 w-full px-4 pt-12 pb-4 flex justify-between items-center z-50 bg-gradient-to-b from-[#0A0910]/90 to-transparent">
    <a href="javascript:history.back()" class="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center transition-transform active:scale-95">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
    </a>
    <div class="flex gap-3">
      <button class="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center transition-transform active:scale-95">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
      </button>
      <button class="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center transition-transform active:scale-95">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
      </button>
    </div>
  </div>

  <div class="px-4 pt-24 mb-6">
    <div class="bg-[#14121E] rounded-[2rem] overflow-hidden border border-[#232033] relative shadow-2xl">
      <div class="relative h-48 bg-cover bg-center" style="background-image: url('{ticket.image}');">
        <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#14121E]"></div>
        
        <div class="absolute top-4 left-4 flex items-center gap-1 text-[#D4FF00] text-[10px] font-bold">
           <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
           {ticket.status}
        </div>

        <div class="absolute bottom-4 left-4 right-4">
          <div class="flex items-center gap-1.5 text-xs text-[#D4FF00] font-semibold mb-1">🎵 Concert</div>
          <h1 class="text-2xl font-bold text-white mb-0.5">{ticket.eventName}</h1>
          <p class="text-xs text-gray-300">Various Artists</p>
        </div>
      </div>

      <div class="flex px-4 py-4 gap-3">
        <div class="flex-1 bg-[#1A1825] p-3 rounded-2xl flex items-center gap-2">
          <div class="w-8 h-8 bg-[#232033] rounded-full flex items-center justify-center text-[#D4FF00]">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          <div>
            <p class="text-xs font-bold">{ticket.date}</p>
            <p class="text-[10px] text-gray-400">{ticket.time}</p>
          </div>
        </div>
        <div class="flex-1 bg-[#1A1825] p-3 rounded-2xl flex items-center gap-2">
          <div class="w-8 h-8 bg-[#232033] rounded-full flex items-center justify-center text-[#C7A4FF]">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
          </div>
          <div>
            <p class="text-[10px] font-bold line-clamp-1">{ticket.venue}</p>
            <p class="text-[10px] text-gray-400">{ticket.city}</p>
          </div>
        </div>
      </div>

      <div class="px-5 py-2 flex justify-between items-center text-left mb-2">
        <div>
          <p class="text-[10px] text-gray-500 mb-0.5 tracking-wider">GATE</p>
          <p class="text-xs font-bold text-[#FF8A00]">{ticket.gate}</p>
        </div>
        <div>
          <p class="text-[10px] text-gray-500 mb-0.5 tracking-wider">AREA</p>
          <p class="text-xs font-bold text-[#C7A4FF]">{ticket.area}</p>
        </div>
        <div>
          <p class="text-[10px] text-gray-500 mb-0.5 tracking-wider">HARI</p>
          <p class="text-xs font-bold text-[#D4FF00]">{ticket.countdown}</p>
        </div>
      </div>

      <div class="relative flex items-center justify-center my-6">
        <div class="absolute left-[-16px] w-8 h-8 bg-[#0A0910] rounded-full border-r border-[#232033]"></div>
        <div class="w-full border-t border-dashed border-gray-600 mx-8"></div>
        <div class="absolute bg-[#14121E] px-3 py-1 border border-[#232033] rounded-full text-[10px] text-gray-400 font-bold flex items-center gap-1.5 z-10">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
          SCAN TO ENTER
        </div>
        <div class="absolute right-[-16px] w-8 h-8 bg-[#0A0910] rounded-full border-l border-[#232033]"></div>
      </div>

      {#if showQR}
        <div class="flex flex-col items-center pb-8 px-4 transition-all duration-300">
          <div class="bg-white p-2 rounded-xl mb-4 w-full flex items-center justify-center shadow-[0_0_20px_rgba(212,255,0,0.2)] overflow-hidden">
            {#if ticket.proofImage}
              <img src={ticket.proofImage} alt="Bukti Tiket" class="w-full h-auto object-contain max-h-[300px]" />
            {:else}
              <div class="w-48 h-48 flex items-center justify-center">
                <p class="text-xs text-gray-500">Gambar tiket tidak tersedia</p>
              </div>
            {/if}
          </div>
          
          <div class="flex items-center gap-2 bg-[#1A1825] px-4 py-2 rounded-xl mb-4">
            <span class="text-[#D4FF00] font-mono font-bold text-sm tracking-wider">{ticket.ticketCode}</span>
          </div>

          <button onclick={() => showQR = false} class="text-[11px] text-gray-400 hover:text-white underline underline-offset-2 transition-colors">
            Sembunyikan E-Tiket
          </button>
        </div>
      {:else}
        <div class="flex flex-col items-center pb-6 px-5 transition-all duration-300">
          <p class="text-[11px] text-gray-400 mb-3">Tunjukkan E-Tiket ini ke Petugas Scan</p>
          <button onclick={() => showQR = true} class="w-full bg-[#D4FF00] text-[#0A0910] text-sm font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-[0_4px_15px_rgba(212,255,0,0.15)]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Lihat E-Tiket
          </button>
        </div>
      {/if}
    </div>
  </div>

  <div class="px-4 mb-6">
    <div class="bg-[#14121E] border border-[#232033] rounded-2xl p-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-[#1A2000] rounded-full flex items-center justify-center text-[#D4FF00]">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        </div>
        <div>
          <p class="text-xs font-bold text-white">Escrow Protection</p>
          <p class="text-[10px] text-[#D4FF00] font-bold">{ticket.escrowStatus}</p>
        </div>
      </div>
      <div class="text-right">
        <p class="text-[#D4FF00] font-bold text-sm">{ticket.price}</p>
        <p class="text-[9px] text-gray-500">Harga tiket</p>
      </div>
    </div>
  </div>

  <div class="px-4 mb-4 mt-2">
    <div class="bg-gradient-to-b from-[#1A2000] to-[#14121E] border border-[#D4FF00]/30 rounded-2xl p-5 text-center relative overflow-hidden">
      <div class="w-12 h-12 bg-[#D4FF00]/10 rounded-full flex items-center justify-center text-[#D4FF00] mx-auto mb-3 border border-[#D4FF00]/20">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
      </div>
      <h3 class="font-bold text-white mb-1.5">Tidak bisa hadir?</h3>
      <p class="text-[10px] text-gray-400 mb-5 leading-relaxed">
        Jual tiket kamu di TixLoop dan dapatkan uang kembali dengan aman melalui escrow protection
      </p>
      <button class="w-full bg-[#D4FF00] text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-[0_0_15px_rgba(212,255,0,0.3)]">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
        Jual Tiket Ini
      </button>
    </div>
  </div>

  {#if debugTx && !transactionId}
    <div class="px-4 mb-4 mt-2">
      <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-[10px] text-red-400 font-mono break-all">
        DEBUG: {debugTx} <br/>
        ticket_id yang dicari: {ticketId}
      </div>
    </div>
  {/if}



  <div class="px-4 pb-8 mt-4">
    <a href="/refund/form/{ticket.id}" class="w-full bg-[#3E1A25]/30 border border-[#FF3366]/20 text-[#FF3366] text-xs font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 hover:bg-[#3E1A25]/50">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      Ajukan Refund
    </a>
  </div>

</main>
{/if}
