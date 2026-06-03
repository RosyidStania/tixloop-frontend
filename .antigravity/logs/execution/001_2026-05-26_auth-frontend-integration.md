# Execution Log: Auth Frontend Integration

- **Sequence**: 001
- **Date**: 2026-05-26
- **Feature**: auth-frontend-integration

## Objective
Merapikan file auth di SvelteKit frontend (dikelompokkan ke folder route group `(auth)`) dan menghubungkan fungsi register & login ke backend API.

## Implementation Summary
- Memindahkan `src/routes/login` ke `src/routes/(auth)/login`.
- Memindahkan `src/routes/register` ke `src/routes/(auth)/register`.
- Memodifikasi `handleLogin` di `login/+page.svelte` untuk memanggil endpoint `POST http://localhost:8000/api/v1/auth/login`.
- Memodifikasi `handleSubmit` di `register/+page.svelte` untuk memanggil endpoint `POST http://localhost:8000/api/v1/auth/register`.
- Menyimpan token ke `localStorage` dan melakukan redirect ke `/` saat sukses.

## Affected Files
- `d:\Oliv\tixloop-frontend\src\routes\(auth)\login\+page.svelte` (modified, moved)
- `d:\Oliv\tixloop-frontend\src\routes\(auth)\register\+page.svelte` (modified, moved)

## Decisions Made
- Menggunakan endpoint hardcoded sementara (`localhost:8000`) karena environment variables belum disetup di frontend.
- Menyimpan JWT token dan data user di `localStorage` sebagai solusi sederhana sesuai MVP.
- Mengelompokkan routes login dan register ke dalam SvelteKit route group `(auth)` agar folder `routes` lebih rapi.

## Known Limitations
- Error handling masih menggunakan `alert()` bawaan browser.
- Belum ada middleware/route guard di sisi frontend yang mengecek validitas token jika masuk ke rute yang memerlukan auth.

## Next Actions
- Membuat toast notification untuk UI UX feedback yang lebih rapi (mengganti `alert`).
- Menambahkan route guards / layout loading state untuk mengecek session user dan sinkronisasi dengan endpoint `/api/v1/auth/me`.
