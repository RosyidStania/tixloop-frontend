<script>
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { ticketUploadStore } from '$lib/stores/ticketUpload.js';
  import BottomNav from '$lib/components/seller/layout/BottomNav.svelte';
  
  let fotoTiket = $state(null);
  let fotoTiketFile = $state(null);
  let invoice = $state(null);
  let invoiceFile = $state(null);

  onMount(() => {
    const data = get(ticketUploadStore);
    if (data) {
      if (data.fotoTiket) fotoTiket = data.fotoTiket;
      if (data.fotoTiketFile) fotoTiketFile = data.fotoTiketFile;
      if (data.invoice) invoice = data.invoice;
      if (data.invoiceFile) invoiceFile = data.invoiceFile;
    }
  });
  
  // State untuk melacak mode tombol
  let tiketMode = $state('file'); 
  let invoiceMode = $state('kamera');
  
  let errorMessage = $state('');

  let fotoTiketInput;
  let invoiceInput;

  const handleFile = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'fotoTiket') {
      fotoTiket = url;
      fotoTiketFile = file;
    } else {
      invoice = url;
      invoiceFile = file;
    }
    // Clear error if both are filled
    if (fotoTiket && invoice) {
      errorMessage = '';
    }
  };


  const onNext = () => {
    if (!fotoTiket || !invoice) {
      errorMessage = 'Mohon upload Foto Tiket dan Invoice terlebih dahulu.';
      return;
    }
    // Menyimpan file ke state global sebelum pindah
    ticketUploadStore.set({
      fotoTiket,
      fotoTiketFile,
      invoice,
      invoiceFile
    });
    goto('/seller/sell/data-tiket');
  };
</script>

<div class="min-h-screen w-full bg-[#06060E] font-sans text-white">
  
  <div class="max-w-[390px] mx-auto bg-[#06060E] min-h-screen flex flex-col relative pb-28">
    
    <div class="flex items-center gap-3 px-5 pt-10 pb-4">
      <div>
        <h1 class="text-xl font-bold text-white tracking-tight">Jual Tiket</h1>
        <div class="text-xs text-[#6B6B8F] mt-0.5">Upload tiket yang ingin kamu jual</div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto px-5 mt-3">

      <div class="mb-8">
        <div class="text-sm font-bold text-white mb-3 tracking-tight">Upload Tiket</div>

        <div class="relative w-full h-[150px] mb-3">
          <button
            class="w-full h-full border-2 border-dashed border-[#6B6B8F]/40 rounded-2xl bg-[#6B6B8F]/10 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all hover:bg-[#6B6B8F]/20 active:scale-[0.98] overflow-hidden"
            onclick={() => fotoTiketInput?.click()}
          >
            {#if fotoTiket}
              <img src={fotoTiket} alt="tiket" class="w-full h-full object-cover rounded-xl" />
            {:else}
              <svg class="mb-1" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6B6B8F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
                <path d="M13 5v2"></path>
                <path d="M13 11v2"></path>
                <path d="M13 17v2"></path>
              </svg>
              <div class="text-sm font-bold text-white">Upload Foto Tiket</div>
              <div class="text-xs text-[#6B6B8F]">Klik untuk memilih file</div>
            {/if}
          </button>
          
          {#if fotoTiket}
            <button 
              class="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors z-10"
              onclick={(e) => { e.stopPropagation(); fotoTiket = null; fotoTiketFile = null; }}
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          {/if}
        </div>

        <input
          bind:this={fotoTiketInput}
          type="file"
          accept="image/*,application/pdf"
          style="display: none;"
          onchange={(e) => handleFile(e, 'fotoTiket')}
        />

        <button
          class="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center transition-all bg-[#6B6B8F]/15 text-[#6B6B8F] border border-[#6B6B8F]/30 hover:text-white"
          onclick={() => fotoTiketInput?.click()}
        >
          <svg class="w-[18px] h-[18px] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
          </svg>
          Upload File
        </button>
      </div>

      <div class="mb-8">
        <div class="text-sm font-bold text-white mb-3 tracking-tight">Upload Bukti Pembelian</div>

        <div class="relative w-full h-[150px] mb-3">
          <button
            class="w-full h-full border-2 border-dashed border-[#6B6B8F]/40 rounded-2xl bg-[#6B6B8F]/10 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all hover:bg-[#6B6B8F]/20 active:scale-[0.98] overflow-hidden"
            onclick={() => invoiceInput?.click()}
          >
            {#if invoice}
              <img src={invoice} alt="invoice" class="w-full h-full object-cover rounded-xl" />
            {:else}
              <svg class="mb-1" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6B6B8F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <div class="text-sm font-bold text-white">Upload Invoice</div>
              <div class="text-xs text-[#6B6B8F]">Klik untuk memilih file</div>
            {/if}
          </button>
          
          {#if invoice}
            <button 
              class="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors z-10"
              onclick={(e) => { e.stopPropagation(); invoice = null; invoiceFile = null; }}
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          {/if}
        </div>

        <input
          bind:this={invoiceInput}
          type="file"
          accept="image/*,application/pdf"
          style="display: none;"
          onchange={(e) => handleFile(e, 'invoice')}
        />

        <button
          class="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center transition-all bg-[#6B6B8F]/15 text-[#6B6B8F] border border-[#6B6B8F]/30 hover:text-white"
          onclick={() => invoiceInput?.click()}
        >
          <svg class="w-[18px] h-[18px] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
          </svg>
          Upload File
        </button>
      </div>

    </div>
    
    <div class="fixed bottom-[75px] left-1/2 -translate-x-1/2 w-full max-w-[390px] px-5 py-6 bg-gradient-to-t from-[#06060E] via-[#06060E] to-transparent z-10 pt-12">
      {#if errorMessage}
        <div class="text-[#F43F5E] text-sm font-medium text-center mb-3 px-4 py-2 bg-[#F43F5E]/10 rounded-lg border border-[#F43F5E]/20">
          {errorMessage}
        </div>
      {/if}
      <button class="w-full bg-[#C2F04B] text-[#06060E] border-none rounded-xl py-4 text-base font-bold tracking-wide transition-all active:scale-95" onclick={onNext}>
        Selanjutnya
      </button>
    </div>

  </div>
</div>

<BottomNav activeTab="sell" />