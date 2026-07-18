const envBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL = (envBaseUrl ? envBaseUrl.replace(/\/+$/, "") : "https://hire-me-jobs.onrender.com");

export function buildApiUrl(path = "") {
    if (!path) return API_BASE_URL;
    if (/^https?:\/\//i.test(path)) return path;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE_URL}${normalizedPath}`;
}
