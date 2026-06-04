<script>
  let { listings = [] } = $props();

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };
</script>

<div class="px-4">
  <div class="flex justify-between items-center mb-4">
    <div class="flex items-center gap-2">
      <svg class="w-5 h-5 text-[#C7A4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
      <h2 class="font-bold text-lg">Trending</h2>
    </div>
    <a href="#" class="text-[#D4FF00] text-xs font-semibold flex items-center gap-1">View All <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></a>
  </div>

  <div class="space-y-3">
    {#each listings.slice(0, 3) as item}
      <a href={`/ticket/${item.id}`} class="block bg-[#14121E] rounded-2xl p-3 flex gap-4 items-center border border-[#232033] hover:border-[#3a3850] transition-colors">
        <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&h=200&fit=crop" class="w-20 h-20 rounded-xl object-cover" alt="Concert" />
        <div class="p-4">
          <div class="flex items-center gap-1.5 mb-2">
            <span class="text-[10px] text-gray-400">🎵 {item.ticket?.event?.category || 'Event'}</span>
            <svg class="w-3.5 h-3.5 text-[#D4FF00]" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
          </div>
          
          <h3 class="font-bold text-sm mb-1 truncate">{item.ticket?.event?.name || 'Unknown Event'}</h3>
          <p class="text-[10px] text-[#A89EC4] mb-2 truncate">Seller: {item.seller?.name || 'Unknown'}</p>
          
          <div class="flex items-center gap-1 text-[10px] text-gray-400 mb-1 truncate">
            <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {item.ticket?.event?.date ? new Date(item.ticket.event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
          </div>
          <div class="flex items-center gap-1 text-[10px] text-gray-400 mb-4 truncate">
            <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
            {item.ticket?.event?.venue || '-'}, {item.ticket?.event?.city || '-'}
          </div>
          <p class="text-[#D4FF00] font-bold text-sm">{formatCurrency(item.current_asking_price)}</p>
        </div>
      </a>
    {/each}
  </div>
</div>
