<script>
  import api from '$lib/axios';

  let fullName = $state('');
  let email = $state('');
  let phone = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let referral = $state('');
  let agreed = $state(false);
  let showPassword = $state(false);
  let showConfirmPassword = $state(false);
  let isLoading = $state(false);
  let errorMessage = $state('');
  let validationErrors = $state({});

  async function handleSubmit() {
    if (!agreed) return;
    isLoading = true;
    errorMessage = '';
    validationErrors = {};
    
    try {
      const response = await api.post('/auth/register', { 
        name: fullName, 
        email, 
        phone, 
        password, 
        password_confirmation: confirmPassword 
      });

      const data = response.data;

      localStorage.setItem('token', data.data.access_token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      window.location.href = '/'; // Langsung masuk home jika berhasil daftar & login
    } catch (error) {
      console.error(error);
      if (error.response?.status === 422) {
        const rawErrors = error.response.data.errors || {};
        validationErrors = {};
        for (const key in rawErrors) {
          const msg = rawErrors[key][0].toLowerCase();
          let idMsg = 'Input tidak valid.';
          if (msg.includes('taken')) idMsg = 'Sudah terdaftar, gunakan yang lain.';
          else if (msg.includes('required')) idMsg = 'Bagian ini wajib diisi.';
          else if (msg.includes('characters')) idMsg = 'Minimal harus 8 karakter.';
          else if (msg.includes('confirmed') || msg.includes('match')) idMsg = 'Konfirmasi password tidak cocok.';
          else if (msg.includes('email')) idMsg = 'Format email tidak benar.';
          validationErrors[key] = [idMsg];
        }
        errorMessage = 'Mohon periksa kembali form yang ditandai merah.';
      } else {
        errorMessage = 'Pendaftaran gagal, sistem sedang bermasalah. Silakan coba lagi nanti.';
      }
    } finally {
      isLoading = false;
    }
  }

  let canSubmit = $derived(fullName && email && phone && password && confirmPassword && agreed);
</script>

<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-10">
  <div class="px-4 pt-12 pb-4 flex items-center gap-3 border-b border-[#1A1825]">
    <button onclick={() => history.back()} aria-label="Kembali" class="w-9 h-9 bg-[#1A1825] rounded-full flex items-center justify-center active:scale-95 transition-transform">
      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
    </button>
    <div>
      <h1 class="text-base font-bold leading-tight">Daftar Akun</h1>
      <p class="text-[11px] text-[#AAEF45]">Buat akun TixLoop baru</p>
    </div>
  </div>

  <div class="px-4 pt-5 space-y-4">


    <div class="space-y-3">
      <div>
        <label for="fullName" class="block text-[11px] font-semibold text-gray-400 mb-1.5">Nama Lengkap</label>
        <input id="fullName" bind:value={fullName} type="text" placeholder="Masukkan nama lengkap" class="w-full bg-[#14121E] border border-[#232033] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-[#AAEF45]/60 transition-colors autofill:shadow-[inset_0_0_0_1000px_#14121E] autofill:[-webkit-text-fill-color:white] {validationErrors.name ? 'border-red-500/60' : ''}" />
        {#if validationErrors.name}
          <p class="text-[10px] text-red-400 mt-1">{validationErrors.name[0]}</p>
        {/if}
      </div>

      <div>
        <label for="email" class="block text-[11px] font-semibold text-gray-400 mb-1.5">Email</label>
        <input id="email" bind:value={email} type="email" placeholder="contoh@email.com" class="w-full bg-[#14121E] border border-[#232033] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-[#AAEF45]/60 transition-colors autofill:shadow-[inset_0_0_0_1000px_#14121E] autofill:[-webkit-text-fill-color:white] {validationErrors.email ? 'border-red-500/60' : ''}" />
        {#if validationErrors.email}
          <p class="text-[10px] text-red-400 mt-1">{validationErrors.email[0]}</p>
        {/if}
      </div>

      <div>
        <label for="phone" class="block text-[11px] font-semibold text-gray-400 mb-1.5">Nomor HP</label>
        <input id="phone" bind:value={phone} type="tel" placeholder="08123456789" class="w-full bg-[#14121E] border border-[#232033] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-[#AAEF45]/60 transition-colors autofill:shadow-[inset_0_0_0_1000px_#14121E] autofill:[-webkit-text-fill-color:white] {validationErrors.phone ? 'border-red-500/60' : ''}" />
        {#if validationErrors.phone}
          <p class="text-[10px] text-red-400 mt-1">{validationErrors.phone[0]}</p>
        {/if}
      </div>

      <div>
        <label for="password" class="block text-[11px] font-semibold text-gray-400 mb-1.5">Password</label>
        <div class="relative">
          <input id="password" bind:value={password} type={showPassword ? 'text' : 'password'} placeholder="Minimal 6 karakter" class="w-full bg-[#14121E] border border-[#232033] rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-gray-600 outline-none focus:border-[#AAEF45]/60 transition-colors autofill:shadow-[inset_0_0_0_1000px_#14121E] autofill:[-webkit-text-fill-color:white] {validationErrors.password ? 'border-red-500/60' : ''}" />
          <button aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"} onclick={() => showPassword = !showPassword} class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-300">
            {#if showPassword}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
            {:else}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            {/if}
          </button>
        </div>
        {#if validationErrors.password}
          <p class="text-[10px] text-red-400 mt-1">{validationErrors.password[0]}</p>
        {/if}
      </div>

      <div>
        <label for="confirmPassword" class="block text-[11px] font-semibold text-gray-400 mb-1.5">Konfirmasi Password</label>
        <div class="relative">
          <input id="confirmPassword" bind:value={confirmPassword} type={showConfirmPassword ? 'text' : 'password'} placeholder="Ketik ulang password" class="w-full bg-[#14121E] border border-[#232033] rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-gray-600 outline-none focus:border-[#AAEF45]/60 transition-colors autofill:shadow-[inset_0_0_0_1000px_#14121E] autofill:[-webkit-text-fill-color:white] {confirmPassword && confirmPassword !== password ? 'border-red-500/60' : ''}" />
          <button aria-label={showConfirmPassword ? "Sembunyikan konfirmasi password" : "Tampilkan konfirmasi password"} onclick={() => showConfirmPassword = !showConfirmPassword} class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-300">
            {#if showConfirmPassword}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
            {:else}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            {/if}
          </button>
        </div>
        {#if confirmPassword && confirmPassword !== password}
          <p class="text-[10px] text-red-400 mt-1">Password tidak cocok</p>
        {/if}
      </div>

      <div>
        <label for="referral" class="block text-[11px] font-semibold text-gray-400 mb-1.5">Kode Referral <span class="text-gray-600">(Opsional)</span></label>
        <input id="referral" bind:value={referral} type="text" placeholder="Masukkan kode referral" class="w-full bg-[#14121E] border border-[#232033] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-[#AAEF45]/60 transition-colors autofill:shadow-[inset_0_0_0_1000px_#14121E] autofill:[-webkit-text-fill-color:white]" />
      </div>
    </div>

    <button onclick={() => agreed = !agreed} class="flex items-start gap-3 text-left w-full">
      <div class="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all {agreed ? 'bg-[#AAEF45] border-[#AAEF45]' : 'border-[#3a3850] bg-[#14121E]'}">
        {#if agreed}
          <svg class="w-3 h-3 text-[#0A0910]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
        {/if}
      </div>
      <p class="text-[12px] text-gray-400 leading-relaxed">
        Saya menyetujui <span class="text-[#AAEF45] font-semibold">Syarat & Ketentuan</span> dan <span class="text-[#AAEF45] font-semibold">Kebijakan Privasi TixLoop</span>
      </p>
    </button>

    {#if errorMessage}
      <div class="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-semibold px-3 py-2 rounded-lg text-center">
        {errorMessage}
      </div>
    {/if}

    <button onclick={handleSubmit} disabled={!canSubmit || isLoading} class="w-full py-3.5 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_4px_20px_rgba(170,239,69,0.2)] {canSubmit && !isLoading ? 'bg-[#AAEF45] text-[#0A0910]' : 'bg-[#AAEF45]/30 text-[#0A0910]/50 cursor-not-allowed'}">
      {#if isLoading}
        <div class="w-4 h-4 border-2 border-[#0A0910]/30 border-t-[#0A0910] rounded-full animate-spin"></div> Membuat Akun...
      {:else}
        Buat Akun
      {/if}
    </button>

    <div class="flex items-center gap-3 py-2">
      <div class="flex-1 h-px bg-[#232033]"></div>
      <span class="text-[11px] text-gray-600">atau daftar dengan</span>
      <div class="flex-1 h-px bg-[#232033]"></div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <button class="bg-[#14121E] border border-[#232033] rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-semibold active:scale-95 transition-transform hover:border-[#3a3850]">
        <svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Google
      </button>
      <button class="bg-[#14121E] border border-[#232033] rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-semibold active:scale-95 transition-transform hover:border-[#3a3850]">
        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
        Apple
      </button>
    </div>

    <div class="bg-[#13120E] border border-[#2A2510] rounded-xl p-3 flex items-start gap-2">
      <span class="text-yellow-400 shrink-0">ⓘ</span>
      <p class="text-[11px] text-gray-400 leading-relaxed"><span class="text-yellow-400 font-semibold">KYC hanya diperlukan</span> untuk transaksi & penjualan tertentu. Kamu bisa mulai browsing tiket sekarang!</p>
    </div>

    <p class="text-center text-[12px] text-gray-500 pb-4">
      Sudah punya akun? <a href="/login" class="text-[#AAEF45] font-bold">Masuk</a>
    </p>

  </div>
</main>

