// src/lib/services/api.js

const BASE_URL = 'https://api.tixloop.id/api/v1';

/**
 * Wrapper standar untuk memanggil API Laravel 13
 */
async function fetchApi(endpoint, options = {}) {
    // Ambil token dari internal SvelteKit (nantinya dari HttpOnly Cookie via BFF)
    // Untuk sementara selama development, kita bisa sesuaikan logic tokennya
    let token = null; 
    
    // Default Headers
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        const data = await response.json();

        // Interceptor: Tangani error 401 (Unauthorized) otomatis
        if (response.status === 401) {
            console.error("Token tidak valid atau expired. Redirecting ke login...");
            // Logika logout otomatis / redirect bisa ditaruh di sini
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }

        // Standard Response Format TixLoop
        if (!response.ok || data.success === false) {
            throw {
                status: response.status,
                message: data.message || "Terjadi kesalahan pada server",
                errors: data.errors || null
            };
        }

        return data; // Mengembalikan { success: true, message: "...", data: {} }
    } catch (error) {
        console.error(`[API Error] ${endpoint}:`, error);
        throw error;
    }
}

// Export fungsi-fungsi HTTP methods yang rapi
export const api = {
    get: (endpoint, options) => fetchApi(endpoint, { method: 'GET', ...options }),
    post: (endpoint, body, options) => fetchApi(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),
    put: (endpoint, body, options) => fetchApi(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),
    delete: (endpoint, options) => fetchApi(endpoint, { method: 'DELETE', ...options }),
};