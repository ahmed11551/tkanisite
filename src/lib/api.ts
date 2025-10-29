// API client for backend integration (timeouts, retries, query params)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://centertkani.ru/api';
const API_AUTH_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  query?: Record<string, string | number | boolean | undefined | null>;
  timeoutMs?: number;
  retries?: number; // retry on 5xx/network
}

function toQueryString(query?: ApiConfig['query']): string {
  if (!query) return '';
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.append(k, String(v));
  });
  const s = params.toString();
  return s ? `?${s}` : '';
}

async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(input, { ...init, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function fetchApi(endpoint: string, config: ApiConfig = {}) {
  const { method = 'GET', headers = {}, body, query, timeoutMs = 12000, retries = 2 } = config;

  const url = `${API_BASE_URL}${endpoint}${toQueryString(query)}`;

  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };
  if (API_AUTH_TOKEN) baseHeaders['Authorization'] = `Bearer ${API_AUTH_TOKEN}`;

  let attempt = 0;
  // simple retry strategy for 5xx/network errors
  while (true) {
    try {
      const response = await fetchWithTimeout(
        url,
        {
          method,
          headers: baseHeaders,
          body: body && method !== 'GET' ? JSON.stringify(body) : undefined,
        },
        timeoutMs,
      );

      if (!response.ok) {
        // retry on 5xx
        if (response.status >= 500 && attempt < retries) {
          attempt += 1;
          await new Promise((r) => setTimeout(r, 300 * attempt));
          continue;
        }
        const text = await response.text().catch(() => response.statusText);
        throw new Error(`API Error ${response.status}: ${text}`);
      }
      // try parse json, fallback to text
      const ct = response.headers.get('content-type') || '';
      if (ct.includes('application/json')) return response.json();
      return response.text();
    } catch (err: any) {
      const isAbort = err?.name === 'AbortError';
      if ((isAbort || err?.message?.includes('NetworkError')) && attempt < retries) {
        attempt += 1;
        await new Promise((r) => setTimeout(r, 300 * attempt));
        continue;
      }
      throw err;
    }
  }
}

// Products API
export const productsApi = {
  getAll: (params?: { category?: string; page?: number; limit?: number }) =>
    fetchApi('/products', { method: 'GET', query: params }),

  getById: (id: string) =>
    fetchApi(`/products/${id}`),

  getNew: (params?: { page?: number; limit?: number }) =>
    fetchApi('/products/new', { method: 'GET', query: params }),

  getSale: (params?: { page?: number; limit?: number }) =>
    fetchApi('/products/sale', { method: 'GET', query: params }),

  search: (q: string, params?: { page?: number; limit?: number }) =>
    fetchApi('/products/search', { method: 'GET', query: { q, ...params } }),
};

// Categories API
export const categoriesApi = {
  getAll: () =>
    fetchApi('/categories'),

  getById: (id: string) =>
    fetchApi(`/categories/${id}`),
};

// Cart API
export const cartApi = {
  get: () =>
    fetchApi('/cart'),

  add: (data: any) =>
    fetchApi('/cart', { method: 'POST', body: data }),

  update: (id: string, data: any) =>
    fetchApi(`/cart/${id}`, { method: 'PUT', body: data }),

  remove: (id: string) =>
    fetchApi(`/cart/${id}`, { method: 'DELETE' }),
};

// Checkout API
export const checkoutApi = {
  create: (data: any) =>
    fetchApi('/checkout', { method: 'POST', body: data }),

  validatePromoCode: (code: string) =>
    fetchApi('/checkout/promo', { method: 'POST', body: { code } }),
};

// Auth API
export const authApi = {
  login: (data: { email: string; password: string }) =>
    fetchApi('/auth/login', { method: 'POST', body: data }),

  register: (data: any) =>
    fetchApi('/auth/register', { method: 'POST', body: data }),

  logout: () =>
    fetchApi('/auth/logout', { method: 'POST' }),

  getProfile: () =>
    fetchApi('/auth/profile'),
};

// Orders API
export const ordersApi = {
  get: () =>
    fetchApi('/orders'),

  getById: (id: string) =>
    fetchApi(`/orders/${id}`),

  repeat: (id: string) =>
    fetchApi(`/orders/${id}/repeat`, { method: 'POST' }),
};

// Collections API
export const collectionsApi = {
  getAll: () =>
    fetchApi('/collections'),

  getById: (id: string) =>
    fetchApi(`/collections/${id}`),
};

// Works API
export const worksApi = {
  getAll: () =>
    fetchApi('/works'),

  getById: (id: string) =>
    fetchApi(`/works/${id}`),
};

// Loyalty API
export const loyaltyApi = {
  getBalance: () =>
    fetchApi('/loyalty/balance'),

  getHistory: () =>
    fetchApi('/loyalty/history'),
};

export default fetchApi;

