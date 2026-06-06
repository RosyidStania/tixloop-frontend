<script>
  let { listings = [] } = $props();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };
</script>

<div class="pl-4">
  <div class="flex justify-between items-center pr-4 mb-4">
    <div class="flex items-center gap-2">
      <span class="text-red-500 text-xl">🔥</span>
      <h2 class="font-bold text-lg">Last Minute Deals</h2>
    </div>
    <a href="/deals" class="text-[#D4FF00] text-xs font-semibold flex items-center gap-1">Lihat Semua <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></a>
  </div>
  <p class="text-gray-400 text-xs mb-4 pr-4">Dapatkan penawaran menarik ini sebelum kehabisan!</p>

  <div class="flex overflow-x-auto hide-scrollbar gap-4 pb-4 pr-4">
    {#each listings.slice(0, 5) as item}
      <div class="min-w-[240px] bg-[#14121E] rounded-2xl overflow-hidden border border-[#232033]">
        <div class="h-32 bg-gray-800 relative bg-cover bg-center" style="background-image: url('{item.ticket?.event?.event_poster_url || item.ticket?.event?.poster_url || 'https://images.unsplash.com/photo-1540039155733-d7696d54af58?q=80&w=600&auto=format&fit=crop'}');">
          <div class="absolute inset-0 bg-gradient-to-t from-[#14121E] to-transparent"></div>
          <div class="absolute top-2 left-2 flex gap-1">
            <span class="bg-[#D4FF00] text-black text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1"><svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg> Terverifikasi</span>
            <span class="bg-[#C7A4FF] text-black text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">📈 Trending</span>
          </div>
        </div>
        <div class="p-4">
          <h3 class="font-bold mb-1 truncate">{item.ticket?.event?.name || 'Event Tidak Diketahui'}</h3>
          <p class="text-xs text-gray-400 mb-3 truncate">Penjual: {item.seller?.name || 'Tidak Diketahui'}</p>
          
          <div class="flex items-center gap-1 text-[10px] text-gray-400 mb-1 truncate">
            <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {item.ticket?.event?.date ? new Date(item.ticket.event.date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
          </div>
          <div class="flex items-center gap-1 text-[10px] text-gray-400 mb-4 truncate">
            <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            {item.ticket?.event?.venue || '-'}
          </div>

          <div class="flex justify-between items-end mb-4">
            <div>
              <p class="text-[#D4FF00] font-bold text-sm">{formatCurrency(item.current_asking_price)}</p>
            </div>
            <div class="bg-[#FF3366] text-white text-[10px] font-bold px-2 py-0.5 rounded">HOT</div>
          </div>

          <a href={`/ticket/${item.id}`} class="block text-center w-full bg-gradient-to-r from-[#FF3366] to-[#8C1B3F] text-white text-xs font-bold py-2.5 rounded-xl">Burn Mode</a>
        </div>
      </div>
    {/each}
  </div>
</div>
