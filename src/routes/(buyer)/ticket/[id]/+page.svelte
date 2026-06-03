<script>
  let selectedCategory = $state('general');

  const categories = [
    { id: 'general', name: 'General Admission', stock: 12, price: 450000 },
    { id: 'vip', name: 'VIP', stock: 5, price: 750000 },
    { id: 'vvip', name: 'VVIP', stock: 2, price: 1200000 }
  ];

  let activePrice = $derived(categories.find(c => c.id === selectedCategory)?.price || 0);
  let activeName = $derived(categories.find(c => c.id === selectedCategory)?.name || '');
</script>

<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-32">
  <div class="relative h-72 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1540039155733-d7696d54af58?q=80&w=800&auto=format&fit=crop');">
    <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#0A0910]"></div>
    
    <div class="absolute top-0 w-full px-4 pt-12 flex justify-between items-center z-10">
      <a href="javascript:history.back()" class="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center transition-transform active:scale-95">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </a>
      <div class="flex gap-3">
        <button class="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center transition-transform active:scale-95">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        </button>
        <button class="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center transition-transform active:scale-95">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
        </button>
      </div>
    </div>

    <div class="absolute bottom-4 left-4 right-4 flex justify-between items-end">
      <div class="flex gap-2">
        <span class="bg-[#D4FF00] text-black text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg> Verified</span>
        <span class="bg-[#C7A4FF] text-black text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">📈 Trending</span>
      </div>
      <div class="bg-[#FF3366] text-white text-xs font-bold px-3 py-1 rounded-full">-25%</div>
    </div>
  </div>

  <div class="px-5 pt-4">
    <div class="mb-6">
      <div class="flex items-center gap-1 text-xs text-gray-400 mb-2">🎵 Concert</div>
      <h1 class="text-2xl font-bold mb-1">Cold Play 2026</h1>
      <p class="text-sm text-[#A89EC4] mb-4">Various Artists</p>
      
      <div class="space-y-2.5">
        <div class="flex items-center gap-3 text-sm text-gray-300">
          <svg class="w-5 h-5 text-[#D4FF00]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          June 15, 2026 • 18:00 WIB
        </div>
        <div class="flex items-center justify-between text-sm text-gray-300">
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-[#C7A4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
            Jakarta Convention Center, Jakarta
          </div>
        </div>
      </div>
    </div>

    <h2 class="text-sm font-bold mb-3">Kategori Tiket</h2>
    <div class="space-y-3 mb-8">
      {#each categories as cat}
        <div class="p-4 rounded-2xl border transition-all cursor-pointer {selectedCategory === cat.id ? 'bg-[#1A2000] border-[#D4FF00]' : 'bg-[#14121E] border-[#232033]'}" on:click={() => selectedCategory = cat.id}>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors {selectedCategory === cat.id ? 'border-[#D4FF00]' : 'border-gray-500'}">
                {#if selectedCategory === cat.id}
                  <div class="w-2.5 h-2.5 bg-[#D4FF00] rounded-full"></div>
                {/if}
              </div>
              <div>
                <p class="font-bold text-sm text-white">{cat.name}</p>
                <p class="text-[10px] text-gray-400">{cat.stock} tersedia</p>
              </div>
            </div>
            <p class="font-bold text-sm text-white">Rp {cat.price.toLocaleString('id-ID')}</p>
          </div>
        </div>
      {/each}
    </div>

    <h2 class="text-sm font-bold mb-3">Reputasi Penjual</h2>
    <div class="bg-[#14121E] p-4 rounded-2xl border border-[#232033] mb-8">
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-[#C7A4FF] text-black font-bold text-lg rounded-full flex items-center justify-center">T</div>
          <div>
            <div class="flex items-center gap-1">
              <p class="font-bold text-sm text-white">TicketPro_ID</p>
              <svg class="w-4 h-4 text-[#D4FF00]" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
            </div>
            <p class="text-[10px] text-gray-400">Bergabung sejak 2022</p>
          </div>
        </div>
      </div>
      <div class="flex gap-3">
        <div class="flex-1 bg-[#1A1825] py-2 rounded-xl text-center border border-[#232033]">
          <p class="text-[#D4FF00] font-bold text-sm">142</p>
          <p class="text-[10px] text-gray-400">Transaksi Sukses</p>
        </div>
        <div class="flex-1 bg-[#1A1825] py-2 rounded-xl text-center border border-[#232033]">
          <p class="text-[#D4FF00] font-bold text-sm">4.8</p>
          <p class="text-[10px] text-gray-400">Rating Ulasan</p>
        </div>
      </div>
    </div>

    <h2 class="text-sm font-bold mb-3">Riwayat Harga</h2>
    <div class="bg-[#14121E] p-4 rounded-2xl border border-[#232033] mb-8 relative">
      <div class="flex justify-between items-center mb-6">
        <span class="text-[10px] text-gray-400">6 bulan terakhir</span>
        <span class="text-[#D4FF00] text-[10px] font-bold flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
          Turun 25%
        </span>
      </div>
      <div class="relative h-20 w-full mb-2">
         <svg class="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
           <defs>
             <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
               <stop offset="0%" stop-color="#D4FF00" />
               <stop offset="100%" stop-color="#D4FF00" stop-opacity="0.6" />
             </linearGradient>
             <linearGradient id="fillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
               <stop offset="0%" stop-color="#D4FF00" stop-opacity="0.15" />
               <stop offset="100%" stop-color="#D4FF00" stop-opacity="0" />
             </linearGradient>
           </defs>
           <path d="M0 15 Q 25 14, 50 18 T 100 28 L 100 40 L 0 40 Z" fill="url(#fillGrad)" />
           <path d="M0 15 Q 25 14, 50 18 T 100 28" fill="none" stroke="url(#lineGrad)" stroke-width="1.5" />
         </svg>
      </div>
      <div class="flex justify-between text-[10px] text-gray-500 font-medium px-1">
        <span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
      </div>
    </div>
  </div>

  <div class="fixed bottom-0 w-full bg-[#0A0910] border-t border-[#232033] p-4 z-40 pb-safe shadow-[0_-10px_20px_-5px_rgba(10,9,16,0.9)]">
    <div class="flex justify-between items-center mb-3">
      <div>
        <p class="text-[10px] text-gray-400">Harga per tiket</p>
        <div class="flex items-end gap-2">
          <p class="text-[#D4FF00] font-bold text-xl">Rp {activePrice.toLocaleString('id-ID')}</p>
          <p class="text-[10px] text-gray-500 line-through mb-1">Rp 600.000</p>
        </div>
      </div>
      <div class="text-right">
        <p class="text-xs text-gray-300">{activeName}</p>
        <p class="text-[10px] text-gray-500">12 tiket tersisa</p>
      </div>
    </div>
    <a href="/checkout/123" class="w-full bg-[#D4FF00] text-black font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 transition-transform active:scale-[0.98]">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
      Beli Tiket Sekarang
    </a>
  </div>
</main>

<style>
  .pb-safe { padding-bottom: env(safe-area-inset-bottom, 1rem); }
</style>