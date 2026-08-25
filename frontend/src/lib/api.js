const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Une erreur est survenue.');
  }
  return data;
}

export const api = {
  register: (payload) => request('/users', { method: 'POST', body: payload }),
  login: (payload) => request('/users/login', { method: 'POST', body: payload }),
  me: (token) => request('/users/me', { token }),

  getConfig: () => request('/config'),

  getPreferences: (token) => request('/preferences', { token }),
  savePreferences: (modules, token) => request('/preferences', { method: 'PUT', body: { modules }, token }),

  getEntry: (date, token) => request(`/entries/${date}`, { token }),
  getHistory: (params, token) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/entries${qs ? `?${qs}` : ''}`, { token });
  },
  saveEntry: (payload, token) => request('/entries', { method: 'POST', body: payload, token })
};

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
