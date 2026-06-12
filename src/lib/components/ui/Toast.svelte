<script>
  import { toastState } from '$lib/stores/toast.svelte.js';
  import { fade, slide } from 'svelte/transition';
</script>

{#if toastState.current}
  <div class="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none" in:slide={{ duration: 300 }} out:fade={{ duration: 200 }}>
    <div class="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border {toastState.current.type === 'error' ? 'bg-[#FF3366] border-[#FF3366]/50 text-white' : 'bg-[#D4FF00] border-[#D4FF00]/50 text-black'}">
      {#if toastState.current.type === 'error'}
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      {:else}
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      {/if}
      <span class="text-sm font-bold whitespace-nowrap">{toastState.current.message}</span>
    </div>
  </div>
{/if}
