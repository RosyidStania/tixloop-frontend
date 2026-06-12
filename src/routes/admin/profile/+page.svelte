<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import api from '$lib/axios';
  import { showToast } from '$lib/stores/toast.svelte.js';
  import BottomNav from '$lib/components/admin/layout/BottomNav.svelte';

  // Admin info
  let adminName = $state('Admin User');
  let adminRole = $state('Super Admin');
  let adminEmail = $state('admin@tixloop.com');
  let adminAvatar = $state('A');

  // Setting menu items
  const settingMenus = [
    {
      key: 'biaya',
      icon: `<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>`,
      title: 'Biaya Platform',
      desc: 'Kelola biaya layanan dan transaksi',
    },
    {
      key: 'pencairan',
      icon: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
      title: 'Pencairan Dana',
      desc: 'Kelola pencairan dana transaksi',
    },
    {
      key: 'notifikasi',
      icon: `<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>`,
      title: 'Notifikasi',
      desc: 'Kelola pemberitahuan sistem',
    },
  ];

  let showLogoutConfirm = $state(false);
  let mounted = $state(false);
  
  onMount(async () => {
    mounted = true;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        goto('/login');
        return;
      }
      
      const userRes = await api.get('/auth/me');
      const user = userRes.data.data || userRes.data;
      if (user.email !== 'admin@tixloop.com') {
        goto('/home');
        return;
      }
      
      adminName = user.name || 'Admin User';
      adminEmail = user.email || 'admin@tixloop.com';
      adminAvatar = adminName.charAt(0).toUpperCase();
    } catch (err) {
      console.error(err);
      goto('/login');
    }
  });

  function handleMenuClick(key) {
    showToast(`Pengaturan ${key} akan segera hadir.`);
  }

  function handleLogout() {
    showLogoutConfirm = true;
  }

  function confirmLogout() {
    showLogoutConfirm = false;
    localStorage.removeItem('token');
    goto('/login');
  }
</script>

<BottomNav activeTab="profile" />

<main class="bg-[#0A0910] min-h-screen text-white font-sans pb-24 transition-opacity duration-500 {mounted ? 'opacity-100' : 'opacity-0'} relative">
  
  <div class="px-4 pt-12 pb-3 flex items-center justify-between">
    <h1 class="text-xl font-bold text-white tracking-tight">Admin Profile</h1>
    <button class="w-9 h-9 bg-[#1A1825] rounded-full flex items-center justify-center relative active:scale-95 transition-transform">
      <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
      </svg>
      <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C2F04B] rounded-full border border-[#0A0910]"></span>
    </button>
  </div>

  <div class="px-4 space-y-5">
    
    <div class="bg-[#14121E] border border-[#232033] rounded-2xl p-4 space-y-4">
      
      <div class="flex items-center gap-3">
        <div class="w-14 h-14 rounded-2xl bg-[#C2F04B] flex items-center justify-center shrink-0">
          <span class="text-2xl font-black text-[#0A0910]">{adminAvatar}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5">
            <p class="text-sm font-bold text-white truncate">{adminName}</p>
            <svg class="w-4 h-4 text-[#C2F04B] shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <p class="text-xs text-gray-500 font-medium mt-0.5 truncate">{adminRole}</p>
          <span class="inline-block mt-1 text-[10px] font-bold bg-[#C2F04B]/15 text-[#C2F04B] px-2 py-0.5 rounded-full border border-[#C2F04B]/25">
            {adminEmail}
          </span>
        </div>
      </div>

      <div class="h-px bg-[#232033]"></div>

      <div class="flex justify-around items-center">
        <div class="flex flex-col items-center gap-1 flex-1">
          <span class="text-xl font-black text-[#E6C83D] tracking-tight leading-none">1.2K</span>
          <span class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Users</span>
        </div>
        
        <div class="w-px h-8 bg-[#232033]"></div>
        
        <div class="flex flex-col items-center gap-1 flex-1">
          <span class="text-xl font-black text-[#E6C83D] tracking-tight leading-none">150</span>
          <span class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Events</span>
        </div>
        
        <div class="w-px h-8 bg-[#232033]"></div>
        
        <div class="flex flex-col items-center gap-1 flex-1">
          <span class="text-xl font-black text-[#A88FE6] tracking-tight leading-none">24</span>
          <span class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Frauds</span>
        </div>
      </div>
      
    </div>

    <div>
      <p class="text-xs font-bold text-gray-500 uppercase mb-3">Pengaturan Sistem</p>
      <div class="bg-[#14121E] border border-[#232033] rounded-2xl overflow-hidden">
        {#each settingMenus as item, i}
          <button 
            class="w-full flex items-center gap-3 px-4 py-3.5 active:bg-[#1A1825] transition-colors {i < settingMenus.length - 1 ? 'border-b border-[#1E1C2E]' : ''}"
            onclick={() => handleMenuClick(item.key)}
          >
            <div class="w-8 h-8 rounded-xl bg-[#1A1825] flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="text-gray-400" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                {@html item.icon}
              </svg>
            </div>
            <div class="flex-1 text-left">
              <span class="block text-sm font-semibold text-white">{item.title}</span>
              <span class="block text-xs text-gray-500">{item.desc}</span>
            </div>
            <svg class="w-4 h-4 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        {/each}
      </div>
    </div>

    <button class="w-full bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl py-3.5 flex items-center justify-center gap-2 text-sm font-bold active:scale-[0.98] hover:bg-red-500/20 hover:border-red-500/40 transition-all mt-4" onclick={handleLogout}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      Logout
    </button>
  </div>

  <!-- Logout Modal -->
  {#if showLogoutConfirm}
    <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-[#14121E] border border-[#232033] rounded-2xl w-full max-w-[340px] p-5 shadow-2xl">
        <div class="w-12 h-12 rounded-full bg-red-500/15 text-red-500 flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </div>
        <h3 class="text-lg font-bold text-gray-100 mb-2">Logout dari Admin Panel?</h3>
        <p class="text-[13px] text-gray-400 mb-6 leading-relaxed">Sesi admin kamu akan diakhiri. Kamu perlu login kembali untuk mengakses panel.</p>
        <div class="flex gap-3">
          <button class="flex-1 bg-[#1A1825] border border-[#232033] text-gray-300 rounded-xl py-3 text-sm font-semibold hover:bg-[#232033] transition" onclick={() => showLogoutConfirm = false}>Batal</button>
          <button class="flex-1 bg-red-500 text-white rounded-xl py-3 text-sm font-bold hover:bg-red-600 transition" onclick={confirmLogout}>Logout</button>
        </div>
      </div>
    </div>
  {/if}
</main>
