import { computeScores } from './scoring';

const API_URL = import.meta.env.VITE_API_URL || '';

const LS_PREFS = 'elan_prefs';
const LS_ENTRIES = 'elan_entries';
const LS_MODULES = 'elan_modules_schema';
const LS_GOALS = 'elan_goals';
const LS_HABITS = 'elan_habits';
const LS_HABIT_LOGS = 'elan_habit_logs';
const LS_BEHAVIORS = 'elan_behaviors';
const LS_BEHAVIOR_LOGS = 'elan_behavior_logs';

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

function localGetModules() {
  return readJSON(LS_MODULES, []);
}

function localSaveModules(modules) {
  writeJSON(LS_MODULES, modules || []);
}

function localGetGoals() {
  return readJSON(LS_GOALS, []);
}

function localSaveGoals(goals) {
  writeJSON(LS_GOALS, goals || []);
  return goals || [];
}

function localGetEntry(date) {
  const entries = localGetEntries();
  const found = entries.find((e) => e.date === date);
  return found || { date, answers: {}, answerStates: {}, journalEntry: '', moduleScores: {}, globalScore: null, completionStatus: 'not_started' };
}

function localGetHistory(params = {}) {
  const entries = localGetEntries().sort((a, b) => a.date.localeCompare(b.date));
  const { from, to, limit } = params;
  const filtered = entries.filter((e) => (!from || e.date >= from) && (!to || e.date <= to));
  if (limit) return filtered.slice(-Number(limit));
  return filtered;
}

function localSaveEntry(payload) {
  const { date, answers = {}, journalEntry, answerStates = {}, completionStatus = 'draft' } = payload;
  const prefs = localGetPreferences().modules;
  const modules = localGetModules();
  const entries = localGetEntries();
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

  localSaveEntries(nextEntries);
  return next;
}

export const api = {
  register: async (payload) => request('/users', { method: 'POST', body: payload }),
  login: async (payload) => request('/users/login', { method: 'POST', body: payload }),
  me: async (token) => request('/users/me', { token }),

  syncLocalData: async (token) => {
    const entries = localGetEntries();
    const preferences = localGetPreferences().modules;
    if (Object.keys(preferences).length) {
      await request('/preferences', { method: 'PUT', body: { modules: preferences }, token });
    }
    for (const entry of entries) {
      await request('/entries', {
        method: 'POST',
        body: entry,
        token
      });
    }
    return { entries: entries.length };
  },

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
  },

  getGoals: async () => {
    return localGetGoals();
  },

  saveGoals: async (goals) => {
    return localSaveGoals(goals);
  },

  getHabits: async () => readJSON(LS_HABITS, []),
  saveHabits: async (habits) => { writeJSON(LS_HABITS, habits || []); return habits || []; },
  getHabitLogs: async () => readJSON(LS_HABIT_LOGS, {}),
  saveHabitLogs: async (logs) => { writeJSON(LS_HABIT_LOGS, logs || {}); return logs || {}; },

  getBehaviors: async () => readJSON(LS_BEHAVIORS, []),
  saveBehaviors: async (behaviors) => { writeJSON(LS_BEHAVIORS, behaviors || []); return behaviors || []; },
  getBehaviorLogs: async () => readJSON(LS_BEHAVIOR_LOGS, {}),
  saveBehaviorLogs: async (logs) => { writeJSON(LS_BEHAVIOR_LOGS, logs || {}); return logs || {}; }
};

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
