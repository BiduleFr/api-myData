import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api';

export default function Customize() {
  const { token } = useAuth();
  const [modules, setModules] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([api.getConfig(), api.getPreferences(token)])
      .then(([cfg, prefs]) => {
        setModules(cfg.modules);
        setPreferences(prefs.modules || {});
      })
      .finally(() => setLoading(false));
  }, [token]);

  function updateModule(moduleId, patch) {
    setPreferences((prev) => ({
      ...prev,
      [moduleId]: { ...prev[moduleId], ...patch }
    }));
    setSaved(false);
  }

  function toggleQuestion(moduleId, questionId, enabled) {
    setPreferences((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        questions: { ...prev[moduleId]?.questions, [questionId]: { enabled } }
      }
    }));
    setSaved(false);
  }

  async function save() {
    await api.savePreferences(preferences, token);
    setSaved(true);
  }

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse text-slate-400 text-center py-20">Chargement…</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-up">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Personnaliser mon suivi</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Configurez une fois vos préférences, profitez ensuite d’un questionnaire quotidien simple.
          </p>
        </div>

        <div className="space-y-4">
          {modules.map((m) => {
            const modPref = preferences[m.id] || {};
            const enabled = modPref.enabled !== false;
            const level = modPref.level || 'simple';

            return (
              <div key={m.id} className="card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{m.icon}</span>
                    <div>
                      <p className="font-bold text-slate-800">{m.name}</p>
                      <p className="text-xs text-slate-400">{m.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateModule(m.id, { enabled: !enabled })}
                    className={`w-12 h-7 rounded-full transition-colors relative ${enabled ? 'bg-brand-600' : 'bg-slate-200'}`}
                  >
                    <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${enabled ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                {enabled && (
                  <>
                    {m.questions.some((q) => q.level === 'detaille') && (
                      <div className="flex gap-2">
                        {['simple', 'detaille'].map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => updateModule(m.id, { level: lvl })}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                              level === lvl ? 'bg-brand-100 text-brand-700' : 'text-slate-400 hover:bg-slate-100'
                            }`}
                          >
                            {lvl === 'simple' ? 'Simple' : 'Détaillé'}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="grid sm:grid-cols-2 gap-2">
                      {m.questions
                        .filter((q) => q.level !== 'detaille' || level === 'detaille')
                        .map((q) => {
                          const qEnabled = modPref.questions?.[q.id]?.enabled !== false;
                          return (
                            <label key={q.id} className="flex items-center gap-2 text-sm text-slate-600">
                              <input
                                type="checkbox"
                                checked={qEnabled}
                                disabled={q.required}
                                onChange={(e) => toggleQuestion(m.id, q.id, e.target.checked)}
                                className="accent-brand-600"
                              />
                              {q.label}
                            </label>
                          );
                        })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="sticky bottom-16 sm:bottom-4 flex justify-center">
          <button onClick={save} className="btn-primary shadow-soft">
            {saved ? 'Enregistré ✓' : 'Enregistrer mes préférences'}
          </button>
        </div>
      </div>
    </Layout>
  );
}
