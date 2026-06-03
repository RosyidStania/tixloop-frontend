<script>
  import BottomNav from '$lib/components/buyer/layout/BottomNav.svelte';

  let activeFilter = $state('All');
  const filters = ['All', 'Concert', 'Cinema', 'Sports', 'Events'];

  const dealsTickets = [
    {
      id: 'TIX-DEAL-01',
      category: 'Concert',
      title: 'Cold Play 2026',
      artist: 'Various Artists',
      venue: 'Jakarta Convention Center, Jakarta',
      originalPrice: 'Rp 600.000',
      currentPrice: 'Rp 280.000',
      priceDropAmount: 'Turun Rp 60.000 (18%)',
      priceDropTime: '45 menit lalu',
      timeLeft: '04:22:05',
      distance: '2.1 km',
      image: 'https://images.unsplash.com/photo-1540039155733-d7696d54af58?w=600&auto=format&fit=crop&q=80'
    }
  ];
</script>

<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-28 overflow-x-hidden">

  <!-- Status bar spacer -->
  <div class="pt-10"></div>

  <div class="px-4">

    <!-- Header -->
    <div class="flex items-center justify-between mb-5 mt-2">
      <h1 class="text-[22px] font-bold tracking-wide">Last Minute Deals</h1>
      <button class="flex items-center gap-2 bg-[#1E1530] text-[#A67CFF] px-4 py-2 rounded-full text-sm font-semibold border border-[#3B2A5A]">
        <!-- Funnel/filter icon -->
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
        </svg>
        Filter
      </button>
    </div>

    <div class="relative mb-6">
        <svg class="w-5 h-5 absolute left-4 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input type="text" placeholder="Search event, artist, city..." class="w-full bg-[#1A1825] text-sm text-white rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-1 focus:ring-[#D4FF00] placeholder-gray-500" />
    </div>

    <!-- Filter Pills -->
    <div class="flex overflow-x-auto hide-scrollbar gap-2.5 mb-5">
      {#each filters as filter}
        <button
          class="px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors
            {activeFilter === filter
              ? 'bg-[#D4FF00] text-black'
              : 'bg-[#13111D] text-gray-400 border border-[#1E1C2E]'}"
          on:click={() => activeFilter = filter}
        >
          {filter}
        </button>
      {/each}
    </div>

    <!-- Ticket Cards -->
    <div class="space-y-4">
      {#each dealsTickets as ticket}
        <div class="bg-[#13111D] rounded-3xl overflow-hidden border border-[#1E1C2E]">

          <!-- Image Section -->
          <div
            class="h-44 bg-cover bg-center relative"
            style="background-image: url('{ticket.image}');"
          >
            <!-- Gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-[#13111D] via-transparent to-transparent"></div>

            <!-- Verified Badge -->
            <div class="absolute top-3 left-3">
              <span class="bg-[#D4FF00] text-black text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Verified
              </span>
            </div>

            <!-- Timer & Distance -->
            <div class="absolute bottom-3 left-3 right-3 flex justify-between items-end">
              <!-- Countdown timer -->
              <div class="bg-[#E93B5C] text-white text-[12px] font-bold px-3.5 py-2 rounded-full flex items-center gap-1.5 shadow-lg">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {ticket.timeLeft}
              </div>
              <!-- Distance -->
              <div class="text-white text-[11px] flex items-center gap-1 font-semibold drop-shadow-md pb-0.5">
                <!-- Send/navigation icon rotated -->
                <svg class="w-3.5 h-3.5 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
                {ticket.distance}
              </div>
            </div>
          </div>

          <!-- Card Body -->
          <div class="px-4 pt-3.5 pb-4">

            <!-- Category -->
            <div class="flex items-center gap-1 text-[11px] text-gray-400 mb-1">
              <span>🎵</span>
              <span>{ticket.category}</span>
            </div>

            <!-- Title -->
            <h3 class="font-bold text-[17px] leading-tight mb-0.5">{ticket.title}</h3>
            <!-- Artist -->
            <p class="text-[11px] text-gray-400 mb-3">{ticket.artist}</p>

            <!-- Venue -->
            <div class="flex items-center gap-1.5 text-[11px] text-gray-400 mb-4">
              <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {ticket.venue}
            </div>

            <!-- Price Drop Banner -->
            <div class="flex items-center justify-between bg-[#1E1019] border border-[#3D1E28] px-3 py-2.5 rounded-xl mb-4">
              <div class="flex items-center gap-2">
                <!-- Trending down icon -->
                <svg class="w-4 h-4 text-[#E67E42]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
                </svg>
                <span class="text-[#E67E42] text-[11px] font-semibold">{ticket.priceDropAmount}</span>
                <span class="text-gray-500 text-[10px]">{ticket.priceDropTime}</span>
              </div>
              <!-- Status dot -->
              <div class="w-2 h-2 bg-[#E67E42] rounded-full"></div>
            </div>

            <!-- Price & CTA -->
            <div class="flex justify-between items-center">
              <div class="flex flex-col">
                <p class="text-[#D4FF00] font-mono font-bold text-[20px] tracking-tight leading-none">
                  {ticket.currentPrice}
                </p>
                <p class="text-[11px] text-gray-500 line-through mt-1">{ticket.originalPrice}</p>
              </div>
              <button class="bg-[#D4FF00] text-black text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-[#bce600] active:scale-95 transition-all">
                Beli Sekarang
              </button>
            </div>

          </div>
        </div>
      {/each}
    </div>

  </div>

  <BottomNav activeTab="deals" />
</main>

<style>
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
