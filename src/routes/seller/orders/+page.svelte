<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import BottomNav from '$lib/components/seller/layout/BottomNav.svelte';
  import api from '$lib/axios';

  let orders = $state([]);
  let isLoading = $state(true);
  let pollingInterval;

  async function fetchTransactions() {
    try {
      const response = await api.get('/transactions');
      const responseData = response.data.data || response.data || [];
      const txs = Array.isArray(responseData) ? responseData : (responseData.data || []);
      
      orders = txs.map(tx => {
        // Mapping status to UI friendly text
        let displayStatus = 'Pending';
        if (tx.status === 'completed' || tx.status === 'paid') {
           const eventDate = new Date(tx.ticket?.event?.event_datetime || tx.created_at);
           const threeDaysAfterEvent = new Date(eventDate.getTime() + 3 * 24 * 60 * 60 * 1000);
           const now = new Date();
           
           if (now > threeDaysAfterEvent) {
             displayStatus = 'Dana Masuk';
           } else {
             displayStatus = 'Dana Ditahan';
           }
        } else if (tx.status === 'cancelled') {
           displayStatus = 'Dibatalkan';
        }

        return {
          id: tx.id,
          event: tx.ticket?.event?.event_name || 'Event Ticket',
          buyer: '@' + (tx.buyer?.name || 'buyer').replace(/\s+/g, '_').toLowerCase(),
          date: new Date(tx.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          amount: Number(tx.amount),
          status: displayStatus,
        };
      });
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    fetchTransactions();
    pollingInterval = setInterval(fetchTransactions, 5000);
  });

  onDestroy(() => {
    if (pollingInterval) clearInterval(pollingInterval);
  });

  function formatRupiah(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID').replace(/\./g, '.');
  }
</script>

<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-28">
  
  <div class="px-5 pt-14 pb-6">
    <h1 class="text-xl font-bold text-white tracking-tight">Orders</h1>
    <p class="text-xs text-gray-500 mt-0.5 font-medium">Pesanan dari buyer</p>
  </div>

  <div class="px-5 space-y-4">
    {#if isLoading}
      <div class="flex justify-center py-10" in:fade>
        <svg class="w-8 h-8 animate-spin text-[#AAEF45]" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    {:else if orders.length === 0}
      <div class="text-center py-10" in:fade>
        <p class="text-gray-500 text-sm">Belum ada pesanan.</p>
      </div>
    {:else}
      {#each orders as order, i (order.id)}
        <a 
          href="/seller/orders/detail-orders/{order.id}"
          in:fly={{ y: 20, duration: 400, delay: i * 120 }}
          class="bg-[#14121E] border border-[#232033] rounded-2xl p-5 flex flex-col gap-4 transition-transform active:scale-[0.98] cursor-pointer hover:border-[#AAEF45]/30 block"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm font-bold text-white tracking-wide">{order.event}</span>
            
            {#if order.status === 'Dana Masuk'}
              <span class="px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide bg-[#AAEF45]/10 text-[#AAEF45] border border-[#AAEF45]/20">
                {order.status}
              </span>
            {:else if order.status === 'Dana Ditahan'}
              <span class="px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide bg-[#E6C83D]/10 text-[#E6C83D] border border-[#E6C83D]/20">
                {order.status}
              </span>
            {:else}
              <span class="px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide bg-[#FF6B6B]/10 text-[#FF6B6B] border border-[#FF6B6B]/20">
                {order.status}
              </span>
            {/if}
          </div>

          <div class="flex justify-between items-end pt-1">
            <div class="flex flex-col gap-1">
              <span class="text-xs font-bold text-gray-400">{order.buyer}</span>
              <span class="text-[10px] font-medium text-gray-600">{order.date}</span>
            </div>
            <span class="text-base font-bold text-[#AAEF45] tracking-tight">{formatRupiah(order.amount)}</span>
          </div>
        </a>
      {/each}
    {/if}
  </div>

</main>

<BottomNav activeTab="orders" />