<script>
  import TopHeader from './components/TopHeader.svelte';
  import LastMinuteDeals from './components/LastMinuteDeals.svelte';
  import Trending from './components/Trending.svelte';
  import NearLocation from './components/NearLocation.svelte';
  import BottomNav from '$lib/components/buyer/layout/BottomNav.svelte';
</script>

<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-24 overflow-x-hidden">
  <TopHeader />

  <div class="space-y-8 mt-6">
    <LastMinuteDeals />

    <Trending />

    <div class="px-4">
      <NearLocation />
    </div>
  </div>

  <BottomNav />
</main>
