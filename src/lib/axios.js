import axios from 'axios';

// Buat instance axios dengan baseURL yang mengarah ke backend Laravel
const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
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
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
