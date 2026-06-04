<script>
  import BottomNav from '$lib/components/seller/layout/BottomNav.svelte';
  import { fly } from 'svelte/transition';

  let orders = $state([
    {
      id: 1,
      event: 'Jazz Festival',
      buyer: '@andi_jazz',
      date: '20 Mei 2026',
      amount: 850000,
      status: 'Dana Ditahan',
    },
    {
      id: 2,
      event: 'Rock Night',
      buyer: '@sarah_music',
      date: '18 Mei 2026',
      amount: 450000,
      status: 'Dana Masuk',
    },
  ]);

  function formatRupiah(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID').replace(/\./g, '.');
  }
</script>

<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-28">
  
  <div class="px-5 pt-14 pb-6">
    <h1 class="text-3xl font-black text-white tracking-tight">Orders</h1>
    <p class="text-[13px] text-gray-500 mt-1 font-medium">Pesanan dari buyer</p>
  </div>

  <div class="px-5 space-y-4">
    {#each orders as order, i (order.id)}
      <div 
        in:fly={{ y: 20, duration: 400, delay: i * 120 }}
        class="bg-[#14121E] border border-[#232033] rounded-2xl p-5 flex flex-col gap-4 transition-transform active:scale-[0.98] cursor-pointer hover:border-[#AAEF45]/30"
      >
        <div class="flex justify-between items-center">
          <span class="text-base font-bold text-white tracking-wide">{order.event}</span>
          
          {#if order.status === 'Dana Masuk'}
            <span class="px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide bg-[#AAEF45]/10 text-[#AAEF45] border border-[#AAEF45]/20">
              {order.status}
            </span>
          {:else}
            <span class="px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide bg-[#FF6B6B]/10 text-[#FF6B6B] border border-[#FF6B6B]/20">
              {order.status}
            </span>
          {/if}
        </div>

        <div class="flex justify-between items-end pt-1">
          <div class="flex flex-col gap-1">
            <span class="text-[13px] font-bold text-gray-400">{order.buyer}</span>
            <span class="text-[11px] font-medium text-gray-600">{order.date}</span>
          </div>
          <span class="text-xl font-black text-[#AAEF45] tracking-tight">{formatRupiah(order.amount)}</span>
        </div>
      </div>
    {/each}
  </div>

</main>

<BottomNav activeTab="orders" />