<script>
  let selectedPayment = $state('gopay');
  const price = 450000;
  const serviceFee = 15000;
  const escrowFee = 5000;
  let total = $derived(price + serviceFee + escrowFee);

  const payments = [
    { id: 'gopay', name: 'GoPay', icon: 'G', color: 'bg-[#00AED6]', desc: 'Saldo: Rp 1.250.000' },
    { id: 'ovo', name: 'OVO', icon: 'O', color: 'bg-[#4C2A86]', desc: 'Saldo: Rp 800.000' },
    { id: 'bca', name: 'BCA Virtual Account', icon: 'B', color: 'bg-[#0066AE]', desc: 'Transfer bank BCA' },
    { id: 'bni', name: 'BNI Virtual Account', icon: 'N', color: 'bg-[#F15A24]', desc: 'Transfer bank BNI' },
  ];
</script>

<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-32 pt-12">
  <div class="px-4 flex items-center gap-4 mb-6">
    <a href="javascript:history.back()" class="w-10 h-10 bg-[#1A1825] rounded-full flex items-center justify-center">
      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
    </a>
    <h1 class="text-xl font-bold">Checkout</h1>
  </div>

  <div class="px-4 space-y-4">
    <div class="bg-[#14121E] p-4 rounded-2xl border border-[#232033]">
      <p class="text-[10px] text-gray-400 font-bold tracking-wider mb-3">RINGKASAN PESANAN</p>
      <div class="flex gap-3 mb-4">
        <img src="https://images.unsplash.com/photo-1540039155733-d7696d54af58?w=100&h=100&fit=crop" class="w-16 h-16 rounded-xl object-cover" alt="Event" />
        <div>
          <h3 class="font-bold text-sm mb-1">Jazz Festival 2026</h3>
          <p class="text-xs text-gray-400 mb-2">General Admission</p>
          <div class="flex items-center gap-1 text-[10px] text-gray-400">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            June 15, 2026 • 18:00 WIB
          </div>
        </div>
      </div>
      <div class="bg-[#1A1825] p-3 rounded-xl flex items-center gap-2 text-[10px] text-gray-300">
        <svg class="w-4 h-4 text-[#C7A4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
        Jakarta Convention Center, Jakarta
      </div>
    </div>

    <div class="bg-[#1A112C] p-4 rounded-2xl border border-[#3E3166]">
      <div class="flex items-center gap-2 mb-2">
        <svg class="w-5 h-5 text-[#C7A4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        <h3 class="font-bold text-sm text-[#C7A4FF]">Escrow Protection Aktif</h3>
      </div>
      <p class="text-[10px] text-[#A89EC4] leading-relaxed">
        Dana kamu ditahan oleh TixLoop dan baru diteruskan ke penjual setelah tiket berhasil kamu terima. Jika ada masalah, kamu akan mendapat 100% refund.
      </p>
    </div>

    <div>
      <p class="text-[10px] text-gray-400 font-bold tracking-wider mb-3 mt-6">METODE PEMBAYARAN</p>
      <div class="space-y-3">
        {#each payments as pay}
          <div class="p-4 rounded-2xl border transition-all {selectedPayment === pay.id ? 'bg-[#1A2000] border-[#D4FF00]' : 'bg-[#14121E] border-[#232033]'}" on:click={() => selectedPayment = pay.id}>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 {pay.color} rounded-full flex items-center justify-center font-bold text-white text-lg">
                  {pay.icon}
                </div>
                <div>
                  <p class="font-bold text-sm text-white">{pay.name}</p>
                  <p class="text-[10px] text-gray-400">{pay.desc}</p>
                </div>
              </div>
              <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center {selectedPayment === pay.id ? 'border-[#D4FF00]' : 'border-gray-500'}">
                {#if selectedPayment === pay.id}
                  <div class="w-2.5 h-2.5 bg-[#D4FF00] rounded-full"></div>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="bg-[#14121E] p-5 rounded-2xl border border-[#232033] mt-6">
      <p class="text-[10px] text-gray-400 font-bold tracking-wider mb-4">RINCIAN HARGA</p>
      <div class="space-y-3 text-sm text-gray-300 mb-4">
        <div class="flex justify-between">
          <span>Harga Tiket</span>
          <span>Rp {price.toLocaleString('id-ID')}</span>
        </div>
        <div class="flex justify-between">
          <span>Biaya Layanan</span>
          <span>Rp {serviceFee.toLocaleString('id-ID')}</span>
        </div>
        <div class="flex justify-between">
          <span>Biaya Escrow</span>
          <span>Rp {escrowFee.toLocaleString('id-ID')}</span>
        </div>
      </div>
      <div class="border-t border-[#232033] pt-4 flex justify-between items-center font-bold">
        <span class="text-white">Total</span>
        <span class="text-[#D4FF00] text-lg">Rp {total.toLocaleString('id-ID')}</span>
      </div>
    </div>
  </div>

  <div class="fixed bottom-0 w-full bg-[#0A0910] border-t border-[#232033] p-4 z-40 pb-safe">
    <div class="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 mb-3">
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
      Transaksi anda terenkripsi
    </div>
    <a href="/checkout/success" class="w-full bg-[#D4FF00] text-black font-bold py-3.5 rounded-xl flex justify-center items-center gap-2">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
      Konfirmasi Pembayaran • Rp {total.toLocaleString('id-ID')}
    </a>
  </div>
</main>
<style>
  .pb-safe { padding-bottom: env(safe-area-inset-bottom, 1rem); }
</style>