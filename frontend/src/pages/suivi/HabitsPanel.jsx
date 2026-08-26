import { useEffect, useState } from 'react';
import { api, todayISO } from '../../lib/api';

function computeStreak(logs) {
  let streak = 0;
  const d = new Date();
  for (;;) {
    const key = d.toISOString().slice(0, 10);
    if (logs[key]) {
      streak += 1;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export default function HabitsPanel() {
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState({});
  const [title, setTitle] = useState('');
  const [targetPerWeek, setTargetPerWeek] = useState(5);
  const today = todayISO();

  useEffect(() => {
    Promise.all([api.getHabits(), api.getHabitLogs()]).then(([h, l]) => {
      setHabits(h || []);
      setLogs(l || {});
    });
  }, []);

  function addHabit(e) {
    e.preventDefault();
    if (!title) return;
    const next = [...habits, { id: crypto.randomUUID(), title, targetPerWeek: Number(targetPerWeek), active: true }];
    setHabits(next);
    api.saveHabits(next);
    setTitle('');
  }

  function removeHabit(id) {
    const next = habits.filter((h) => h.id !== id);
    setHabits(next);
    api.saveHabits(next);
    const nextLogs = { ...logs };
    delete nextLogs[id];
    setLogs(nextLogs);
    api.saveHabitLogs(nextLogs);
  }

  function toggleToday(habitId) {
    const habitLogs = { ...(logs[habitId] || {}) };
    if (habitLogs[today]) delete habitLogs[today];
    else habitLogs[today] = true;
    const next = { ...logs, [habitId]: habitLogs };
    setLogs(next);
    api.saveHabitLogs(next);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={addHabit} className="card p-5 grid sm:grid-cols-3 gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nom de l'habitude (ex: Lecture)"
          className="rounded-xl border border-slate-200 px-3 py-2 sm:col-span-2"
          required
        />
        <input
          type="number"
          min={1}
          max={7}
          value={targetPerWeek}
          onChange={(e) => setTargetPerWeek(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2"
        />
        <button type="submit" className="btn-primary sm:col-span-3">Ajouter l'habitude</button>
      </form>

      <div className="space-y-3">
        {habits.length === 0 && <div className="text-sm text-slate-400">Aucune habitude suivie pour le moment.</div>}
        {habits.map((h) => {
          const habitLogs = logs[h.id] || {};
          const streak = computeStreak(habitLogs);
          const doneToday = !!habitLogs[today];
          return (
            <div key={h.id} className="card p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-800">{h.title}</p>
                <p className="text-xs text-slate-500">Cible {h.targetPerWeek}x / semaine {streak > 0 && `· 🔥 ${streak} j`}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleToday(h.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    doneToday ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white border-slate-200 hover:border-brand-300'
                  }`}
                >
                  {doneToday ? 'Fait aujourd\'hui ✓' : 'Marquer fait'}
                </button>
                <button onClick={() => removeHabit(h.id)} className="text-xs text-slate-400 hover:text-red-500">Suppr.</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
