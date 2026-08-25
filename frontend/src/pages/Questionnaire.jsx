import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import QuestionRenderer from '../components/questions/QuestionRenderer.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api, todayISO } from '../lib/api';
import { buildQuestionFlow } from '../lib/questionFlow';

export default function Questionnaire() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [answers, setAnswers] = useState({});
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const saveTimer = useRef(null);

  useEffect(() => {
    const date = todayISO();
    Promise.all([api.getConfig(), api.getPreferences(token), api.getEntry(date, token)])
      .then(([cfg, prefs, entry]) => {
        setModules(cfg.modules);
        setPreferences(prefs.modules || {});
        setAnswers(entry.answers || {});
      })
      .finally(() => setLoading(false));
  }, [token]);

  const flow = useMemo(() => buildQuestionFlow(modules, preferences, answers), [modules, preferences, answers]);
  const current = flow[Math.min(index, flow.length - 1)];

  const scheduleAutosave = useCallback((nextAnswers) => {
    setSaving(true);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      api.saveEntry({ date: todayISO(), answers: nextAnswers, completionStatus: 'draft' }, token)
        .finally(() => setSaving(false));
    }, 500);
  }, [token]);

  function handleAnswer(value) {
    const next = { ...answers, [current.id]: value };
    setAnswers(next);
    scheduleAutosave(next);
  }

  function goNext() {
    if (index < flow.length - 1) setIndex(index + 1);
  }
  function goBack() {
    if (index > 0) setIndex(index - 1);
  }

  async function finish() {
    setSaving(true);
    const entry = await api.saveEntry({ date: todayISO(), answers, completionStatus: 'complete' }, token);
    setSaving(false);
    setResult(entry);
  }

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse text-slate-400 text-center py-20">Préparation de votre bilan…</div>
      </Layout>
    );
  }

  if (result) {
    return (
      <Layout>
        <div className="animate-pop max-w-md mx-auto text-center py-10 space-y-6">
          <span className="text-5xl">✅</span>
          <h1 className="text-2xl font-extrabold text-slate-800">Votre journée est enregistrée</h1>
          <p className="text-5xl font-extrabold text-brand-700">{result.globalScore ?? '–'}<span className="text-lg text-slate-400">/100</span></p>
          <div className="card p-5 text-left space-y-2">
            {modules.filter((m) => result.moduleScores[m.id] !== undefined).map((m) => (
              <div key={m.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{m.icon} {m.name}</span>
                <span className="font-bold text-slate-800">{result.moduleScores[m.id]}</span>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/')} className="btn-primary">Retour à l’accueil</button>
        </div>
      </Layout>
    );
  }

  if (!current) {
    return (
      <Layout>
        <div className="text-center py-20 space-y-4">
          <p className="text-slate-400">Aucune question activée pour le moment.</p>
          <button onClick={() => navigate('/personnaliser')} className="btn-secondary">Personnaliser mon suivi</button>
        </div>
      </Layout>
    );
  }

  const isLast = index === flow.length - 1;
  const canGoNext = !current.required || answers[current.id] !== undefined;

  return (
    <Layout>
      <div className="max-w-lg mx-auto space-y-8">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{current.moduleIcon} {current.moduleName}</span>
            <span>{index + 1} / {flow.length}</span>
          </div>
          <ProgressBar current={index + 1} total={flow.length} />
        </div>

        <div key={current.id} className="animate-fade-up text-center space-y-8">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{current.label}</h1>
          <QuestionRenderer question={current} value={answers[current.id]} onChange={handleAnswer} />
        </div>

        <div className="flex items-center justify-between pt-4">
          <button onClick={goBack} disabled={index === 0} className="btn-ghost">← Retour</button>
          <span className="text-xs text-slate-300">{saving ? 'Enregistrement…' : 'Enregistré'}</span>
          {isLast ? (
            <button onClick={finish} className="btn-primary">Terminer ✓</button>
          ) : (
            <button onClick={goNext} disabled={!canGoNext} className="btn-primary">Suivant →</button>
          )}
        </div>

        <div className="text-center">
          <button onClick={() => navigate('/')} className="btn-ghost text-sm">Quitter et reprendre plus tard</button>
        </div>
      </div>
    </Layout>
  );
}
