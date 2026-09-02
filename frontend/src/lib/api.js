import { computeScores } from './scoring';

const API_URL = import.meta.env.VITE_API_URL || '';

function getScope(token) {
  if (!token) return 'guest';
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload && payload.id) return `user_${payload.id}`;
  } catch {}
  return 'guest';
}

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

function localGetPreferences(scope = 'guest') {
  return { modules: readJSON(`elan_${scope}_prefs`, {}) };
}

function localSavePreferences(modules, scope = 'guest') {
  writeJSON(`elan_${scope}_prefs`, modules || {});
  return { modules: modules || {} };
}

function localGetEntries(scope = 'guest') {
  return readJSON(`elan_${scope}_entries`, []);
}

function localSaveEntries(entries, scope = 'guest') {
  writeJSON(`elan_${scope}_entries`, entries);
}

function localGetModules() {
  return readJSON('elan_modules_schema', []);
}

function localSaveModules(modules) {
  writeJSON('elan_modules_schema', modules || []);
}

function localGetGoals(scope = 'guest') {
  return readJSON(`elan_${scope}_goals`, []);
}

function localSaveGoals(goals, scope = 'guest') {
  writeJSON(`elan_${scope}_goals`, goals || []);
  return goals || [];
}

function localGetEntry(date, scope = 'guest') {
  const entries = localGetEntries(scope);
  const found = entries.find((e) => e.date === date);
  return found || { date, answers: {}, answerStates: {}, journalEntry: '', moduleScores: {}, globalScore: null, completionStatus: 'not_started' };
}

function localGetHistory(params = {}, scope = 'guest') {
  const entries = localGetEntries(scope).sort((a, b) => a.date.localeCompare(b.date));
  const { from, to, limit } = params;
  const filtered = entries.filter((e) => (!from || e.date >= from) && (!to || e.date <= to));
  if (limit) return filtered.slice(-Number(limit));
  return filtered;
}

function localSaveEntry(payload, scope = 'guest') {
  const { date, answers = {}, journalEntry, answerStates = {}, completionStatus = 'draft' } = payload;
  const prefs = localGetPreferences(scope).modules;
  const modules = localGetModules();
  const entries = localGetEntries(scope);
  const existing = entries.find((e) => e.date === date);
  const mergedAnswers = { ...(existing?.answers || {}), ...answers };
  const mergedAnswerStates = { ...(existing?.answerStates || {}), ...answerStates };
  const { globalScore, moduleScores } = computeScores(modules, prefs, mergedAnswers);

  const next = {
    date,
    answers: mergedAnswers,
    answerStates: mergedAnswerStates,
    journalEntry: journalEntry !== undefined ? journalEntry : (existing?.journalEntry || ''),
    moduleScores,
    globalScore,
    completionStatus
  };

  const nextEntries = existing
    ? entries.map((e) => (e.date === date ? next : e))
    : [...entries, next];

  localSaveEntries(nextEntries, scope);
  return next;
}

export const api = {
  register: async (payload) => request('/users', { method: 'POST', body: payload }),
  login: async (payload) => request('/users/login', { method: 'POST', body: payload }),
  me: async (token) => request('/users/me', { token }),

  getConfig: async () => {
    try {
      const data = await request('/config');
      localSaveModules(data.modules || []);
      return data;
    } catch {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}modules.schema.json`);
        const modules = await res.json();
        localSaveModules(modules || []);
        return { modules };
      } catch {
        return { modules: localGetModules() };
      }
    }
  },

  getPreferences: async (token) => {
    const scope = getScope(token);
    if (!token) return localGetPreferences(scope);
    try {
      return await request('/preferences', { token });
    } catch {
      return localGetPreferences(scope);
    }
  },

  savePreferences: async (modules, token) => {
    const scope = getScope(token);
    if (!token) return localSavePreferences(modules, scope);
    try {
      return await request('/preferences', { method: 'PUT', body: { modules }, token });
    } catch {
      return localSavePreferences(modules, scope);
    }
  },

  getEntry: async (date, token) => {
    const scope = getScope(token);
    if (!token) return localGetEntry(date, scope);
    try {
      return await request(`/entries/${date}`, { token });
    } catch {
      return localGetEntry(date, scope);
    }
  },

  getHistory: async (params, token) => {
    const scope = getScope(token);
    if (!token) return localGetHistory(params, scope);
    try {
      const qs = new URLSearchParams(params || {}).toString();
      return await request(`/entries${qs ? `?${qs}` : ''}`, { token });
    } catch {
      return localGetHistory(params, scope);
    }
  },

  saveEntry: async (payload, token) => {
    const scope = getScope(token);
    if (!token) return localSaveEntry(payload, scope);
    try {
      return await request('/entries', { method: 'POST', body: payload, token });
    } catch {
      return localSaveEntry(payload, scope);
    }
  },

  getGoals: async (token) => {
    const scope = getScope(token);
    return localGetGoals(scope);
  },

  saveGoals: async (goals, token) => {
    const scope = getScope(token);
    return localSaveGoals(goals, scope);
  },

  getHabits: async (token) => {
    const scope = getScope(token);
    return readJSON(`elan_${scope}_habits`, []);
  },

  saveHabits: async (habits, token) => {
    const scope = getScope(token);
    writeJSON(`elan_${scope}_habits`, habits || []);
    return habits || [];
  },

  getHabitLogs: async (token) => {
    const scope = getScope(token);
    return readJSON(`elan_${scope}_habit_logs`, {});
  },

  saveHabitLogs: async (logs, token) => {
    const scope = getScope(token);
    writeJSON(`elan_${scope}_habit_logs`, logs || {});
    return logs || {};
  },

  getBehaviors: async (token) => {
    const scope = getScope(token);
    return readJSON(`elan_${scope}_behaviors`, []);
  },

  saveBehaviors: async (behaviors, token) => {
    const scope = getScope(token);
    writeJSON(`elan_${scope}_behaviors`, behaviors || []);
    return behaviors || [];
  },

  getBehaviorLogs: async (token) => {
    const scope = getScope(token);
    return readJSON(`elan_${scope}_behavior_logs`, {});
  },

  saveBehaviorLogs: async (logs, token) => {
    const scope = getScope(token);
    writeJSON(`elan_${scope}_behavior_logs`, logs || {});
    return logs || {};
  }
};

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
