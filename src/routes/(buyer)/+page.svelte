<script>
  import { onMount } from 'svelte';
  import api from '$lib/axios';
  import TopHeader from './components/TopHeader.svelte';
  import LastMinuteDeals from './components/LastMinuteDeals.svelte';
  import Trending from './components/Trending.svelte';
  import NearLocation from './components/NearLocation.svelte';
  import BottomNav from '$lib/components/buyer/layout/BottomNav.svelte';

  let listings = $state([]);
  let dealsListings = $state([]);
  let isLoading = $state(true);

  onMount(async () => {
    try {
      const [resAll, resDeals] = await Promise.all([
        api.get('/marketplace/listings?per_page=50'),
        api.get('/marketplace/listings?deals=true&per_page=10')
      ]);
      
      let allListings = resAll.data.data || resAll.data || [];
      let allDeals = resDeals.data.data || resDeals.data || [];
      
      listings = allListings;
      dealsListings = allDeals;
    } catch (error) {
      console.error('Failed to load listings', error);
    } finally {
      isLoading = false;
    }
  });
</script>

<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-24 overflow-x-hidden">
  <TopHeader />

  <div class="space-y-8 mt-6">
    {#if isLoading}
      <div class="flex justify-center p-8">
        <div class="w-8 h-8 border-4 border-[#D4FF00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    {:else}
      {#if dealsListings.length > 0}
        <LastMinuteDeals listings={dealsListings} />
      {/if}

      <Trending {listings} />

      <div class="px-4">
        <NearLocation />
      </div>
    {/if}
  </div>

  <BottomNav activeTab="home" />
</main>
