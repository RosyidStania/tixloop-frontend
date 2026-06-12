<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import api from '$lib/axios';

  let selectedReason = $state('');
  let description = $state('');
  let fileName = $state('');
  let currentPage = $state('select'); // 'select' | 'upload' | 'progress' | 'approved'

  // Simulasi progress otomatis setelah kirim
  let progressStep = $state(0); // 0=laporan diterima, 1=bukti diverifikasi, 2=investigasi, 3=diproses, 4=dikembalikan
  let systemChecks = $state([false, false, false, false]);
  let countdown = $state(3);

  let ticketId = $page.params.id;
  let ticket = $state(null);
  let isLoading = $state(true);

  onMount(async () => {
    try {
      const res = await api.get(`/tickets/${ticketId}`);
      const t = res.data.data || res.data;
      
      ticket = {
        id: t.id,
        eventName: t.event?.event_name || 'Event',
        category: t.ticket_metadata?.type || 'General Admission',
        tier: t.seat_number ? `Seat: ${t.seat_number}` : 'PREMIUM',
        totalPaid: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(t.ticket_metadata?.original_price || 0),
        date: new Date(t.event?.event_datetime).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        image: t.event?.event_poster_url || 'https://images.unsplash.com/photo-1540039155733-d7696d54af58?w=800&auto=format&fit=crop&q=80'
      };
    } catch (error) {
      console.error(error);
    } finally {
      isLoading = false;
    }
  });

  const reasons = [
    { id: 'barcode_invalid', label: 'Tiket invalid saat scan', desc: 'QR code tidak dapat dipindai di venue', icon: `<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3"/>` },
    { id: 'qr_used', label: 'QR sudah digunakan', desc: 'Tiket sudah di-scan sebelumnya', icon: `<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>` },
    { id: 'not_received', label: 'Seller tidak mengirim tiket', desc: 'Tiket belum diterima hingga hari H', icon: `<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>` },
    { id: 'category_mismatch', label: 'Tiket tidak sesuai', desc: 'Kategori/seat berbeda dari deskripsi', icon: `<path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>` },
    { id: 'event_cancelled', label: 'Event dibatalkan', desc: 'Event resmi dibatalkan oleh organizer', icon: `<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>` },
    { id: 'other', label: 'Lainnya', desc: 'Masalah lain yang perlu dilaporkan', icon: `<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>` }
  ];

  const tips = [
    'Upload foto/video bukti yang jelas',
    'Sertakan screenshot error jika ada',
    'Laporkan segera saat masalah terjadi',
    'Chat dengan venue staff jika diminta'
  ];

  const nextSteps = [
    { num: 1, title: 'Validasi Otomatis', desc: 'Sistem akan cek QR, venue logs, dan seller history' },
    { num: 2, title: 'Escrow Ditahan', desc: 'Dana tidak akan masuk ke seller selama investigasi' },
    { num: 3, title: 'Keputusan Refund', desc: 'Proses 1–24 jam, refund langsung jika terbukti fraud' }
  ];

  const timelineSteps = [
    { label: 'Laporan diterima', desc: 'Sistem menerima laporan Anda', time: '2 menit lalu' },
    { label: 'Bukti diverifikasi', desc: 'Foto dan Video sedang dianalisis', time: '1 menit lalu' },
    { label: 'Investigasi transaksi', desc: 'Memeriksa QR code, venue logs, dan seller history\nSedang berlangsung', time: '' },
    { label: 'Refund diproses', desc: 'Menunggu keputusan final', time: '' },
    { label: 'Dana dikembalikan', desc: 'Refund masuk ke rekening Anda', time: '' }
  ];

  const systemCheckLabels = [
    'QR code validity check',
    'Venue check-in logs verification',
    'Seller fraud history analysis',
    'Transaction pattern matching'
  ];

  const verificationResults = [
    'QR code terbukti sudah digunakan sebelumnya',
    'Venue logs menunjukkan duplikasi scan',
    'Seller memiliki riwayat komplain serupa'
  ];

  function selectReason(reason) {
    selectedReason = reason.id;
    currentPage = 'upload';
  }

  function goBack() {
    if (currentPage === 'upload') {
      currentPage = 'select';
      fileName = '';
      description = '';
    }
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) fileName = file.name;
  }

  function submitReport() {
    currentPage = 'progress';
    startProgressSimulation();
  }

  function startProgressSimulation() {
    // Countdown
    let cdInterval = setInterval(() => {
      countdown -= 1;
      if (countdown <= 0) clearInterval(cdInterval);
    }, 1000);

    // System checks satu per satu
    [0, 1, 2, 3].forEach((i) => {
      setTimeout(() => {
        systemChecks[i] = true;
        systemChecks = [...systemChecks];
      }, 1500 + i * 1200);
    });

    // Timeline steps
    setTimeout(() => { progressStep = 1; }, 2000);
    setTimeout(() => { progressStep = 2; }, 4000);
    setTimeout(() => { progressStep = 3; }, 6500);
    setTimeout(() => { progressStep = 4; }, 9000);

    // Approved
    setTimeout(() => {
      currentPage = 'approved';
    }, 11000);
  }
</script>

{#if isLoading}
  <div class="flex justify-center items-center min-h-screen bg-[#0A0910]">
    <div class="w-8 h-8 border-4 border-[#D4FF00] border-t-transparent rounded-full animate-spin"></div>
  </div>
{:else if ticket}

<!-- ══════════════════ HALAMAN 1: PILIH MASALAH ══════════════════ -->
{#if currentPage === 'select'}
<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-10">
  <div class="px-4 pt-12 pb-4 flex items-center gap-3 sticky top-0 bg-[#0A0910]/95 backdrop-blur z-50 border-b border-[#1A1825]">
    <a href="javascript:history.back()" class="w-10 h-10 bg-[#1A1825] rounded-full flex items-center justify-center active:scale-95 transition-transform">
      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
    </a>
    <div>
      <h1 class="text-base font-bold">Ajukan Refund</h1>
      <p class="text-[11px] text-gray-500">Dana Anda dilindungi escrow</p>
    </div>
  </div>

  <div class="px-4 pt-4 space-y-5">
    <div class="bg-[#0F1A10] border border-[#1E3320] rounded-2xl p-4 flex items-start gap-3">
      <span class="text-base mt-0.5">🛡</span>
      <div>
        <p class="text-sm font-bold text-green-400 mb-0.5">💚 Dana Masih Diamankan Escrow</p>
        <p class="text-[11px] text-gray-400 leading-relaxed">Seller belum menerima pembayaran. Jika tiket terbukti invalid, refund otomatis diproses ke rekening Anda.</p>
      </div>
    </div>

    <div class="bg-[#14121E] rounded-2xl p-3 border border-[#232033] flex items-center gap-3">
      <img src={ticket.image} alt="Event" class="w-14 h-14 rounded-xl object-cover shrink-0" />
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2">
          <h4 class="font-bold text-sm text-white">{ticket.eventName}</h4>
          <div class="text-right shrink-0">
            <p class="text-[9px] text-gray-500">Total Paid</p>
            <p class="text-sm font-bold text-white">{ticket.totalPaid}</p>
          </div>
        </div>
        <p class="text-[11px] text-gray-400 mt-0.5">{ticket.category}</p>
        <div class="flex items-center gap-2 mt-1.5">
          <span class="text-[9px] font-bold bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/30">{ticket.tier}</span>
          <span class="text-[9px] text-gray-600 font-mono">{ticket.id}</span>
        </div>
      </div>
    </div>

    <div>
      <div class="flex items-center gap-2 mb-1">
        <span class="text-yellow-400">⚠</span>
        <h2 class="text-base font-bold">Pilih Jenis Masalah</h2>
      </div>
      <p class="text-[11px] text-gray-500 mb-4">Pilih kategori yang sesuai dengan masalah yang Anda alami</p>
      <div class="space-y-2">
        {#each reasons as reason}
          <button class="w-full bg-[#14121E] border border-[#232033] rounded-2xl p-4 flex items-center gap-3 text-left active:scale-[0.98] transition-all hover:border-[#3a3350]" onclick={() => selectReason(reason)}>
            <div class="w-10 h-10 rounded-xl bg-[#1E1C2E] flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{@html reason.icon}</svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-white">{reason.label}</p>
              <p class="text-[11px] text-gray-500 mt-0.5">{reason.desc}</p>
            </div>
            <svg class="w-4 h-4 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>
        {/each}
      </div>
    </div>

    <div class="bg-[#13120E] border border-[#2A2510] rounded-2xl p-4">
      <p class="text-sm font-bold text-yellow-400 mb-3">💡 Tips Agar Refund Cepat Diproses</p>
      <ul class="space-y-1.5">
        {#each tips as tip}
          <li class="flex items-start gap-2">
            <span class="text-yellow-500 text-xs mt-0.5">•</span>
            <span class="text-[12px] text-gray-400">{tip}</span>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</main>
{/if}

<!-- ══════════════════ HALAMAN 2: UPLOAD BUKTI ══════════════════ -->
{#if currentPage === 'upload'}
<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-36">
  <div class="px-4 pt-12 pb-4 flex items-center gap-3 sticky top-0 bg-[#0A0910]/95 backdrop-blur z-50 border-b border-[#1A1825]">
    <button onclick={goBack} class="w-10 h-10 bg-[#1A1825] rounded-full flex items-center justify-center active:scale-95 transition-transform">
      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
    </button>
    <div>
      <h1 class="text-base font-bold">Upload Bukti</h1>
      <p class="text-[11px] text-gray-500">{reasons.find(r => r.id === selectedReason)?.label ?? ''}</p>
    </div>
  </div>

  <div class="px-4 pt-5 space-y-5">
    <div class="bg-[#14121E] border border-[#232033] rounded-2xl p-4">
      <p class="text-sm font-bold mb-4">Upload Foto/Video Bukti</p>
      <div class="grid grid-cols-2 gap-3">
        <label class="bg-[#1A1825] border border-[#2a2840] rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform hover:border-[#AAEF45]/40">
          <input type="file" accept="image/*" capture="environment" class="hidden" onchange={handleFileUpload} />
          <div class="w-10 h-10 rounded-xl bg-[#AAEF45]/10 border border-[#AAEF45]/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-[#AAEF45]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
          <span class="text-xs font-semibold text-white">Ambil Foto</span>
        </label>
        <label class="bg-[#1A1825] border border-[#2a2840] rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform hover:border-[#AAEF45]/40">
          <input type="file" accept="image/*,video/*" class="hidden" onchange={handleFileUpload} />
          <div class="w-10 h-10 rounded-xl bg-[#AAEF45]/10 border border-[#AAEF45]/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-[#AAEF45]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
          </div>
          <span class="text-xs font-semibold text-white">Upload File</span>
        </label>
      </div>
      {#if fileName}
        <div class="mt-3 bg-[#0F1A10] border border-[#1E3320] rounded-xl px-3 py-2 flex items-center gap-2">
          <svg class="w-4 h-4 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span class="text-[11px] text-green-400 truncate">{fileName}</span>
        </div>
      {/if}
      <p class="text-[10px] text-gray-600 mt-3">Format: JPG, PNG, MP4. Max 10MB per file</p>
    </div>

    <div class="bg-[#14121E] border border-[#232033] rounded-2xl p-4">
      <p class="text-sm font-bold mb-3">Jelaskan Kronologi Kejadian</p>
      <textarea bind:value={description} rows="4" placeholder="Contoh: Saya sudah sampai di venue pukul 18.00, tapi saat scan QR di gate, muncul error 'Ticket Already Used'. Padahal saya baru pertama kali scan..." class="w-full bg-[#1A1825] border border-[#232033] rounded-xl p-3 text-sm text-white outline-none focus:border-[#AAEF45]/50 transition-colors resize-none placeholder-gray-600 leading-relaxed"></textarea>
      <p class="text-[10px] text-gray-600 mt-2">Jelaskan detail waktu, lokasi, dan apa yang terjadi</p>
    </div>

    <div class="bg-[#14121E] border border-[#232033] rounded-2xl p-4">
      <div class="flex items-center gap-2 mb-4">
        <div class="w-1 h-4 bg-[#AAEF45] rounded-full"></div>
        <p class="text-sm font-bold">Yang Akan Terjadi Selanjutnya</p>
      </div>
      <div class="space-y-4">
        {#each nextSteps as step}
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-[#AAEF45] flex items-center justify-center shrink-0 mt-0.5">
              <span class="text-[10px] font-black text-[#0A0910]">{step.num}</span>
            </div>
            <div>
              <p class="text-sm font-semibold text-white">{step.title}</p>
              <p class="text-[11px] text-gray-500 mt-0.5">{step.desc}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</main>

<div class="fixed bottom-0 w-full bg-[#0A0910]/95 backdrop-blur-md border-t border-[#1A1825] px-4 pt-3 pb-[env(safe-area-inset-bottom,1rem)] z-50 space-y-2">
  <button onclick={submitReport} class="w-full bg-[#AAEF45] text-[#0A0910] text-sm font-black py-3.5 rounded-xl flex items-center justify-center shadow-[0_4px_20px_rgba(170,239,69,0.25)] active:scale-95 transition-transform">
    Kirim Laporan
  </button>
  <p class="text-[10px] text-gray-600 text-center pb-1">Dengan mengirim laporan, Anda menyetujui bahwa informasi yang diberikan adalah benar</p>
</div>
{/if}

<!-- ══════════════════ HALAMAN 3: PROGRESS STATUS ══════════════════ -->
{#if currentPage === 'progress'}
<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-10">
  <div class="px-4 pt-12 pb-4 flex items-center justify-center sticky top-0 bg-[#0A0910]/95 backdrop-blur z-50 border-b border-[#1A1825]">
    <div class="text-center">
      <h1 class="text-base font-bold">Status Refund</h1>
      <p class="text-[11px] text-gray-500 font-mono">{ticket.id}</p>
    </div>
  </div>

  <div class="px-4 pt-4 space-y-4">

    <!-- Status aktif -->
    <div class="bg-gradient-to-br from-[#0F1A10] to-[#0A1508] border border-[#1E3320] rounded-2xl p-4">
      <div class="flex items-start gap-3 mb-4">
        <div class="w-9 h-9 rounded-full bg-[#AAEF45]/20 border border-[#AAEF45]/30 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
          <div class="w-3 h-3 rounded-full bg-[#AAEF45]"></div>
        </div>
        <div>
          <p class="text-sm font-bold text-[#AAEF45]">Validasi Otomatis Berjalan</p>
          <p class="text-[11px] text-gray-400 mt-0.5 leading-relaxed">Sistem sedang menganalisis QR code, venue check-in logs, dan riwayat seller. Proses ini biasanya memakan waktu 1–5 menit.</p>
        </div>
      </div>
      <!-- Progress bar -->
      <div class="w-full bg-[#1A2510] rounded-full h-1.5 overflow-hidden">
        <div class="h-full bg-[#AAEF45] rounded-full transition-[width] duration-1000 ease-in-out" style="width: {Math.min((progressStep / 4) * 100, 75)}%"></div>
      </div>
      <p class="text-[10px] text-gray-500 mt-2">Estimasi selesai: {countdown > 0 ? `${countdown} menit lagi` : 'Sebentar lagi...'}</p>
    </div>

    <!-- Escrow info -->
    <div class="bg-[#14121E] border border-[#232033] rounded-2xl p-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <svg class="w-5 h-5 text-[#AAEF45]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
        <div>
          <p class="text-sm font-semibold text-white">Dana Aman di Escrow</p>
          <p class="text-[11px] text-gray-500">{ticket.totalPaid} masih dalam sistem</p>
        </div>
      </div>
      <div class="w-2 h-2 rounded-full bg-[#AAEF45] animate-pulse"></div>
    </div>

    <!-- Timeline -->
    <div>
      <p class="text-sm font-bold mb-4">Progress Timeline</p>
      <div class="space-y-0">
        {#each timelineSteps as step, i}
          <div class="flex gap-3">
            <!-- Icon & line -->
            <div class="flex flex-col items-center">
              <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-500
                {i < progressStep ? 'bg-[#AAEF45] border-[#AAEF45]' : i === progressStep ? 'bg-[#AAEF45]/20 border-[#AAEF45] animate-pulse' : 'bg-[#1A1825] border-[#2a2840]'}">
                {#if i < progressStep}
                  <svg class="w-3.5 h-3.5 text-[#0A0910]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                {:else if i === progressStep}
                  <div class="w-2 h-2 rounded-full bg-[#AAEF45]"></div>
                {:else}
                  <div class="w-2 h-2 rounded-full bg-[#3a3850]"/>
                {/if}
              </div>
              {#if i < timelineSteps.length - 1}
                <div class="w-0.5 h-10 mt-1 transition-all duration-700 {i < progressStep ? 'bg-[#AAEF45]' : 'bg-[#2a2840]'}"></div>
              {/if}
            </div>
            <!-- Text -->
            <div class="pb-6">
              <p class="text-sm font-semibold {i <= progressStep ? 'text-white' : 'text-gray-600'} transition-colors duration-500">{step.label}</p>
              <p class="text-[11px] {i <= progressStep ? 'text-gray-400' : 'text-gray-700'} mt-0.5 whitespace-pre-line transition-colors duration-500">{step.desc}</p>
              {#if step.time && i < progressStep}
                <p class="text-[10px] text-[#AAEF45] mt-1">{step.time}</p>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Yang sedang dicek sistem -->
    <div class="bg-[#14121E] border border-[#232033] rounded-2xl p-4">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-base">🔍</span>
        <p class="text-sm font-bold">Yang Sedang Dicek Sistem</p>
      </div>
      <div class="space-y-2.5">
        {#each systemCheckLabels as label, i}
          <div class="flex items-center gap-2.5">
            {#if systemChecks[i]}
              <svg class="w-4 h-4 text-[#AAEF45] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {:else}
              <div class="w-4 h-4 rounded-full border-2 border-[#3a3850] shrink-0 {i === systemChecks.filter(Boolean).length ? 'border-[#AAEF45] animate-spin border-t-transparent' : ''}"></div>
            {/if}
            <span class="text-[12px] {systemChecks[i] ? 'text-white' : i === systemChecks.filter(Boolean).length ? 'text-[#AAEF45]' : 'text-gray-600'} transition-colors duration-300">{label}</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Butuh Klarifikasi -->
    <div class="bg-[#14121E] border border-[#232033] rounded-2xl p-4">
      <div class="flex items-center gap-2 mb-2">
        <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
        <p class="text-sm font-bold">Butuh Klarifikasi?</p>
      </div>
      <p class="text-[11px] text-gray-400 mb-3 leading-relaxed">Jika kami memerlukan informasi tambahan, tim akan menghubungi Anda via chat atau...</p>
      <button class="border border-[#AAEF45]/40 text-[#AAEF45] text-xs font-bold px-4 py-2 rounded-xl active:scale-95 transition-transform">
        Chat dengan Support
      </button>
    </div>

    <p class="text-[11px] text-gray-600 text-center pb-4">Anda akan menerima notifikasi push & email saat ada update status refund</p>
  </div>
</main>
{/if}

<!-- ══════════════════ HALAMAN 4: APPROVED ══════════════════ -->
{#if currentPage === 'approved'}
<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-36">
  <div class="px-4 pt-16 pb-6 flex flex-col items-center text-center">
    <!-- Icon centang besar -->
    <div class="relative mb-4">
      <div class="w-24 h-24 rounded-full bg-[#AAEF45]/10 border-2 border-[#AAEF45]/30 flex items-center justify-center animate-bounce-in">
        <div class="w-16 h-16 rounded-full bg-[#AAEF45]/20 border-2 border-[#AAEF45] flex items-center justify-center">
          <svg class="w-8 h-8 text-[#AAEF45]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
        </div>
      </div>
      <!-- Ring animasi -->
      <div class="absolute inset-0 rounded-full border-2 border-[#AAEF45]/20 animate-ring-pulse"></div>
    </div>
    <h1 class="text-2xl font-black text-white mb-1">✅ Refund Approved</h1>
    <p class="text-[13px] text-gray-400">Dana akan dikembalikan ke rekening Anda</p>
  </div>

  <div class="px-4 space-y-4">
    <!-- Detail refund -->
    <div class="bg-[#14121E] border border-[#232033] rounded-2xl p-4 space-y-3">
      <div class="flex justify-between items-center">
        <span class="text-[12px] text-gray-500">Jumlah Refund</span>
        <span class="text-xl font-black text-white">{ticket.totalPaid}</span>
      </div>
      <div class="w-full h-px bg-[#232033]"></div>
      <div class="flex justify-between items-center">
        <span class="text-[12px] text-gray-500">Metode Pembayaran</span>
        <span class="text-[12px] text-white font-semibold">GoPay ••••8841</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-[12px] text-gray-500">Estimasi Sampai</span>
        <span class="text-[12px] text-white font-semibold">1-2 jam</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-[12px] text-gray-500">Status</span>
        <span class="text-[10px] font-black bg-[#AAEF45]/20 text-[#AAEF45] px-3 py-1 rounded-full border border-[#AAEF45]/30">PROCESSING</span>
      </div>
    </div>

    <!-- Hasil verifikasi -->
    <div class="bg-[#14121E] border border-[#232033] rounded-2xl p-4">
      <div class="flex items-center gap-2 mb-3">
        <span>🔎</span>
        <p class="text-sm font-bold">Hasil Verifikasi</p>
      </div>
      <div class="space-y-2 mb-4">
        {#each verificationResults as result}
          <div class="flex items-start gap-2">
            <svg class="w-4 h-4 text-[#AAEF45] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span class="text-[12px] text-gray-300">{result}</span>
          </div>
        {/each}
      </div>
      <div class="bg-[#0F1A10] border border-[#1E3320] rounded-xl p-3">
        <p class="text-[11px] text-gray-300 leading-relaxed"><span class="text-white font-semibold">Kesimpulan:</span> Berdasarkan bukti yang Anda upload dan cross-check dengan sistem venue, tiket terbukti invalid. Tiket telah dilaporkan dan diblokir dari platform.</p>
      </div>
    </div>

    <!-- Case ID -->
    <div class="bg-[#14121E] border border-[#232033] rounded-2xl p-4 flex items-center justify-between">
      <div>
        <p class="text-[10px] text-gray-500 mb-0.5">Case ID</p>
        <p class="text-sm font-bold font-mono text-white">REF-{ticket.id.slice(0,8)}</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="w-8 h-8 bg-[#1A1825] rounded-lg flex items-center justify-center active:scale-95 transition-transform">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
        </button>
        <button class="w-8 h-8 bg-[#1A1825] rounded-lg flex items-center justify-center active:scale-95 transition-transform">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
        </button>
      </div>
    </div>

    <!-- Buyer protection -->
    <div class="bg-[#0F1A10] border border-[#1E3320] rounded-2xl p-4 flex items-start gap-3">
      <svg class="w-5 h-5 text-[#AAEF45] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
      <div>
        <p class="text-sm font-bold text-[#AAEF45] mb-0.5">TixLoop Buyer Protection</p>
        <p class="text-[11px] text-gray-400 leading-relaxed">Semua transaksi di TixLoop dilindungi sistem escrow. Dana Anda selalu aman sampai tiket terbukti valid.</p>
      </div>
    </div>
  </div>
</main>

<!-- Bottom bar approved -->
<div class="fixed bottom-0 w-full bg-[#0A0910]/95 backdrop-blur-md border-t border-[#1A1825] px-4 pt-3 pb-[env(safe-area-inset-bottom,1rem)] z-50 space-y-2">
  <button onclick={() => currentPage = 'select'} class="w-full bg-[#AAEF45] text-[#0A0910] text-sm font-black py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(170,239,69,0.25)] active:scale-95 transition-transform">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
    Kembali ke My Tickets
  </button>
  <button class="w-full bg-[#1A1825] text-gray-300 text-sm font-semibold py-3.5 rounded-xl flex items-center justify-center active:scale-95 transition-transform">
    Hubungi Customer Service
  </button>
</div>
{/if}
{/if}

