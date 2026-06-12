# Execution Log: Frontend Sync & State Cleanup

- **Sequence**: 013
- **Date**: 2026-06-12
- **Feature**: frontend-sync

## Objective
Membersihkan kode frontend dari data tiruan (mock) yang sebelumnya disimpan pada `localStorage`, guna menggantungkan seluruh siklus verifikasi dan manajemen tiket sepenuhnya pada API backend yang telah dikembangkan dan stabil. Menambahkan fitur relist untuk tiket yang ditolak oleh admin pada dashboard seller.

## Implementation Summary
- Menghapus pembacaan `localStorage.getItem('admin_rejected_tickets')` di halaman `admin/fraud/+page.svelte` dan `admin/fraud/ticket/[id]/+page.svelte`.
- Menggunakan `data.verification_status` dan `data.listing_status` secara langsung di seluruh logic mapping.
- Membersihkan pengecekan dan filtering array di halaman Home (Marketplace) pembeli dari `localStorage.getItem('seller_published_tickets')`.
- Menghapus sinkronisasi filter status offline di Dashboard Seller, `seller/dashboard/+page.svelte`.
- Refaktor penuh `seller/produk/+page.svelte` untuk menyusun tab "Dijual", "Koleksi", dan "Terjual" tanpa `localStorage` usang.
- Menambahkan **Relist Modal** di halaman koleksi seller agar item yang ditolak (rejected) bisa kembali diubah harga jual dan opsi auto drop-nya untuk diajukan ulang ke backend melalui endpoint `POST /marketplace/listings`.

## Affected Files
- `src/routes/admin/fraud/+page.svelte` (modified)
- `src/routes/admin/fraud/ticket/[id]/+page.svelte` (modified)
- `src/routes/(buyer)/+page.svelte` (modified)
- `src/routes/seller/dashboard/+page.svelte` (modified)
- `src/routes/seller/produk/+page.svelte` (modified)

## Decisions Made
- Keputusan desain untuk halaman Seller: Tidak menyembunyikan tombol "Jual" dari tiket berstatus "Terverifikasi (Tidak Aktif)".
- Fitur Relist ditempatkan di dalam Modal terintegrasi untuk menyederhanakan UX tanpa routing halaman yang baru.

## Known Limitations
- Beberapa interaksi API backend mungkin memakan sedikit delay saat fetching koleksi yang banyak; *skeleton loading* belum dibuat mendalam selain *spinners* biasa.

## Next Actions
- Tes interaktif end-to-end dengan multi-login (Seller -> Admin -> Buyer -> Seller) di staging.
