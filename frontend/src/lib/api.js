import DEFAULT_MODULES from './defaultModules';
import { computeScores } from './scoring';

const API_URL = import.meta.env.VITE_API_URL || '';

const LS_PREFS = 'elan_prefs';
const LS_ENTRIES = 'elan_entries';

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

async function request(path, { method = 'GET', body, token } = {}) {
  if (!API_URL) throw new Error('API indisponible');

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Une erreur est survenue.');
  return data;
}

function localGetPreferences() {
  return { modules: readJSON(LS_PREFS, {}) };
}

function localSavePreferences(modules) {
  writeJSON(LS_PREFS, modules || {});
  return { modules: modules || {} };
}

function localGetEntries() {
  return readJSON(LS_ENTRIES, []);
}

function localSaveEntries(entries) {
  writeJSON(LS_ENTRIES, entries);
}

function localGetEntry(date) {
  const entries = localGetEntries();
  const found = entries.find((e) => e.date === date);
  return found || { date, answers: {}, moduleScores: {}, globalScore: null, completionStatus: 'not_started' };
}

function localGetHistory(params = {}) {
  const entries = localGetEntries().sort((a, b) => a.date.localeCompare(b.date));
  const { from, to, limit } = params;
  const filtered = entries.filter((e) => (!from || e.date >= from) && (!to || e.date <= to));
  if (limit) return filtered.slice(-Number(limit));
  return filtered;
}

function localSaveEntry(payload) {
  const { date, answers = {}, completionStatus = 'draft' } = payload;
  const prefs = localGetPreferences().modules;
  const entries = localGetEntries();
  const existing = entries.find((e) => e.date === date);
  const mergedAnswers = { ...(existing?.answers || {}), ...answers };
  const { globalScore, moduleScores } = computeScores(DEFAULT_MODULES, prefs, mergedAnswers);

  const next = {
    date,
    answers: mergedAnswers,
    moduleScores,
    globalScore,
    completionStatus
  };

  const nextEntries = existing
    ? entries.map((e) => (e.date === date ? next : e))
    : [...entries, next];

  localSaveEntries(nextEntries);
  return next;
}

export const api = {
  register: async (payload) => request('/users', { method: 'POST', body: payload }),
  login: async (payload) => request('/users/login', { method: 'POST', body: payload }),
  me: async (token) => request('/users/me', { token }),

  getConfig: async () => {
    try {
      return await request('/config');
    } catch {
      return { modules: DEFAULT_MODULES };
    }
  },

  getPreferences: async (token) => {
    if (!token) return localGetPreferences();
    try {
      return await request('/preferences', { token });
    } catch {
      return localGetPreferences();
    }
  },

  savePreferences: async (modules, token) => {
    if (!token) return localSavePreferences(modules);
    try {
      return await request('/preferences', { method: 'PUT', body: { modules }, token });
    } catch {
      return localSavePreferences(modules);
    }
  },

  getEntry: async (date, token) => {
    if (!token) return localGetEntry(date);
    try {
      return await request(`/entries/${date}`, { token });
    } catch {
      return localGetEntry(date);
    }
  },

  getHistory: async (params, token) => {
    if (!token) return localGetHistory(params);
    try {
      const qs = new URLSearchParams(params || {}).toString();
      return await request(`/entries${qs ? `?${qs}` : ''}`, { token });
    } catch {
      return localGetHistory(params);
    }
  },

  saveEntry: async (payload, token) => {
    if (!token) return localSaveEntry(payload);
    try {
      return await request('/entries', { method: 'POST', body: payload, token });
    } catch {
      return localSaveEntry(payload);
    }
  }
};

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
