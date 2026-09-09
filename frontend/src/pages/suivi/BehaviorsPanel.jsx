import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAppearance } from '../../context/AppearanceContext.jsx';
import { api, todayISO } from '../../lib/api';
import { BEHAVIORS, TRACKING_KEY, getTracking, behaviorById, itemLabel, trackQuestionId, createCustomId } from '../../lib/tracking';

function behaviorStats(history, behaviorId) {
  const qid = trackQuestionId('behavior', behaviorId);
  const answered = history.filter((entry) => entry.answers?.[qid] !== undefined);
  const observed = answered.filter((entry) => entry.answers?.[qid] === true);
  const last7 = history.slice(-7);
  const last30 = history.slice(-30);
  const observed7 = last7.filter((entry) => entry.answers?.[qid] === true).length;
  const observed30 = last30.filter((entry) => entry.answers?.[qid] === true).length;
  const byDate = new Map(history.map((entry) => [entry.date, entry.answers?.[qid]]));
  let streakWithout = 0;
  const cursor = new Date();
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    const value = byDate.get(key);
    if (value === undefined) break;
    if (value === true) break;
    streakWithout += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return { answered: answered.length, observed: observed.length, observed7, observed30, streakWithout };
}

export default function BehaviorsPanel() {
  const { token } = useAuth();
  const { locale } = useAppearance();
  const [preferences, setPreferences] = useState({});
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customTitle, setCustomTitle] = useState('');
  const today = todayISO();

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getPreferences(token), api.getHistory({ limit: 120 }, token)])
      .then(([prefs, hist]) => {
        setPreferences(prefs.modules || {});
        setHistory(hist || []);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const tracking = getTracking(preferences);

  function toggleBehavior(behaviorId) {
    const list = tracking.behaviors;
    const existing = list.find((item) => item.id === behaviorId);
    const nextList = existing
      ? list.map((item) => (item.id === behaviorId ? { ...item, active: item.active === false } : item))
      : [...list, { id: behaviorId, startDate: today, active: true }];
    const nextPrefs = { ...preferences, [TRACKING_KEY]: { ...tracking, behaviors: nextList } };
    setPreferences(nextPrefs);
    api.savePreferences(nextPrefs, token);
  }

  function toggleCustom(listKey, itemId) {
    const list = tracking[listKey];
    const nextList = list.map((item) => (item.id === itemId ? { ...item, active: item.active === false } : item));
    const nextPrefs = { ...preferences, [TRACKING_KEY]: { ...tracking, [listKey]: nextList } };
    setPreferences(nextPrefs);
    api.savePreferences(nextPrefs, token);
  }

  function addCustomBehavior(e) {
    e.preventDefault();
    if (!customTitle.trim()) return;
    const nextCustom = [...tracking.customBehaviors, { id: createCustomId('behavior'), label: customTitle.trim(), startDate: today, active: true }];
    const nextPrefs = { ...preferences, [TRACKING_KEY]: { ...tracking, customBehaviors: nextCustom } };
    setPreferences(nextPrefs);
    api.savePreferences(nextPrefs, token);
    setCustomTitle('');
  }

  if (loading) {
    return <div className="animate-pulse text-slate-400 text-center py-10">{locale === 'en' ? 'Loading…' : 'Chargement…'}</div>;
  }

  const tracked = tracking.behaviors;
  const availableToAdd = BEHAVIORS.filter((behavior) => !tracked.some((item) => item.id === behavior.id && item.active !== false));

  return (
    <div className="space-y-6">
      <form onSubmit={addCustomBehavior} className="card p-4 flex gap-3">
        <input
          value={customTitle}
          onChange={(e) => setCustomTitle(e.target.value)}
          placeholder={locale === 'en' ? 'New behavior to watch…' : 'Nouveau comportement à surveiller…'}
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
        <button type="submit" className="btn-primary text-sm">{locale === 'en' ? 'Add' : 'Ajouter'}</button>
      </form>

      {tracked.length === 0 && tracking.customBehaviors.length === 0 && (
        <p className="text-sm text-slate-400">
          {locale === 'en'
            ? 'No behavior watched yet. Start watching one below or from the daily questionnaire.'
            : 'Aucun comportement surveillé pour le moment. Lancez-en un ci-dessous ou depuis le questionnaire quotidien.'}
        </p>
      )}

      <div className="space-y-3">
        {tracking.customBehaviors.map((entry) => {
          const stats = behaviorStats(history, entry.id);
          const isActive = entry.active !== false;
          return (
            <div key={entry.id} className={`card p-4 space-y-2 ${isActive ? '' : 'opacity-60'}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-800">🛡️ {entry.label}</p>
                <button onClick={() => toggleCustom('customBehaviors', entry.id)} className="text-xs text-slate-400 hover:text-red-500">
                  {isActive ? (locale === 'en' ? 'Stop' : 'Arrêter') : (locale === 'en' ? 'Resume' : 'Reprendre')}
                </button>
              </div>
              <p className="text-xs text-slate-500">
                {locale === 'en'
                  ? `Observed ${stats.observed7} day(s) in the last 7 · ${stats.observed30} in the last 30${stats.streakWithout > 0 ? ` · 🔥 ${stats.streakWithout} days without` : ''}`
                  : `Observé ${stats.observed7} jour(s) sur les 7 derniers · ${stats.observed30} sur les 30 derniers${stats.streakWithout > 0 ? ` · 🔥 ${stats.streakWithout} jours sans` : ''}`}
              </p>
              <p className="text-[11px] text-slate-400">
                {locale === 'en' ? `Watched since ${entry.startDate} · personal` : `Surveillé depuis le ${entry.startDate} · personnel`}
              </p>
            </div>
          );
        })}
        {tracked.map((entry) => {
          const behavior = behaviorById(entry.id);
          if (!behavior) return null;
          const stats = behaviorStats(history, behavior.id);
          const isActive = entry.active !== false;
          return (
            <div key={behavior.id} className={`card p-4 space-y-2 ${isActive ? '' : 'opacity-60'}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-800">{behavior.icon} {itemLabel(behavior, locale)}</p>
                <button onClick={() => toggleBehavior(behavior.id)} className="text-xs text-slate-400 hover:text-red-500">
                  {isActive ? (locale === 'en' ? 'Stop' : 'Arrêter') : (locale === 'en' ? 'Resume' : 'Reprendre')}
                </button>
              </div>
              <p className="text-xs text-slate-500">
                {locale === 'en'
                  ? `Observed ${stats.observed7} day(s) in the last 7 · ${stats.observed30} in the last 30${stats.streakWithout > 0 ? ` · 🔥 ${stats.streakWithout} days without` : ''}`
                  : `Observé ${stats.observed7} jour(s) sur les 7 derniers · ${stats.observed30} sur les 30 derniers${stats.streakWithout > 0 ? ` · 🔥 ${stats.streakWithout} jours sans` : ''}`}
              </p>
              <p className="text-[11px] text-slate-400">
                {locale === 'en' ? `Watched since ${entry.startDate}` : `Surveillé depuis le ${entry.startDate}`}
              </p>
            </div>
          );
        })}
      </div>

      {availableToAdd.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-600">{locale === 'en' ? 'Watch a behavior' : 'Surveiller un comportement'}</p>
          <div className="grid grid-cols-2 gap-2">
            {availableToAdd.map((behavior) => (
              <button
                key={behavior.id}
                type="button"
                onClick={() => toggleBehavior(behavior.id)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold hover:border-brand-300 hover:bg-brand-50 transition-all"
              >
                <span>{behavior.icon}</span>
                <span>{itemLabel(behavior, locale)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
