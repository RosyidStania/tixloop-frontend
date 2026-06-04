<script>
  import { goto } from '$app/navigation';
  import BottomNav from '$lib/components/seller/layout/BottomNav.svelte';
  import { ticketService } from '$lib/services/ticketService';

  let uploadedFile = $state(null);
  let uploadedPreview = $state(null);
  let isDragging = $state(false);
  let hargaJual = $state('');
  let autoDrop = $state(true);
  let isPublishing = $state(false);

  function handleFileInput(e) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    isDragging = false;
    const file = e.dataTransfer?.files?.[0];
    if (file) processFile(file);
  }

  function processFile(file) {
    uploadedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => uploadedPreview = e.target.result;
    reader.readAsDataURL(file);
  }

  function removeFile() {
    uploadedFile = null;
    uploadedPreview = null;
  }

  function handleHargaInput(e) {
    const digits = e.target.value.replace(/\D/g, '');
    hargaJual = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  const canPublish = $derived(uploadedFile !== null && hargaJual.length > 0);

  async function handlePublish() {
    if (!canPublish || isPublishing) return;
    isPublishing = true;
    try {
      const formData = new FormData();
      formData.append('ticket_proof', uploadedFile);
      formData.append('original_price', hargaJual.replace(/\./g, ''));
      formData.append('event_id', '01kt65r7srvgnna8fk17khtdhw'); // Default dummy event ID
      formData.append('ticket_code', 'TIX-' + Math.floor(Math.random() * 100000));
      
      await ticketService.uploadTicket(formData);
      goto('/seller/listings');
    } catch (error) {
      console.error(error);
      alert('Gagal mengupload tiket');
    } finally {
      isPublishing = false;
    }
  }
</script>

<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-28">

  <!-- Header -->
  <div class="px-4 pt-12 pb-4 flex items-center gap-3">
    <button
      onclick={() => goto('/seller/dashboard')}
      class="w-8 h-8 bg-[#1A1825] rounded-full flex items-center justify-center active:scale-90 transition-transform shrink-0"
    >
      <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
    <div>
      <h1 class="text-base font-black leading-tight">Jual Tiket</h1>
      <p class="text-[11px] text-gray-500">Upload & listing tiket kamu</p>
    </div>
  </div>

  <div class="px-4 space-y-4">

    <p class="text-base font-black text-white">Upload Tiket</p>

    <!-- Upload zone -->
    {#if uploadedPreview}
      <div class="relative rounded-2xl overflow-hidden border border-[#AAEF45]/30 bg-[#14121E]">
        <img src={uploadedPreview} alt="Preview tiket" class="w-full object-contain max-h-52" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
          <div class="flex-1 min-w-0">
            <p class="text-[11px] font-bold text-white truncate">{uploadedFile?.name}</p>
            <p class="text-[10px] text-gray-400">{(uploadedFile?.size / 1024).toFixed(1)} KB</p>
          </div>
          <button onclick={removeFile} class="w-7 h-7 rounded-full bg-red-500/80 flex items-center justify-center active:scale-90 transition-transform shrink-0">
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    {:else}
      <label
        class="block border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors {isDragging ? 'border-[#AAEF45] bg-[#AAEF45]/5' : 'border-[#AAEF45]/40 bg-[#14121E]'}"
        ondragover={(e) => { e.preventDefault(); isDragging = true; }}
        ondragleave={() => isDragging = false}
        ondrop={handleDrop}
      >
        <input type="file" class="sr-only" accept="image/*,.pdf" onchange={handleFileInput} />

        <!-- QR icon — simple, clean, matches screenshot -->
        <div class="flex justify-center mb-4">
          <svg class="w-14 h-14 text-[#AAEF45]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <!-- top-left square -->
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none"/>
            <!-- top-right square -->
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none"/>
            <!-- bottom-left square -->
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none"/>
            <!-- bottom-right dots pattern -->
            <rect x="14" y="14" width="3" height="3" rx="0.5" fill="currentColor" stroke="none"/>
            <rect x="18" y="14" width="3" height="3" rx="0.5" fill="currentColor" stroke="none"/>
            <rect x="14" y="18" width="3" height="3" rx="0.5" fill="currentColor" stroke="none"/>
          </svg>
        </div>

        <p class="text-sm font-bold text-white">Upload Foto Tiket / Invoice</p>
        <p class="text-[11px] text-gray-500 mt-1">atau scan QR code tiket</p>
      </label>
    {/if}

    <!-- Foto Tiket & Scan QR buttons -->
    <div class="grid grid-cols-2 gap-3">
      <label class="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#14121E] border border-[#AAEF45]/30 cursor-pointer active:scale-[0.97] transition-transform">
        <input type="file" class="sr-only" accept="image/*" onchange={handleFileInput} />
        <svg class="w-4 h-4 text-[#AAEF45]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
        <span class="text-sm font-bold text-[#AAEF45]">Foto Tiket</span>
      </label>

      <button class="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#14121E] border border-[#232033] active:scale-[0.97] transition-transform">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2"/>
          <rect x="8" y="8" width="8" height="8" rx="1"/>
        </svg>
        <span class="text-sm font-bold text-gray-300">Scan QR</span>
      </button>
    </div>

    <!-- Harga Jual -->
    <div>
      <p class="text-[11px] font-black text-gray-500 tracking-widest uppercase mb-2">Harga Jual</p>
      <div class="bg-[#14121E] border border-[#232033] rounded-xl flex items-center px-4 py-3.5 focus-within:border-[#AAEF45]/40 transition-colors">
        <span class="text-sm font-bold text-gray-500 shrink-0 mr-3">Rp</span>
        <input
          type="text"
          inputmode="numeric"
          placeholder="0"
          value={hargaJual}
          oninput={handleHargaInput}
          class="flex-1 bg-transparent text-sm font-bold text-white placeholder-gray-600 outline-none"
        />
      </div>
    </div>

    <!-- Auto Drop Price -->
    <div class="bg-[#14121E] border border-[#232033] rounded-2xl p-4">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-[#AAEF45]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          <span class="text-sm font-bold text-white">Auto Drop Price</span>
        </div>
        <button
          onclick={() => autoDrop = !autoDrop}
          class="relative w-11 h-6 rounded-full transition-colors duration-200 {autoDrop ? 'bg-[#AAEF45]' : 'bg-[#2a2840]'}"
        >
          <span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 {autoDrop ? 'translate-x-5' : 'translate-x-0'}"></span>
        </button>
      </div>
      <p class="text-[11px] text-gray-500 leading-relaxed">
        {autoDrop
          ? 'Turunkan harga otomatis 10% setiap 7 hari mendekati tanggal event'
          : 'Harga tidak akan berubah otomatis hingga kamu edit secara manual.'}
      </p>
    </div>

    <!-- Publish button -->
    <button
      onclick={handlePublish}
      disabled={!canPublish || isPublishing}
      class="w-full py-4 rounded-2xl text-sm font-black transition-all active:scale-[0.98]
        {canPublish
          ? 'bg-[#AAEF45] text-[#0A0910] shadow-[0_4px_24px_rgba(170,239,69,0.3)]'
          : 'bg-[#14121E] border border-[#232033] text-gray-600 cursor-not-allowed'}"
    >
      {#if isPublishing}
        <span class="flex items-center justify-center gap-2">
          <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Publishing...
        </span>
      {:else}
        Publish Listing
      {/if}
    </button>

  </div>
</main>

<BottomNav activeTab="sell" />