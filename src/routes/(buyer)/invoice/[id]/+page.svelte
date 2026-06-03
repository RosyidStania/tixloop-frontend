<script>
  import BottomNav from '$lib/components/buyer/layout/BottomNav.svelte';

  const invoice = {
    id: 'TIX-2026-10132',
    eventName: 'Cold Play 2026',
    date: '20 Juni 2026',
    category: 'General Admission',
    price: 450000,
    serviceFee: 15000,
    escrowFee: 5000,
    purchaseDate: '20 Mei 2026',
    paymentMethod: 'GoPay',
    image: 'https://images.unsplash.com/photo-1540039155733-d7696d54af58?w=800&auto=format&fit=crop&q=80'
  };

  let total = $derived(invoice.price + invoice.serviceFee + invoice.escrowFee);
</script>

<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-28">
  <div class="px-4 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-[#0A0910]/95 backdrop-blur z-50">
    <div class="flex items-center gap-3">
      <a href="javascript:history.back()" class="w-10 h-10 bg-[#1A1825] rounded-full flex items-center justify-center transition-transform active:scale-95">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </a>
      <div>
        <h1 class="text-sm font-bold">Invoice Detail</h1>
        <p class="text-[10px] text-gray-500 font-mono tracking-wide">{invoice.id}</p>
      </div>
    </div>
    <div class="flex gap-2">
      <button class="w-10 h-10 bg-[#1A1825] rounded-full flex items-center justify-center text-[#D4FF00] transition-transform active:scale-95">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
      </button>
      <button class="w-10 h-10 bg-[#1A1825] rounded-full flex items-center justify-center text-gray-300 transition-transform active:scale-95">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
      </button>
    </div>
  </div>

  <div class="px-4 space-y-6">
    <div class="flex justify-center">
      <div class="flex items-center gap-1.5 border border-[#D4FF00] bg-[#1A2000]/50 text-[#D4FF00] px-5 py-1.5 rounded-full text-xs font-bold">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Selesai
      </div>
    </div>

    <div class="bg-[#14121E] rounded-[2rem] overflow-hidden border border-[#232033]">
      <div class="h-40 bg-cover bg-center" style="background-image: url('{invoice.image}');"></div>
      <div class="p-5">
        <h2 class="text-xl font-bold mb-3">{invoice.eventName}</h2>
        <div class="flex items-center gap-4 text-xs text-gray-400">
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            {invoice.date}
          </div>
          <div class="w-1 h-1 bg-gray-600 rounded-full"></div>
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
            {invoice.category}
          </div>
        </div>
      </div>
    </div>

    <div class="bg-[#14121E] p-5 rounded-3xl border border-[#232033]">
      <p class="text-[10px] text-gray-500 font-bold tracking-wider mb-4">RINCIAN HARGA</p>
      <div class="space-y-3 text-xs text-gray-300 mb-4">
        <div class="flex justify-between">
          <span>Harga Tiket</span>
          <span class="font-mono text-white">Rp {invoice.price.toLocaleString('id-ID')}</span>
        </div>
        <div class="flex justify-between">
          <span>Biaya Layanan</span>
          <span class="font-mono text-white">Rp {invoice.serviceFee.toLocaleString('id-ID')}</span>
        </div>
        <div class="flex justify-between">
          <span>Biaya Escrow</span>
          <span class="font-mono text-white">Rp {invoice.escrowFee.toLocaleString('id-ID')}</span>
        </div>
      </div>
      <div class="border-t border-[#232033] pt-4 flex justify-between items-center font-bold">
        <span class="text-sm">Total</span>
        <span class="text-[#D4FF00] font-mono text-lg">Rp {total.toLocaleString('id-ID')}</span>
      </div>
    </div>

    <div class="bg-[#14121E] p-5 rounded-3xl border border-[#232033]">
      <p class="text-[10px] text-gray-500 font-bold tracking-wider mb-4">INFORMASI TRANSAKSI</p>
      <div class="space-y-4 text-xs">
        <div class="flex justify-between">
          <span class="text-gray-400">Order ID</span>
          <span class="font-mono font-bold text-white tracking-wide">{invoice.id}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-400">Tanggal Pembelian</span>
          <span class="font-medium text-white">{invoice.purchaseDate}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-400">Metode Pembayaran</span>
          <span class="font-medium text-white">{invoice.paymentMethod}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-400">Status Transaksi</span>
          <span class="font-bold text-[#D4FF00]">Selesai</span>
        </div>
      </div>
    </div>

    <div class="bg-[#14121E] border border-[#232033] rounded-3xl p-5">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 bg-[#1A2000] rounded-full flex items-center justify-center text-[#D4FF00]">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        </div>
        <div>
          <p class="text-xs font-bold text-white">Status Escrow Protection</p>
          <p class="text-[10px] text-gray-500">Dana kamu dilindungi TixLoop</p>
        </div>
      </div>
      <div class="w-full bg-[#1A2000]/50 border border-[#D4FF00]/20 text-[#D4FF00] text-xs font-bold py-3 rounded-xl flex items-center justify-center">
        Dana Terkirim
      </div>
    </div>

    <div class="bg-[#14121E] p-5 rounded-3xl border border-[#232033]">
      <p class="text-[10px] text-gray-500 font-bold tracking-wider mb-4">INFORMASI PENJUAL</p>
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-[#D4FF00] rounded-full flex items-center justify-center text-black">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        </div>
        <div>
          <p class="font-bold text-sm text-white mb-0.5">@ticketmaster_id</p>
          <div class="flex items-center gap-2 text-[10px] text-gray-400">
            <span class="flex items-center gap-1 text-[#D4FF00]"><svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg> Verified Seller</span>
            <span class="w-1 h-1 bg-gray-600 rounded-full"></span>
            <span class="flex items-center gap-1 text-[#FF8A00]"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg> 4.9</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-[#1A2000]/10 border border-[#D4FF00]/10 p-5 rounded-3xl text-center">
      <p class="text-[10px] text-gray-400 mb-3">Butuh bantuan dengan transaksi ini?</p>
      <button class="w-full bg-[#1A2000] border border-[#D4FF00]/30 text-[#D4FF00] text-xs font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
        Hubungi Customer Support
      </button>
    </div>
  </div>

  <BottomNav activeTab="activity" />
</main>
