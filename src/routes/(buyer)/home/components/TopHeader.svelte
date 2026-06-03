<script>
  const categories = ["All", "Concert", "Cinema", "Sports", "Festival", "Theater"];
  let activeCategory = "All";
</script>

<div class="px-4 pt-12 pb-2">
  <div class="flex justify-between items-center mb-6">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 bg-[#D4FF00] rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.5 4.5H7.5C5.84315 4.5 4.5 5.84315 4.5 7.5V16.5C4.5 18.1569 5.84315 19.5 7.5 19.5H16.5C18.1569 19.5 19.5 18.1569 19.5 16.5V7.5C19.5 5.84315 18.1569 4.5 16.5 4.5ZM10.5 14.5L7.5 10.5H9.5L11.5 13.1667L13.5 10.5H15.5L12.5 14.5V17.5H10.5V14.5Z"/>
        </svg>
      </div>
      <span class="text-xl font-bold tracking-wide">TixLoop</span>
    </div>
    <div class="flex items-center gap-3">
      <button class="w-10 h-10 rounded-full bg-[#1A1825] flex items-center justify-center relative">
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
        <span class="absolute top-2 right-2.5 w-2 h-2 bg-[#D4FF00] rounded-full"></span>
      </button>
      <button class="w-10 h-10 rounded-full bg-[#C7A4FF] text-black font-bold flex items-center justify-center">
        A
      </button>
    </div>
  </div>

  <div class="relative mb-6">
    <svg class="w-5 h-5 absolute left-4 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
    </svg>
    <input type="text" placeholder="Search event, artist, city..." class="w-full bg-[#1A1825] text-sm text-white rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-1 focus:ring-[#D4FF00] placeholder-gray-500" />
  </div>

  <div class="flex overflow-x-auto hide-scrollbar gap-3 pb-2">
    {#each categories as cat}
      <button 
        class="px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors {activeCategory === cat ? 'bg-[#D4FF00] text-black' : 'bg-[#1A1825] text-gray-400'}"
        on:click={() => activeCategory = cat}>
        {cat}
      </button>
    {/each}
  </div>
</div>

<style>
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>