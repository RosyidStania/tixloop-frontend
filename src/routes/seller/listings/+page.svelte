<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import BottomNav from '$lib/components/seller/layout/BottomNav.svelte';
  import { ticketService } from '$lib/services/ticketService';

  let activeFilter = $state('draft'); // Pindah tab default ke Pending (draft)
  let isLoading = $state(true);

  const filters = [
    { id: 'active', label: 'Active' },
    { id: 'sold', label: 'Sold' },
    { id: 'draft', label: 'Pending' }
  ];

  let allListings = $state([]);

  onMount(async () => {
    try {
      const response = await ticketService.getMyTickets();
      // Map tickets dari backend ke format UI
      allListings = response.data.map(t => {
        // Karena backend TicketResource tidak mengembalikan 'listing_status',
        // dan secara bisnis logika semua tiket yang baru diupload status listing-nya adalah 'pending',
        // kita akan paksa semua tiket masuk ke kategori 'draft' (Pending).
        let mappedStatus = 'draft'; 
        
        return {
          id: t.id,
          title: t.event ? t.event.event_name : 'Unknown Event',
          category: t.event ? t.event.event_category : 'General',
          harga: 'TBD',
          views: 0,
          watchers: 0,
          status: mappedStatus
        };
      });
    } catch (error) {
      console.error(error);
    } finally {
      isLoading = false;
    }
  });

  const listings = $derived(allListings.filter(l => l.status === activeFilter));
</script>

<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-28">

  <!-- Header -->
  <div class="px-4 pt-12 pb-4">
    <h1 class="text-xl font-black">My Listings</h1>
    <p class="text-[11px] text-gray-500 mt-0.5">Kelola tiket yang kamu jual</p>
  </div>

  <div class="px-4 space-y-4">

    <!-- Filter tabs -->
    <div class="flex items-center gap-2">
      {#each filters as f}
        <button
          onclick={() => activeFilter = f.id}
          class="px-5 py-2 rounded-full text-sm font-bold transition-all active:scale-95
            {activeFilter === f.id
              ? 'bg-[#AAEF45] text-[#0A0910]'
              : 'bg-[#14121E] border border-[#232033] text-gray-400'}"
        >
          {f.label}
        </button>
      {/each}
    </div>

    <!-- Listings -->
    {#if listings.length === 0}
      <div class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-14 h-14 rounded-2xl bg-[#14121E] border border-[#232033] flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
            <line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>
        </div>
        <p class="text-sm font-bold text-gray-500">Belum ada listing</p>
        <p class="text-[11px] text-gray-600 mt-1">Tiket kamu akan muncul di sini</p>
      </div>

    {:else}
      <div class="space-y-3">
        {#each listings as item}
          <div class="bg-[#14121E] border border-[#232033] rounded-2xl p-4 space-y-3">

            <!-- Title & category -->
            <div>
              <p class="text-sm font-black text-white">{item.title}</p>
              <p class="text-[11px] text-gray-500 mt-0.5">{item.category}</p>
            </div>

            <!-- Stats row -->
            <div class="flex items-center gap-4">
              <!-- Harga -->
              <div class="flex-1">
                <p class="text-[10px] text-gray-600 mb-0.5">Harga</p>
                <p class="text-sm font-black text-[#AAEF45]">Rp {item.harga}</p>
              </div>

              <!-- Divider -->
              <div class="w-px h-8 bg-[#232033]"></div>

              <!-- Views -->
              <div class="text-center">
                <p class="text-[10px] text-gray-600 mb-0.5">Views</p>
                <p class="text-sm font-black text-white">{item.views}</p>
              </div>

              <!-- Divider -->
              <div class="w-px h-8 bg-[#232033]"></div>

              <!-- Watchers -->
              <div class="text-center">
                <p class="text-[10px] text-gray-600 mb-0.5">Watchers</p>
                <p class="text-sm font-black text-white">{item.watchers}</p>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="grid grid-cols-2 gap-2 pt-1">
              <button
                onclick={() => goto(`/seller/listings/${item.id}/edit`)}
                class="py-2.5 rounded-xl bg-[#AAEF45]/10 border border-[#AAEF45]/25 text-[#AAEF45] text-sm font-bold active:scale-[0.97] transition-transform"
              >
                Edit
              </button>

              {#if item.status === 'active'}
                <button onclick={() => goto(`/seller/listings/${item.id}/draft`)} class="py-2.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm font-bold active:scale-[0.97] transition-transform">
                  Draft
                </button>
              {:else if item.status === 'draft'}
                <button class="py-2.5 rounded-xl bg-[#AAEF45]/10 border border-[#AAEF45]/25 text-[#AAEF45] text-sm font-bold active:scale-[0.97] transition-transform">
                  Publish
                </button>
              {:else if item.status === 'sold'}
                <button class="py-2.5 rounded-xl bg-[#1A1825] border border-[#2a2840] text-gray-500 text-sm font-bold cursor-not-allowed">
                  Sold
                </button>
              {/if}
            </div>

          </div>
        {/each}
      </div>
    {/if}

  </div>
</main>

<BottomNav activeTab="listings" />