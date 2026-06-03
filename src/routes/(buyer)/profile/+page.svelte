<script>
import BottomNav from '$lib/components/buyer/layout/BottomNav.svelte';
  const user = {
    name: 'Andi Prasetyo',
    email: 'andi.prasetyo@email.com',
    joined: 'Bergabung sejak Jan 2024',
    avatar: 'A',
    verified: true
  };

  const verifikasi = [
    { id: 'email', label: 'Email', icon: `<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>`, status: 'verified' },
    { id: 'phone', label: 'Nomor Telepon', icon: `<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.86-.86a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.5v2.42z"/>`, status: 'verified' },
    { id: 'kyc', label: 'KYC', icon: `<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>`, status: 'unverified' }
  ];

  const pengaturan = [
    { id: 'payment', label: 'Metode Pembayaran', badge: '3', color: 'text-green-400', bg: 'bg-green-400/10', icon: `<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>` },
    { id: 'notif', label: 'Notifikasi', badge: null, color: 'text-orange-400', bg: 'bg-orange-400/10', icon: `<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>` },
    { id: 'security', label: 'Keamanan & Privasi', badge: null, color: 'text-red-400', bg: 'bg-red-400/10', icon: `<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>` },
    { id: 'language', label: 'Bahasa & Region', badge: null, color: 'text-purple-400', bg: 'bg-purple-400/10', icon: `<path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>` }
  ];

  const bantuan = [
    { id: 'help', label: 'Pusat Bantuan', icon: `<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>` },
    { id: 'terms', label: 'Syarat & Ketentuan', icon: `<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>` },
    { id: 'privacy', label: 'Kebijakan Privasi', icon: `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>` }
  ];

  import api from '$lib/axios';

  let showLogoutConfirm = $state(false);
  let isLoggingOut = $state(false);

  async function handleLogout() {
    if (isLoggingOut) return;
    isLoggingOut = true;
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      isLoggingOut = false;
      showLogoutConfirm = false;
      window.location.href = '/login';
    }
  }
</script>
    <BottomNav activeTab="profile" />
<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-24">

  <!-- Header -->
  <div class="px-4 pt-12 pb-3 flex items-center justify-between">
    <h1 class="text-xl font-black">Profile</h1>
    <button class="w-9 h-9 bg-[#1A1825] rounded-full flex items-center justify-center relative active:scale-95 transition-transform">
      <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
      </svg>
      <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-[#AAEF45] rounded-full border border-[#0A0910]"></span>
    </button>
  </div>

  <div class="px-4 space-y-5">

    <!-- User card -->
    <div class="bg-[#14121E] border border-[#232033] rounded-2xl p-4 flex items-center gap-3">
      <div class="w-14 h-14 rounded-2xl bg-[#AAEF45] flex items-center justify-center shrink-0">
        <span class="text-2xl font-black text-[#0A0910]">{user.avatar}</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-1.5">
          <p class="text-sm font-bold text-white truncate">{user.name}</p>
          {#if user.verified}
            <svg class="w-4 h-4 text-[#AAEF45] shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          {/if}
        </div>
        <p class="text-[11px] text-gray-500 mt-0.5 truncate">{user.email}</p>
        <p class="text-[10px] text-gray-600 mt-0.5">{user.joined}</p>
      </div>
      <button class="shrink-0 px-3 py-1.5 bg-[#1A1825] border border-[#2a2840] rounded-lg text-[11px] font-bold text-gray-300 active:scale-95 transition-transform">
        Edit
      </button>
    </div>

    <!-- Seller CTA -->
    <button class="w-full bg-[#AAEF45]/10 border border-[#AAEF45]/25 rounded-2xl py-3.5 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
      <svg class="w-4 h-4 text-[#AAEF45]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
      <span class="text-sm font-bold text-[#AAEF45]">Beralih ke Seller Center</span>
    </button>

    <!-- Verifikasi Akun -->
    <div>
      <p class="text-[11px] font-black text-gray-500 tracking-widest uppercase mb-3">Verifikasi Akun</p>
      <div class="bg-[#14121E] border border-[#232033] rounded-2xl overflow-hidden">
        {#each verifikasi as item, i}
          <button class="w-full flex items-center gap-3 px-4 py-3.5 active:bg-[#1A1825] transition-colors {i < verifikasi.length - 1 ? 'border-b border-[#1E1C2E]' : ''}">
            <div class="w-8 h-8 rounded-xl bg-[#1A1825] flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                {@html item.icon}
              </svg>
            </div>
            <span class="flex-1 text-sm font-semibold text-white text-left">{item.label}</span>
            {#if item.status === 'verified'}
              <span class="text-[10px] font-bold bg-[#AAEF45]/15 text-[#AAEF45] px-2.5 py-1 rounded-full border border-[#AAEF45]/25">✓ Terverifikasi</span>
            {:else}
              <span class="text-[10px] font-bold bg-orange-500/15 text-orange-400 px-2.5 py-1 rounded-full border border-orange-500/25">Belum Verifikasi</span>
            {/if}
          </button>
        {/each}
      </div>
    </div>

    <!-- Verifikasi Identitas banner -->
    <button class="w-full bg-[#14121E] border border-[#AAEF45]/20 rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-transform">
      <div class="w-10 h-10 rounded-xl bg-[#AAEF45]/10 border border-[#AAEF45]/20 flex items-center justify-center shrink-0">
        <svg class="w-5 h-5 text-[#AAEF45]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
      </div>
      <div class="flex-1 text-left">
        <p class="text-sm font-bold text-white">Verifikasi Identitas</p>
        <p class="text-[11px] text-gray-500 mt-0.5">Unlock fitur Trusted Seller</p>
        <span class="inline-block mt-1.5 text-[9px] font-bold bg-orange-500/15 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/25">Belum Terverifikasi</span>
      </div>
      <svg class="w-4 h-4 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
      </svg>
    </button>

    <!-- Pengaturan -->
    <div>
      <p class="text-[11px] font-black text-gray-500 tracking-widest uppercase mb-3">Pengaturan</p>
      <div class="bg-[#14121E] border border-[#232033] rounded-2xl overflow-hidden">
        {#each pengaturan as item, i}
          <button class="w-full flex items-center gap-3 px-4 py-3.5 active:bg-[#1A1825] transition-colors {i < pengaturan.length - 1 ? 'border-b border-[#1E1C2E]' : ''}">
            <div class="w-8 h-8 rounded-xl {item.bg} flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 {item.color}" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                {@html item.icon}
              </svg>
            </div>
            <span class="flex-1 text-sm font-semibold text-white text-left">{item.label}</span>
            {#if item.badge}
              <span class="text-[10px] font-black bg-[#AAEF45]/15 text-[#AAEF45] w-5 h-5 rounded-full flex items-center justify-center border border-[#AAEF45]/25">{item.badge}</span>
            {/if}
            <svg class="w-4 h-4 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        {/each}
      </div>
    </div>

    <!-- Bantuan -->
    <div>
      <p class="text-[11px] font-black text-gray-500 tracking-widest uppercase mb-3">Bantuan</p>
      <div class="bg-[#14121E] border border-[#232033] rounded-2xl overflow-hidden">
        {#each bantuan as item, i}
          <button class="w-full flex items-center gap-3 px-4 py-3.5 active:bg-[#1A1825] transition-colors {i < bantuan.length - 1 ? 'border-b border-[#1E1C2E]' : ''}">
            <div class="w-8 h-8 rounded-xl bg-[#1A1825] flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                {@html item.icon}
              </svg>
            </div>
            <span class="flex-1 text-sm font-semibold text-white text-left">{item.label}</span>
            <svg class="w-4 h-4 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        {/each}
      </div>
    </div>

    <!-- Keluar -->
    <button
      onclick={() => showLogoutConfirm = true}
      class="w-full py-3.5 rounded-2xl border border-red-500/30 bg-red-500/5 text-red-400 text-sm font-bold active:scale-[0.98] transition-transform"
    >
      Keluar dari Akun
    </button>

    <!-- Footer -->
    <div class="text-center pb-2">
      <p class="text-[10px] text-gray-700">© 2026 TixLoop. All rights reserved.</p>
      <div class="flex items-center justify-center gap-3 mt-1.5">
        {#each ['Terms', 'Privacy', 'Help', 'Sell'] as link}
          <a href="/{link.toLowerCase()}" class="text-[10px] text-gray-600 hover:text-gray-400 transition-colors">{link}</a>
        {/each}
      </div>
    </div>

  </div>
</main>

<!-- Logout confirm modal -->
{#if showLogoutConfirm}
  <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center px-4 pb-8" onclick={() => showLogoutConfirm = false}>
    <div class="w-full bg-[#14121E] border border-[#232033] rounded-3xl p-5 space-y-4" onclick={(e) => e.stopPropagation()}>
      <div class="flex flex-col items-center text-center gap-2">
        <div class="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-1">
          <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
        </div>
        <p class="text-base font-black text-white">Keluar dari Akun?</p>
        <p class="text-[12px] text-gray-500">Kamu perlu login kembali untuk mengakses akunmu.</p>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <button onclick={() => showLogoutConfirm = false} class="py-3 rounded-xl bg-[#1A1825] border border-[#2a2840] text-sm font-bold text-gray-300 active:scale-95 transition-transform">
          Batal
        </button>
        <button onclick={handleLogout} disabled={isLoggingOut} class="py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-sm font-bold text-red-400 active:scale-95 transition-transform {isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}">
          {isLoggingOut ? 'Keluar...' : 'Ya, Keluar'}
        </button>
      </div>
    </div>
  </div>
{/if}
