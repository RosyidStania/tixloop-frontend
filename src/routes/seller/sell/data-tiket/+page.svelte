<script>
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { eventService } from '$lib/services/api/eventService';
  import { ticketService } from '$lib/services/api/ticketService';
  import { marketplaceService } from '$lib/services/api/marketplaceService';
  import { ticketUploadStore } from '$lib/stores/ticketUpload.js';
  
  let events = $state([]);
  let isSubmitting = $state(false);
  let selectedEvent = $state(null);
  let showEventDropdown = $state(false);

  const onBack = () => {
    goto('/seller/sell/upload-tiket');
  };

  // State menggunakan Runes Svelte 5
  let form = $state({
    eventId: "",
    tipetiket: "",
    kodetiket: "",
    hargaBeli: "600000",
    hargaJual: "600000",
    autoDrop: true,
    hargaTerendah: "600000",
  });
  
  let errorMessage = $state('');
  let showSuccessPopup = $state(false);

  const formatRupiah = (val) => {
    if (!val) return "";
    const num = val.toString().replace(/\D/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleHargaBeli = (e) => {
    form.hargaBeli = e.target.value.replace(/\./g, "");
  };

  const handleHargaJual = (e) => {
    form.hargaJual = e.target.value.replace(/\./g, "");
  };

  $effect(() => {
    if (form.autoDrop) {
      const beli = Number(form.hargaBeli) || 0;
      form.hargaTerendah = String(Math.floor(beli * 0.45));
    }
  });

  const handleEventChange = (e) => {
    const ev = events.find(x => x.id === e.target.value);
    selectedEvent = ev || null;
  };

  const selectEvent = (ev) => {
    form.eventId = ev ? ev.id : '';
    selectedEvent = ev || null;
    showEventDropdown = false;
  };

  onMount(async () => {
    try {
      const res = await eventService.getEvents();
      if (res.data) {
        events = res.data;
      }
    } catch (err) {
      console.error(err);
      errorMessage = "Gagal memuat daftar event.";
    }
  });

  const handleSubmit = async () => {
    if (!form.eventId || !form.kodetiket || !form.hargaBeli || !form.hargaJual) {
      errorMessage = 'Mohon lengkapi semua data wajib (Event, Kode Tiket, dan Harga).';
      return;
    }

    const uploadData = get(ticketUploadStore);
    if (!uploadData || !uploadData.invoiceFile) {
        errorMessage = 'Data upload tiket tidak ditemukan, harap kembali ke halaman upload.';
        return;
    }

    isSubmitting = true;
    errorMessage = '';

    try {
        const formData = new FormData();
        formData.append('event_id', form.eventId);
        formData.append('ticket_code', form.kodetiket);
        formData.append('original_price', form.hargaBeli);
        formData.append('ticket_proof', uploadData.invoiceFile);
        if (uploadData.fotoTiketFile) {
            formData.append('physical_photo', uploadData.fotoTiketFile);
        }
        if (form.tipetiket) {
            formData.append('ticket_type', form.tipetiket);
        }

        const uploadRes = await ticketService.uploadTicket(formData);
        const ticketId = uploadRes.data.id;

        await marketplaceService.createListing({
            ticket_id: ticketId,
            current_asking_price: form.hargaJual,
            is_auto_drop: form.autoDrop,
            floor_price: form.autoDrop ? form.hargaTerendah : null
        });

        // Simpan gambar ke localStorage sebagai base64 untuk simulasi frontend tanpa backend
        const saveImageToLocal = (file, keys) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX = 1000;
                    let width = img.width;
                    let height = img.height;
                    if (width > height && width > MAX) { height *= MAX / width; width = MAX; }
                    else if (height > MAX) { width *= MAX / height; height = MAX; }
                    canvas.width = width;
                    canvas.height = height;
                    canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                    const compressed = canvas.toDataURL('image/jpeg', 0.6);
                    try { keys.forEach(key => localStorage.setItem(key, compressed)); } catch(e) {}
                    resolve();
                };
                img.src = URL.createObjectURL(file);
            });
        };

        const promises = [];
        if (uploadData.fotoTiketFile) {
            promises.push(saveImageToLocal(uploadData.fotoTiketFile, [`ticket_qr_${ticketId}`, `ticket_photo_${ticketId}`]));
        }
        
        if (uploadData.invoiceFile) {
            const keys = [`ticket_invoice_${ticketId}`];
            if (!uploadData.fotoTiketFile) keys.push(`ticket_qr_${ticketId}`);
            promises.push(saveImageToLocal(uploadData.invoiceFile, keys));
        }

        await Promise.all(promises);

        showSuccessPopup = true;
        setTimeout(() => {
          goto('/seller/produk?tab=koleksi');
        }, 2000);
    } catch (err) {
        console.error(err);
        if (err?.response?.data?.errors) {
            const errors = err.response.data.errors;
            const firstErrorKey = Object.keys(errors)[0];
            errorMessage = errors[firstErrorKey][0];
        } else {
            errorMessage = err?.response?.data?.message || err.message || 'Gagal mengirim data tiket.';
        }
    } finally {
        isSubmitting = false;
    }
  };
</script>

{#if showSuccessPopup}
  <div class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-5">
    <div class="bg-[#14121E] border border-[#232033] rounded-3xl p-8 w-full max-w-[320px] flex flex-col items-center text-center shadow-2xl transition-all duration-300 transform scale-100">
      <div class="w-20 h-20 rounded-full bg-[#C2F04B]/20 flex items-center justify-center mb-5 border border-[#C2F04B]/30">
        <svg class="w-10 h-10 text-[#C2F04B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h3 class="text-white font-bold text-[20px] mb-2">Produk Tersimpan!</h3>
      <p class="text-gray-400 text-[13.5px] leading-relaxed">Tiket Anda berhasil diverifikasi dan ditambahkan ke koleksi produk.</p>
    </div>
  </div>
{/if}

<div class="min-h-screen w-full bg-[#06060E] font-sans text-white">
  <div class="max-w-[390px] mx-auto bg-[#06060E] min-h-screen flex flex-col relative pb-32">
    
    <header class="flex items-center gap-3 px-5 pt-10 pb-4">
      <button class="w-10 h-10 rounded-full bg-[#6B6B8F]/15 border border-[#6B6B8F]/30 flex items-center justify-center text-white transition-all hover:bg-[#6B6B8F]/20 active:scale-95" onclick={onBack}>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <div>
        <div class="text-xl font-bold text-white tracking-tight">Data Tiket</div>
        <div class="text-xs text-[#6B6B8F] mt-0.5 font-medium">Isi detail event</div>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto px-5 mt-2">
      <div class="flex flex-col gap-5">
        <div>
          <label class="block text-sm font-semibold text-white mb-2">Pilih Event</label>
          <div class="relative">
            <!-- Custom Select Button -->
            <button
              type="button"
              class="w-full bg-[#6B6B8F]/10 border border-[#6B6B8F]/30 rounded-xl pl-4 pr-10 py-3.5 text-sm text-left outline-none focus:border-[#C2F04B] transition-colors cursor-pointer {form.eventId ? 'text-white' : 'text-gray-400'}"
              onclick={() => showEventDropdown = !showEventDropdown}
            >
              {selectedEvent ? selectedEvent.event_name : 'Pilih Event'}
            </button>
            <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 {showEventDropdown ? 'rotate-180' : ''}">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 8L1 3H11L6 8Z" fill="#6B6B8F"/>
              </svg>
            </div>

            <!-- Custom Dropdown Menu -->
            {#if showEventDropdown}
              <!-- Click Outside Overlay -->
              <div class="fixed inset-0 z-10" onclick={() => showEventDropdown = false} aria-label="Tutup dropdown" role="button" tabindex="0" onkeypress={(e) => e.key === 'Enter' && (showEventDropdown = false)}></div>
              
              <div class="absolute top-full left-0 right-0 mt-2 bg-[#14121E] border border-[#232033] rounded-xl overflow-hidden z-20 shadow-2xl">
                <div class="max-h-[240px] overflow-y-auto custom-scrollbar">
                  <button 
                    type="button"
                    class="w-full text-left px-4 py-3.5 text-sm text-gray-400 hover:bg-[#6B6B8F]/10 transition-colors border-b border-[#232033]"
                    onclick={() => selectEvent(null)}
                  >
                    Pilih Event
                  </button>
                  {#each events as ev}
                    <button
                      type="button"
                      class="w-full text-left px-4 py-3.5 text-sm text-white hover:bg-[#6B6B8F]/10 transition-colors border-b border-[#232033] last:border-0 {form.eventId === ev.id ? 'bg-[#6B6B8F]/20 font-bold text-[#C2F04B]' : ''}"
                      onclick={() => selectEvent(ev)}
                    >
                      {ev.event_name}
                    </button>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        </div>

        {#if selectedEvent}
          <div class="bg-[#6B6B8F]/10 border border-[#6B6B8F]/30 rounded-2xl p-4">
            <div class="text-sm font-bold text-white mb-2">{selectedEvent.event_name}</div>
            <div class="text-xs text-[#6B6B8F]">
              <div><span class="text-white">📅 Tanggal:</span> {selectedEvent.event_datetime}</div>
              <div><span class="text-white">📍 Lokasi:</span> {selectedEvent.venue_name}</div>
            </div>
          </div>
        {/if}

        <div>
          <label class="block text-sm font-semibold text-white mb-2">Tipe Tiket (Opsional)</label>
          <input
            class="w-full bg-[#6B6B8F]/10 border border-[#6B6B8F]/30 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-[#C2F04B] transition-colors placeholder-[#6B6B8F]/50"
            placeholder="e.g., VIP, Reguler, VVIP"
            bind:value={form.tipetiket}
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-white mb-2">Kode Tiket / Barcode</label>
          <input
            class="w-full bg-[#6B6B8F]/10 border border-[#6B6B8F]/30 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-[#C2F04B] transition-colors placeholder-[#6B6B8F]/50 mb-1.5"
            placeholder="e.g., TIX-2026-ABC123"
            bind:value={form.kodetiket}
          />
          <span class="text-xs text-[#6B6B8F]">Kode unik tiket untuk verifikasi keamanan admin</span>
        </div>

        <div class="h-px w-full bg-[#6B6B8F]/20 my-2"></div>

        <div>
          <label class="block text-sm font-semibold text-white mb-2">Harga Beli (Asli)</label>
          <div class="relative flex items-center mb-1.5">
            <span class="absolute left-4 text-sm font-bold text-[#6B6B8F]">Rp</span>
            <input
              class="w-full bg-[#6B6B8F]/10 border border-[#6B6B8F]/30 rounded-xl pl-11 pr-4 py-3.5 text-base font-bold text-white outline-none focus:border-[#C2F04B] transition-colors"
              value={formatRupiah(form.hargaBeli)}
              oninput={handleHargaBeli}
            />
          </div>
          <span class="text-xs text-[#6B6B8F]">Harga asli saat kamu membeli tiket ini</span>
        </div>

        <div>
          <label class="block text-sm font-semibold text-white mb-2">Harga Jual</label>
          <div class="relative flex items-center mb-1.5">
            <span class="absolute left-4 text-sm font-bold text-[#6B6B8F]">Rp</span>
            <input
              class="w-full bg-[#6B6B8F]/10 border border-[#6B6B8F]/30 rounded-xl pl-11 pr-4 py-3.5 text-base font-bold text-[#C2F04B] outline-none focus:border-[#C2F04B] transition-colors"
              value={formatRupiah(form.hargaJual)}
              oninput={handleHargaJual}
            />
          </div>
          <span class="text-xs text-[#6B6B8F]">Harga yang akan ditampilkan kepada pembeli</span>
        </div>

        <div class="bg-[#6B6B8F]/10 border border-[#6B6B8F]/30 rounded-2xl p-4 flex items-center justify-between gap-3 mt-2">
          <div class="flex items-start gap-3 flex-1">
            <span class="text-xl text-[#C2F04B] mt-0.5">⚡</span>
            <div>
              <div class="text-sm font-bold text-white mb-1">Deals Ticket</div>
              <div class="text-xs text-[#6B6B8F] leading-relaxed">
                Tiket ditandai sebagai Deals dan memiliki batas harga terendah yang ditentukan penjual.
              </div>
            </div>
          </div>
          <button
            class="w-11 h-6 rounded-full relative transition-colors flex-shrink-0 {form.autoDrop ? 'bg-[#C2F04B]' : 'bg-[#6B6B8F]/30'}"
            onclick={() => (form.autoDrop = !form.autoDrop)}
          >
            <div class="w-[18px] h-[18px] bg-[#06060E] rounded-full absolute top-[3px] transition-transform duration-200 {form.autoDrop ? 'translate-x-[23px]' : 'translate-x-[3px]'}"></div>
          </button>
        </div>

        <div class="opacity-{form.autoDrop ? '100' : '40'} transition-opacity duration-300">
          <label class="block text-sm font-semibold text-white mb-2">Batas Harga Terendah (Diskon 55%)</label>
          <div class="relative flex items-center mb-1.5">
            <span class="absolute left-4 text-sm font-bold text-[#6B6B8F]">Rp</span>
            <input
              class="w-full bg-[#6B6B8F]/10 border border-[#6B6B8F]/30 rounded-xl pl-11 pr-4 py-3.5 text-base font-bold text-white outline-none cursor-not-allowed opacity-70"
              value={formatRupiah(form.hargaTerendah)}
              disabled
            />
          </div>
          <span class="text-xs text-[#6B6B8F]">Batas harga terendah otomatis diset ke 45% dari Harga Beli (diskon 55%)</span>
        </div>

      </div>
    </div>

    <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-5 py-5 bg-gradient-to-t from-[#06060E] via-[#06060E] to-transparent z-10 pt-10">
      {#if errorMessage}
        <div class="text-[#F43F5E] text-sm font-medium text-center mb-3 px-4 py-2.5 bg-[#F43F5E]/10 rounded-xl border border-[#F43F5E]/20">
          {errorMessage}
        </div>
      {/if}
      <button class="w-full bg-[#C2F04B] text-[#06060E] border-none rounded-xl py-4 text-base font-bold tracking-wide transition-all active:scale-95 disabled:opacity-50" onclick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Memproses...' : 'Submit untuk Verifikasi'}
      </button>
    </div>
  </div>
</div>
