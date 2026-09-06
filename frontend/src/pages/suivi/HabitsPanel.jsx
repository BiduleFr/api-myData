import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAppearance } from '../../context/AppearanceContext.jsx';
import { api, todayISO } from '../../lib/api';
import { HABITS, TRACKING_KEY, getTracking, habitById, itemLabel, trackQuestionId } from '../../lib/tracking';

function habitStats(history, habitId) {
  const qid = trackQuestionId('habit', habitId);
  const answered = history.filter((entry) => entry.answers?.[qid] !== undefined);
  const done = answered.filter((entry) => entry.answers?.[qid] === true);
  const byDate = new Map(history.map((entry) => [entry.date, entry.answers?.[qid]]));
  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (byDate.get(key) === true) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }
  return { answered: answered.length, done: done.length, streak };
}

export default function HabitsPanel() {
  const { token } = useAuth();
  const { locale } = useAppearance();
  const [preferences, setPreferences] = useState({});
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
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

  function toggleHabit(habitId) {
    const list = tracking.habits;
    const existing = list.find((item) => item.id === habitId);
    const nextList = existing
      ? list.map((item) => (item.id === habitId ? { ...item, active: item.active === false } : item))
      : [...list, { id: habitId, startDate: today, active: true }];
    const nextPrefs = { ...preferences, [TRACKING_KEY]: { ...tracking, habits: nextList } };
    setPreferences(nextPrefs);
    api.savePreferences(nextPrefs, token);
  }

  if (loading) {
    return <div className="animate-pulse text-slate-400 text-center py-10">{locale === 'en' ? 'Loading…' : 'Chargement…'}</div>;
  }

  const tracked = tracking.habits;
  const availableToAdd = HABITS.filter((habit) => !tracked.some((item) => item.id === habit.id && item.active !== false));

  return (
    <div className="space-y-6">
      {tracked.length === 0 && (
        <p className="text-sm text-slate-400">
          {locale === 'en'
            ? 'No habit tracked yet. Start one below or from the daily questionnaire.'
            : 'Aucune habitude suivie pour le moment. Lancez-en une ci-dessous ou depuis le questionnaire quotidien.'}
        </p>
      )}

      <div className="space-y-3">
        {tracked.map((entry) => {
          const habit = habitById(entry.id);
          if (!habit) return null;
          const stats = habitStats(history, habit.id);
          const rate = stats.answered > 0 ? Math.round((stats.done / stats.answered) * 100) : null;
          const isActive = entry.active !== false;
          return (
            <div key={habit.id} className={`card p-4 space-y-2 ${isActive ? '' : 'opacity-60'}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-800">{habit.icon} {itemLabel(habit, locale)}</p>
                <button onClick={() => toggleHabit(habit.id)} className="text-xs text-slate-400 hover:text-red-500">
                  {isActive ? (locale === 'en' ? 'Stop' : 'Arrêter') : (locale === 'en' ? 'Resume' : 'Reprendre')}
                </button>
              </div>
              <p className="text-xs text-slate-500">
                {locale === 'en'
                  ? `${stats.done} successful days out of ${stats.answered}${rate !== null ? ` · ${rate}%` : ''}${stats.streak > 0 ? ` · 🔥 ${stats.streak} days in a row` : ''}`
                  : `${stats.done} jours réussis sur ${stats.answered}${rate !== null ? ` · ${rate}%` : ''}${stats.streak > 0 ? ` · 🔥 ${stats.streak} jours d'affilée` : ''}`}
              </p>
              <p className="text-[11px] text-slate-400">
                {locale === 'en' ? `Started on ${entry.startDate}` : `Commencée le ${entry.startDate}`}
              </p>
            </div>
          );
        })}
      </div>

      {availableToAdd.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-600">{locale === 'en' ? 'Start a habit' : 'Commencer une habitude'}</p>
          <div className="grid grid-cols-2 gap-2">
            {availableToAdd.map((habit) => (
              <button
                key={habit.id}
                type="button"
                onClick={() => toggleHabit(habit.id)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold hover:border-brand-300 hover:bg-brand-50 transition-all"
              >
                <span>{habit.icon}</span>
                <span>{itemLabel(habit, locale)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
