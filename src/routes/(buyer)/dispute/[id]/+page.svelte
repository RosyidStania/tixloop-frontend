<script>
  const dispute = {
    id: 'TIX-2026-10132',
    eventName: 'Cold Play 2026',
    category: 'General Admission',
    price: 'Rp 470.000',
    date: '20 Juni 2026',
    image: 'https://images.unsplash.com/photo-1540039155733-d7696d54af58?w=800&auto=format&fit=crop&q=80',
    reason: 'Tiket tidak valid / Barcode sudah digunakan',
    seller: '@ticketmaster_id',
    evidenceImg: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=300&fit=crop'
  };
</script>

<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-28">
  <div class="px-4 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-[#0A0910]/95 backdrop-blur z-50">
    <div class="flex items-center gap-3">
      <a href="javascript:history.back()" class="w-10 h-10 bg-[#1A1825] rounded-full flex items-center justify-center transition-transform active:scale-95">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </a>
      <div>
        <h1 class="text-sm font-bold">Dispute Center</h1>
        <p class="text-[10px] text-gray-500 font-mono tracking-wide">{dispute.id}</p>
      </div>
    </div>
  </div>

  <div class="px-4 space-y-6">
    <div class="flex justify-center">
      <div class="flex flex-col items-center">
        <div class="flex items-center gap-1.5 border border-[#FF8A00] bg-[#3E211A]/50 text-[#FF8A00] px-5 py-1.5 rounded-full text-xs font-bold mb-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Menunggu Respon Penjual
        </div>
        <p class="text-[10px] text-gray-400">Batas respon: <span class="font-bold text-white">23 jam 45 menit</span></p>
      </div>
    </div>

    <div class="bg-[#3E1A25]/30 border border-[#FF3366]/30 p-4 rounded-2xl flex items-start gap-3">
      <div class="w-8 h-8 bg-[#FF3366]/20 rounded-full flex items-center justify-center text-[#FF3366] shrink-0 mt-0.5">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
      </div>
      <div>
        <h3 class="font-bold text-xs text-[#FF3366] mb-1">Dana Tertahan Sementara</h3>
        <p class="text-[10px] text-gray-300 leading-relaxed">
          Dana kamu sebesar <span class="font-bold">{dispute.price}</span> ditahan dalam sistem Escrow hingga sengketa ini diselesaikan oleh admin.
        </p>
      </div>
    </div>

    <div class="bg-[#14121E] rounded-2xl p-3 border border-[#232033] flex items-center gap-3">
      <img src={dispute.image} alt="Event" class="w-14 h-14 rounded-xl object-cover" />
      <div>
        <h4 class="font-bold text-sm text-white mb-0.5">{dispute.eventName}</h4>
        <p class="text-[10px] text-gray-400">{dispute.category} • {dispute.date}</p>
      </div>
    </div>

    <div class="bg-[#14121E] rounded-3xl p-5 border border-[#232033]">
      <h3 class="font-bold text-sm text-white mb-5">Status Resolusi</h3>
      
      <div class="relative pl-3 space-y-6 border-l border-[#232033] ml-2">
        <div class="relative">
          <div class="absolute -left-[19px] top-0.5 w-3 h-3 bg-[#D4FF00] rounded-full ring-4 ring-[#14121E]"></div>
          <p class="font-bold text-xs text-white">Laporan Dibuat</p>
          <p class="text-[10px] text-gray-400 mt-1">21 Juni 2026, 18:30 WIB</p>
        </div>
        
        <div class="relative">
          <div class="absolute -left-[19px] top-0.5 w-3 h-3 bg-[#FF8A00] rounded-full ring-4 ring-[#14121E] animate-pulse"></div>
          <p class="font-bold text-xs text-[#FF8A00]">Menunggu Respon Penjual</p>
          <p class="text-[10px] text-gray-400 mt-1">Penjual memiliki waktu 24 jam untuk merespon laporan ini.</p>
        </div>

        <div class="relative opacity-40">
          <div class="absolute -left-[19px] top-0.5 w-3 h-3 bg-[#232033] rounded-full ring-4 ring-[#14121E]"></div>
          <p class="font-bold text-xs text-white">Peninjauan Tim Admin</p>
          <p class="text-[10px] text-gray-400 mt-1">Tim TixLoop akan meninjau bukti.</p>
        </div>

        <div class="relative opacity-40">
          <div class="absolute -left-[19px] top-0.5 w-3 h-3 bg-[#232033] rounded-full ring-4 ring-[#14121E]"></div>
          <p class="font-bold text-xs text-white">Resolusi / Refund</p>
        </div>
      </div>
    </div>

    <div class="bg-[#14121E] rounded-3xl p-5 border border-[#232033]">
      <h3 class="font-bold text-sm text-white mb-4">Laporan & Bukti</h3>
      
      <div class="bg-[#1A1825] p-3 rounded-xl rounded-tl-none border border-[#232033] mb-2">
        <p class="text-[10px] font-bold text-[#C7A4FF] mb-1">Kamu (Pembeli)</p>
        <p class="text-xs text-gray-300 leading-relaxed mb-3">
          Saya tidak bisa masuk ke venue karena petugas bilang barcode pada tiket ini sudah di-scan oleh orang lain pada jam 17:00. Mohon refund dana saya.
        </p>
        <div class="flex gap-2">
          <img src={dispute.evidenceImg} alt="Bukti 1" class="w-16 h-16 rounded-lg object-cover border border-[#232033]" />
        </div>
      </div>
      <p class="text-[9px] text-gray-500 text-right">21 Juni 2026, 18:30 WIB</p>
    </div>
  </div>

  <div class="fixed bottom-0 w-full bg-[#0A0910]/95 backdrop-blur-md border-t border-[#232033] p-4 z-40 pb-safe">
    <div class="flex gap-3">
      <button class="flex-1 border border-[#232033] bg-transparent text-white text-xs font-bold py-3.5 rounded-xl transition-transform active:scale-95">
        Batalkan Dispute
      </button>
      <button class="flex-1 bg-[#FF3366] text-white text-xs font-bold py-3.5 rounded-xl transition-transform active:scale-95 flex items-center justify-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
        Kirim Pesan / Bukti
      </button>
    </div>
  </div>
</main>

<style>
  .pb-safe { padding-bottom: env(safe-area-inset-bottom, 1rem); }
</style>
