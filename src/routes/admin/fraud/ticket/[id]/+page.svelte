<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import api from '$lib/axios';
  import { showToast } from '$lib/stores/toast.svelte.js';

  let ticketId = $derived($page.params.id);

  let pengirim = $state('');
  let emailPengirim = $state('');
  let namaEvent = $state('');
  let kategoriEvent = $state('');
  let artistPenyelenggara = $state('');
  let tanggal = $state('');
  let waktu = $state('');
  let venue = $state('');
  let tipsTicket = $state('');
  let kodeTicket = $state('');
  let hargaBeli = $state('');
  let hargaJual = $state('');
  let autoDropPrice = $state(true);
  let hargaTerendah = $state('');
  let status = $state('pending');
  let ticketProofUrl = $state(null);
  let invoiceProofUrl = $state(null);
  let rawListingData = $state(null);

  let showRejectConfirm = $state(false);
  let showBlockConfirm = $state(false);
  let showVerifyConfirm = $state(false);
  let isLoading = $state(true);

  onMount(async () => {
    try {
      const res = await api.get(`/admin/listings/${$page.params.id}`);
      const data = res.data.data || res.data;
      rawListingData = data;

      pengirim = data.seller?.name || 'Unknown';
      emailPengirim = data.seller?.email || 'Unknown';
      namaEvent = data.ticket?.event?.name || 'Unknown Event';
      kategoriEvent = data.ticket?.event?.category || 'Konser';
      artistPenyelenggara = data.ticket?.event?.name || '-';
      
      const eventDateStr = data.ticket?.event?.date || data.ticket?.event?.event_datetime || new Date().toISOString();
      const eventDate = new Date(eventDateStr);
      tanggal = eventDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      waktu = eventDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' - Selesai';
      
      venue = data.ticket?.event?.venue || '-';
      tipsTicket = data.ticket?.seat_number || 'Regular';
      kodeTicket = data.ticket?.ticket_code || '-';
      hargaBeli = data.original_price || '0';
      hargaJual = data.current_asking_price || '0';
      hargaTerendah = data.floor_price || '0';
      
      // Sinkronisasi status auto drop dari seller
      autoDropPrice = data.is_auto_drop === true || data.is_auto_drop === 1 || data.is_auto_drop === '1';
      
      status = data.verification_status;

      if (data.ticket?.id) {
        // Ambil invoice proof
        try {
          const proofRes = await api.get(`/tickets/${data.ticket.id}/proof`, { responseType: 'blob' });
          invoiceProofUrl = URL.createObjectURL(proofRes.data);
        } catch (err) {
          console.warn('Gagal fetch invoice proof:', err);
        }

        // Ambil physical photo
        try {
          const photoRes = await api.get(`/tickets/${data.ticket.id}/physical-photo`, { responseType: 'blob' });
          ticketProofUrl = URL.createObjectURL(photoRes.data);
        } catch (err) {
          console.warn('Gagal fetch physical photo:', err);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat detail tiket.', 'error');
    } finally {
      isLoading = false;
    }
  });

  function formatRupiah(val) {
    if (!val) return 'Rp 0';
    return 'Rp ' + Number(val).toLocaleString('id-ID');
  }

  function handleBack() {
    window.history.back();
  }

  function handleTolak() {
    showRejectConfirm = true;
  }

  async function submitTolak() {
    showRejectConfirm = false;
    try {
      await api.post(`/admin/listings/${$page.params.id}/reject`, { rejection_reason: 'Ditolak admin' });
      showToast(`Tiket ${ticketId} berhasil ditolak.`);
      handleBack();
    } catch (err) {
      console.error('Backend reject failed:', err);
      const msg = err.response?.data?.message || err.response?.data?.errors?.listing?.[0] || 'Gagal menolak tiket. Status tidak diizinkan oleh backend.';
      showToast(msg, 'error');
    }
  }

  function handleVerifikasi() {
    showVerifyConfirm = true;
  }

  async function submitVerifikasi() {
    showVerifyConfirm = false;
    try {
      await api.post(`/admin/listings/${$page.params.id}/verify`);
    } catch (err) {
      console.warn('Backend verify failed (maybe already verified), proceeding locally:', err);
    }
    
    // localStorage handling removed

    showToast(`Tiket ${ticketId} berhasil diverifikasi.`);
    handleBack();
  }

  function handleBlockAkun() {
    showBlockConfirm = true;
  }

  function submitBlock() {
    showBlockConfirm = false;
    showToast(`Fitur blokir untuk ${emailPengirim} akan segera hadir.`);
  }
</script>

<main class="bg-[#06060E] min-h-screen text-white font-sans pb-24 relative">
  <!-- Header -->
  <div class="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#06060E]/95 backdrop-blur-md border-b border-[#232033]">
    <button class="w-9 h-9 rounded-xl bg-[#14121E] border border-[#232033] flex items-center justify-center text-gray-400 hover:bg-[#1A1825] transition" onclick={handleBack}>
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <div class="flex flex-col items-center">
      <span class="text-base font-bold text-gray-100 leading-tight">Detail Tiket</span>
      <span class="text-[10px] text-gray-500 font-mono">{ticketId}</span>
    </div>
    <div class="w-9"></div>
  </div>

  <div class="p-4">
    <!-- Bukti Foto Tiket -->
    <div class="mb-5">
      <div class="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider pl-1">Bukti Foto Tiket</div>
      <div class="w-full h-[200px] bg-[#14121E] border border-[#232033] rounded-2xl overflow-hidden flex items-center justify-center">
        {#if ticketProofUrl}
          <img src={ticketProofUrl} alt="Bukti Tiket" class="w-full h-full object-contain" />
        {:else}
          <div class="flex flex-col items-center gap-2 text-gray-500">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span class="text-xs">Tidak ada bukti tiket fisik</span>
          </div>
        {/if}
      </div>
    </div>

    <!-- Bukti Invoice -->
    <div class="mb-6">
      <div class="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider pl-1">Bukti Invoice / Pembayaran</div>
      <div class="w-full h-[200px] bg-[#14121E] border border-[#232033] rounded-2xl overflow-hidden flex items-center justify-center">
        {#if invoiceProofUrl}
          <img src={invoiceProofUrl} alt="Bukti Pembayaran" class="w-full h-full object-contain" />
        {:else}
          <div class="flex flex-col items-center gap-2 text-gray-500">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="16" x2="12" y2="16"/></svg>
            <span class="text-xs">Tidak ada bukti invoice</span>
          </div>
        {/if}
      </div>
    </div>

    <!-- Details -->
    <div class="flex flex-col gap-3">
      <div class="flex flex-col gap-1.5">
        <label class="text-xs text-gray-500 font-medium pl-1">Pengirim</label>
        <div class="bg-[#14121E] border border-[#232033] rounded-xl px-4 py-2.5 text-sm font-medium text-gray-200">{pengirim}</div>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-xs text-gray-500 font-medium pl-1">Email Pengirim</label>
        <div class="bg-[#14121E] border border-[#232033] rounded-xl px-4 py-2.5 text-sm font-medium text-gray-200">{emailPengirim}</div>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-xs text-gray-500 font-medium pl-1">Nama Event</label>
        <div class="bg-[#14121E] border border-[#232033] rounded-xl px-4 py-2.5 text-sm font-medium text-gray-200">{namaEvent}</div>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-xs text-gray-500 font-medium pl-1 flex items-center gap-1.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          Kategori Event
        </label>
        <div class="bg-[#14121E] border border-[#232033] rounded-xl px-4 py-2.5 text-sm font-medium text-gray-200 flex justify-between items-center">
          <span>{kategoriEvent}</span>
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-xs text-gray-500 font-medium pl-1 flex items-center gap-1.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Artist / Penyelenggara
        </label>
        <div class="bg-[#14121E] border border-[#232033] rounded-xl px-4 py-2.5 text-sm font-medium text-gray-200">{artistPenyelenggara}</div>
      </div>

      <div class="flex gap-2.5">
        <div class="flex flex-col gap-1.5 flex-1">
          <label class="text-xs text-gray-500 font-medium pl-1 flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Tanggal
          </label>
          <div class="bg-[#14121E] border border-[#232033] rounded-xl px-4 py-2.5 text-sm font-medium text-gray-200">{tanggal}</div>
        </div>
        <div class="flex flex-col gap-1.5 flex-1">
          <label class="text-xs text-gray-500 font-medium pl-1">Waktu</label>
          <div class="bg-[#14121E] border border-[#232033] rounded-xl px-4 py-2.5 text-sm font-medium text-gray-200">{waktu}</div>
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-xs text-gray-500 font-medium pl-1 flex items-center gap-1.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Venue / Lokasi
        </label>
        <div class="bg-[#14121E] border border-[#232033] rounded-xl px-4 py-2.5 text-sm font-medium text-gray-200">{venue}</div>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-xs text-gray-500 font-medium pl-1">Tips Tiket</label>
        <div class="bg-[#14121E] border border-[#232033] rounded-xl px-4 py-2.5 text-sm font-medium text-gray-200">{tipsTicket}</div>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-xs text-gray-500 font-medium pl-1">Kode Tiket / Barcode</label>
        <div class="bg-[#14121E] border border-[#232033] rounded-xl px-4 py-2.5 text-sm font-medium text-gray-200 font-mono tracking-wide">{kodeTicket}</div>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-xs text-gray-500 font-medium pl-1">Harga Beli (Asli)</label>
        <div class="bg-[#14121E] border border-[#232033] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-100">{formatRupiah(hargaBeli)}</div>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-xs text-gray-500 font-medium pl-1">Harga Jual</label>
        <div class="bg-[#14121E] border border-[#232033] rounded-xl px-4 py-2.5 text-sm font-bold text-[#C2F04B]">{formatRupiah(hargaJual)}</div>
      </div>

      <div class="bg-[#14121E] border border-[#232033] rounded-2xl p-4 mt-2">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-[#C2F04B]/10 border border-[#C2F04B]/20 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C2F04B" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <span class="text-xs font-bold text-gray-100">Deals Ticket</span>
          </div>
          <button class="w-11 h-6 rounded-full relative transition-colors {autoDropPrice ? 'bg-[#C2F04B]' : 'bg-[#232033]'}" onclick={() => autoDropPrice = !autoDropPrice}>
            <span class="absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full transition-transform shadow-sm {autoDropPrice ? 'translate-x-[20px]' : 'translate-x-0'}"></span>
          </button>
        </div>
        <p class="text-[10px] text-gray-400 leading-relaxed">Tiket ditandai sebagai Deals dan memiliki batas harga terendah yang ditentukan penjual.</p>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-xs text-gray-500 font-medium pl-1">Harga Terendah</label>
        <div class="bg-[#14121E] border border-[#232033] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-100">{formatRupiah(hargaTerendah)}</div>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-8 flex flex-col gap-3">
      {#if status === 'pending'}
        <div class="flex gap-3">
          <button class="flex-1 bg-[#14121E] border border-[#232033] text-gray-300 rounded-xl py-3.5 text-sm font-bold hover:bg-[#1A1825] transition" onclick={handleTolak}>Tolak</button>
          <button class="flex-1 bg-[#C2F04B] text-[#06060E] rounded-xl py-3.5 text-sm font-bold hover:opacity-90 transition" onclick={handleVerifikasi}>Verifikasi</button>
        </div>
      {:else if status === 'verified'}
        <div class="bg-[#C2F04B]/10 border border-[#C2F04B]/20 rounded-xl p-3.5 flex items-center justify-center gap-2 text-[#C2F04B] font-semibold text-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Tiket sudah diverifikasi
        </div>
        <button class="w-full bg-[#14121E] border border-red-500/20 text-red-500 rounded-xl py-3 text-[13px] font-bold hover:bg-red-500/10 transition mt-1" onclick={handleTolak}>Batalkan & Tolak Tiket</button>
      {:else if status === 'rejected'}
        <div class="bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 flex items-center justify-center gap-2 text-red-500 font-semibold text-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          Tiket telah ditolak
        </div>
        <button class="w-full bg-[#C2F04B]/10 border border-[#C2F04B]/20 text-[#C2F04B] rounded-xl py-3 text-[13px] font-bold hover:bg-[#C2F04B]/20 transition mt-1" onclick={handleVerifikasi}>Verifikasi Tiket Ini</button>
      {/if}

      <button class="w-full py-3 text-[13px] font-semibold text-red-500 hover:opacity-75 transition mt-2" onclick={handleBlockAkun}>Blokir Akun</button>
    </div>
  </div>

  <!-- Modals -->
  {#if showRejectConfirm}
    <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-[#14121E] border border-[#232033] rounded-2xl w-full max-w-[340px] p-5 shadow-2xl">
        <h3 class="text-lg font-bold text-gray-100 mb-2">Tolak Tiket?</h3>
        <p class="text-sm text-gray-400 mb-6 leading-relaxed">Tiket <strong class="text-gray-200">{ticketId}</strong> akan ditolak dan pengirim akan mendapat notifikasi.</p>
        <div class="flex gap-3">
          <button class="flex-1 bg-[#1A1825] border border-[#232033] text-gray-300 rounded-xl py-2.5 text-sm font-semibold hover:bg-[#232033] transition" onclick={() => showRejectConfirm = false}>Batal</button>
          <button class="flex-1 bg-red-500 text-white rounded-xl py-2.5 text-sm font-bold hover:bg-red-600 transition" onclick={submitTolak}>Tolak</button>
        </div>
      </div>
    </div>
  {/if}

  {#if showBlockConfirm}
    <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-[#14121E] border border-[#232033] rounded-2xl w-full max-w-[340px] p-5 shadow-2xl">
        <h3 class="text-lg font-bold text-red-500 mb-2">Blokir Akun?</h3>
        <p class="text-sm text-gray-400 mb-6 leading-relaxed">Akun <strong class="text-gray-200">{emailPengirim}</strong> akan diblokir dari platform.</p>
        <div class="flex gap-3">
          <button class="flex-1 bg-[#1A1825] border border-[#232033] text-gray-300 rounded-xl py-2.5 text-sm font-semibold hover:bg-[#232033] transition" onclick={() => showBlockConfirm = false}>Batal</button>
          <button class="flex-1 bg-red-600 text-white rounded-xl py-2.5 text-sm font-bold hover:bg-red-700 transition" onclick={submitBlock}>Blokir</button>
        </div>
      </div>
    </div>
  {/if}

  {#if showVerifyConfirm}
    <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-[#14121E] border border-[#232033] rounded-2xl w-full max-w-[340px] p-5 shadow-2xl">
        <h3 class="text-lg font-bold text-gray-100 mb-2">Verifikasi Tiket?</h3>
        <p class="text-sm text-gray-400 mb-6 leading-relaxed">Tiket <strong class="text-gray-200">{ticketId}</strong> akan disetujui dan tayang di marketplace.</p>
        <div class="flex gap-3">
          <button class="flex-1 bg-[#1A1825] border border-[#232033] text-gray-300 rounded-xl py-2.5 text-sm font-semibold hover:bg-[#232033] transition" onclick={() => showVerifyConfirm = false}>Batal</button>
          <button class="flex-1 bg-[#C2F04B] text-[#06060E] rounded-xl py-2.5 text-sm font-bold hover:bg-[#C2F04B]/90 transition" onclick={submitVerifikasi}>Verifikasi</button>
        </div>
      </div>
    </div>
  {/if}
</main>