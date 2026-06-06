<script>
  import { page } from '$app/stores';

  // For now using the same dummy data
  const ticketId = $page.params.id;

  const ticket = {
    id: ticketId,
    eventName: 'Cold Play 2026',
    date: 'June 15, 2026',
    venue: 'Jakarta Convention Center'
  };
</script>

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

    <!-- QR Container -->
    <div class="bg-white p-5 rounded-3xl mb-6 w-full aspect-square flex items-center justify-center shadow-[0_0_30px_rgba(212,255,0,0.3)]">
      <svg class="w-full h-full text-black" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-2 2h2v2h-2v-2zm2 2h3v2h-3v-2zm-4-2h2v5h-2v-5zm4 3h2v2h-2v-2zm-6-5h2v2h-2v-2z" />
      </svg>
    </div>
    
    <!-- Ticket Info -->
    <div class="flex items-center gap-2 bg-[#1A1825] border border-[#232033] px-6 py-3 rounded-2xl mb-6">
      <span class="text-[#D4FF00] font-mono font-bold text-lg tracking-widest">{ticket.id}</span>
    </div>

    <div class="text-center w-full">
      <h2 class="font-bold text-lg text-white mb-1">{ticket.eventName}</h2>
      <p class="text-xs text-gray-400">{ticket.date}</p>
      <p class="text-[10px] text-gray-500 mt-1">{ticket.venue}</p>
    </div>
  </div>
</main>