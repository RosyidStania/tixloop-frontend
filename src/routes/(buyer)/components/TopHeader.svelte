<script>
  import { goto } from '$app/navigation';
  import { showToast } from '$lib/stores/toast.svelte.js';
  import { onMount } from 'svelte';

  const categories = ["Semua", "Konser", "Bioskop", "Olahraga", "Festival", "Teater"];
  let activeCategory = "All";
  let searchQuery = "";
  let userInitial = $state('U'); // Default jika guest

  onMount(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.name) {
          userInitial = user.name.charAt(0).toUpperCase();
        } else if (user && user.email) {
          userInitial = user.email.charAt(0).toUpperCase();
        }
      } catch(e) {}
    }
  });


  function handleSearch(e) {
    if (e.key === 'Enter') {
      goto(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  }

  function handleCategory(cat) {
    goto(`/explore?category=${encodeURIComponent(cat)}`);
  }
</script>

<div class="sticky top-0 z-40 bg-[#0A0910] px-4 pt-12 pb-2">
  <div class="flex justify-between items-center mb-6 h-8">
    <div class="flex items-center gap-2">
      <svg class="w-7 h-7 text-[#D4FF00]" viewBox="0 0 24 24" fill="currentColor">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M6 4C4.89543 4 4 4.89543 4 6V9C5.10457 9 6 9.89543 6 11C6 12.1046 5.10457 13 4 13V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V13C18.8954 13 18 12.1046 18 11C18 9.89543 18.8954 9 20 9V6C20 4.89543 19.1046 4 18 4H6ZM11.5 6C11.2239 6 11 6.22386 11 6.5V8.5C11 8.77614 11.2239 9 11.5 9H12.5C12.7761 9 13 8.77614 13 8.5V6.5C13 6.22386 12.7761 6 12.5 6H11.5ZM11 11.5C11 11.2239 11.2239 11 11.5 11H12.5C12.7761 11 13 11.2239 13 11.5V13.5C13 13.7761 12.7761 14 12.5 14H11.5C11.2239 14 11 13.7761 11 13.5V11.5ZM11.5 16C11.2239 16 11 16.2239 11 16.5V18.5C11 18.7761 11.2239 19 11.5 19H12.5C12.7761 19 13 18.7761 13 18.5V16.5C13 16.2239 12.7761 16 12.5 16H11.5Z" />
      </svg>
      <span class="text-xl font-bold tracking-wide text-white">TixLoop</span>
    </div>
    
    <div class="flex items-center gap-3">
      <button onclick={() => showToast('Notifikasi akan segera hadir!', 'info')} class="w-10 h-10 rounded-full bg-[#1A1825] flex items-center justify-center relative active:scale-95 transition-transform">
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
        <span class="absolute top-2 right-2.5 w-2 h-2 bg-[#D4FF00] rounded-full"></span>
      </button>
      <button onclick={() => goto('/profile')} class="w-10 h-10 rounded-full bg-[#AAEF45] text-black font-bold flex items-center justify-center active:scale-95 transition-transform">
        {userInitial}
      </button>
    </div>
  </div>

  <div class="relative mb-6">
    <svg class="w-5 h-5 absolute left-4 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
    </svg>
    <input type="text" bind:value={searchQuery} onkeydown={handleSearch} placeholder="Cari event, artis, kota..." class="w-full bg-[#1A1825] text-sm text-white rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-1 focus:ring-[#D4FF00] placeholder-gray-500" />
  </div>

  <div class="flex overflow-x-auto hide-scrollbar gap-3 pb-2">
    {#each categories as cat}
      <button 
        class="px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors bg-[#1A1825] text-gray-400 hover:text-white"
        onclick={() => handleCategory(cat)}>
        {cat}
      </button>
    {/each}
  </div>
</div>
