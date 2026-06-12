<script>
  import api from '$lib/axios';

  let email = $state('');
  let password = $state('');
  let showPassword = $state(false);
  let rememberMe = $state(false);
  let isLoading = $state(false);
  let errorMessage = $state('');

  async function handleLogin() {
    if (!email || !password) return;
    isLoading = true;
    errorMessage = '';
    
    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data;

      localStorage.setItem('token', data.data.access_token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      
      if (data.data.user.email === 'admin@tixloop.com') {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/'; // Pindah ke Home
      }
    } catch (error) {
      console.error(error);
      errorMessage = 'Email/Password yang Anda masukkan salah.';
    } finally {
      isLoading = false;
    }
  }

  let canLogin = $derived(email && password);
</script>

<main class="bg-[#0A0910] min-h-screen text-white font-sans flex flex-col">
  <div class="px-4 pt-12 pb-4 flex items-center gap-3 border-b border-[#1A1825]">
    <div>
      <h1 class="text-base font-bold leading-tight">Masuk</h1>
      <p class="text-[11px] text-[#AAEF45]">Selamat datang kembali</p>
    </div>
  </div>

  <div class="flex-1 px-4 pt-8 pb-10 space-y-5">
    <div class="flex flex-col items-center pb-2">
      <div class="w-14 h-14 rounded-2xl bg-[#AAEF45]/10 border border-[#AAEF45]/20 flex items-center justify-center mb-3">
        <svg class="w-7 h-7 text-[#AAEF45]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
      </div>
      <h2 class="text-xl font-black text-white">TixLoop</h2>
      <p class="text-[11px] text-gray-500 mt-0.5">Marketplace tiket terpercaya</p>
    </div>



    <div class="space-y-3">
      <div>
        <label for="email" class="block text-[11px] font-semibold text-gray-400 mb-1.5">Email</label>
        <input id="email" bind:value={email} type="email" placeholder="contoh@email.com" class="w-full bg-[#14121E] border border-[#232033] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-[#AAEF45]/60 transition-colors autofill:shadow-[inset_0_0_0_1000px_#14121E] autofill:[-webkit-text-fill-color:white]" />
      </div>

      <div>
        <div class="flex items-center justify-between mb-1.5">
          <label for="password" class="text-[11px] font-semibold text-gray-400">Password</label>
          <a href="/forgot-password" class="text-[11px] text-[#AAEF45] font-semibold">Lupa password?</a>
        </div>
        <div class="relative">
          <input id="password" bind:value={password} type={showPassword ? 'text' : 'password'} placeholder="Masukkan password" class="w-full bg-[#14121E] border border-[#232033] rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-gray-600 outline-none focus:border-[#AAEF45]/60 transition-colors autofill:shadow-[inset_0_0_0_1000px_#14121E] autofill:[-webkit-text-fill-color:white]" />
          <button aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"} onclick={() => showPassword = !showPassword} class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-300">
            {#if showPassword}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
            {:else}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            {/if}
          </button>
        </div>
      </div>
    </div>

    {#if errorMessage}
      <div class="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-semibold px-3 py-2 rounded-lg text-center">
        {errorMessage}
      </div>
    {/if}

    <button onclick={() => rememberMe = !rememberMe} class="flex items-center gap-3 w-full">
      <div class="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all {rememberMe ? 'bg-[#AAEF45] border-[#AAEF45]' : 'border-[#3a3850] bg-[#14121E]'}">
        {#if rememberMe}
          <svg class="w-3 h-3 text-[#0A0910]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
        {/if}
      </div>
      <span class="text-[12px] text-gray-400">Ingat saya di perangkat ini</span>
    </button>

    <button onclick={handleLogin} disabled={!canLogin || isLoading} class="w-full py-3.5 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_4px_20px_rgba(170,239,69,0.2)] {canLogin && !isLoading ? 'bg-[#AAEF45] text-[#0A0910]' : 'bg-[#AAEF45]/30 text-[#0A0910]/50 cursor-not-allowed'}">
      {#if isLoading}
        <div class="w-4 h-4 border-2 border-[#0A0910]/30 border-t-[#0A0910] rounded-full animate-spin"></div> Masuk...
      {:else}
        Masuk
      {/if}
    </button>

    <div class="flex items-center gap-3">
      <div class="flex-1 h-px bg-[#232033]"></div>
      <span class="text-[11px] text-gray-600">atau masuk dengan</span>
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

    <a href="/" class="w-full py-3.5 rounded-xl text-sm font-semibold bg-[#14121E] border border-[#232033] text-gray-300 flex items-center justify-center gap-2 active:scale-95 transition-transform hover:border-[#3a3850]">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
      Lanjut sebagai Tamu
    </a>

    <p class="text-center text-[12px] text-gray-500">
      Belum punya akun? <a href="/register" class="text-[#AAEF45] font-bold">Daftar Sekarang</a>
    </p>
  </div>
</main>

