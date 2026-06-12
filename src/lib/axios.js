import axios from 'axios';

// Buat instance axios dengan baseURL yang mengarah ke backend Laravel
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor: otomatis tambahkan token jika ada
api.interceptors.request.use((config) => {
    // Pastikan berjalan di browser environment
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor: tangani 401 Unauthorized
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Sesi telah habis atau tidak valid (401). Silakan login ulang.");
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
