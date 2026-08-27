import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import QuestionRenderer from '../components/questions/QuestionRenderer.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api, todayISO } from '../lib/api';
import { buildQuestionFlow } from '../lib/questionFlow';

const EDITABLE_WINDOW_DAYS = 14;
const CONTEXT_KEY = '_contexte_journee';

const CONTEXT_OPTIONS = [
  { value: 'normale', label: 'Journée normale', icon: '🙂' },
  { value: 'repos', label: 'Journée de repos', icon: '🛋️' },
  { value: 'voyage', label: 'Voyage', icon: '✈️' },
  { value: 'malade', label: 'Malade', icon: '🤒' },
  { value: 'evenement_pro', label: 'Événement professionnel', icon: '💼' },
  { value: 'manque_sommeil', label: 'Manque de sommeil exceptionnel', icon: '😴' },
  { value: 'autre', label: 'Autre', icon: '✨' }
];

function daysBetween(dateA, dateB) {
  const a = new Date(`${dateA}T00:00:00`);
  const b = new Date(`${dateB}T00:00:00`);
  return Math.round((a - b) / 86400000);
}

export default function Questionnaire() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date') || todayISO();
  const today = todayISO();
  const diffDays = daysBetween(today, date);
  const withinWindow = diffDays >= 0 && diffDays <= EDITABLE_WINDOW_DAYS;

  const [modules, setModules] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [answers, setAnswers] = useState({});
  const [answerStates, setAnswerStates] = useState({});
  const [journalEntry, setJournalEntry] = useState('');
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [phase, setPhase] = useState('loading');
  const [forceEdit, setForceEdit] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getConfig(), api.getPreferences(token), api.getEntry(date, token)])
      .then(([cfg, prefs, entry]) => {
        setModules(cfg.modules);
        setPreferences(prefs.modules || {});
        setAnswers(entry.answers || {});
        setAnswerStates(entry.answerStates || {});
        setJournalEntry(entry.journalEntry || '');
        const alreadyStarted = entry.completionStatus && entry.completionStatus !== 'not_started';
        if (!withinWindow) setPhase('readonly');
        else setPhase(alreadyStarted ? 'flow' : 'context');
      })
      .finally(() => setLoading(false));
  }, [token, date, withinWindow]);

  const flow = useMemo(() => buildQuestionFlow(modules, preferences, answers), [modules, preferences, answers]);
  const current = flow[Math.min(index, flow.length - 1)];

  const scheduleAutosave = useCallback((nextAnswers, nextJournal = journalEntry, nextStates = answerStates) => {
    setSaving(true);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      api.saveEntry({ date, answers: nextAnswers, answerStates: nextStates, journalEntry: nextJournal, completionStatus: 'draft' }, token)
        .finally(() => setSaving(false));
    }, 500);
  }, [token, date, journalEntry, answerStates]);

  function handleAnswer(value) {
    const next = { ...answers, [current.id]: value };
    const nextStates = { ...answerStates, [current.id]: value === null ? 'declined' : 'answered' };
    setAnswers(next);
    setAnswerStates(nextStates);
    scheduleAutosave(next, journalEntry, nextStates);
  }

  function chooseContext(value) {
    const next = { ...answers, [CONTEXT_KEY]: value };
    const nextStates = { ...answerStates, [CONTEXT_KEY]: 'answered' };
    setAnswers(next);
    setAnswerStates(nextStates);
    scheduleAutosave(next, journalEntry, nextStates);
    setPhase('flow');
  }

  function handleJournal(value) {
    setJournalEntry(value);
    scheduleAutosave(answers, value, answerStates);
  }

  function goNext() {
    if (index < flow.length - 1) setIndex(index + 1);
  }
  function goBack() {
    if (index > 0) setIndex(index - 1);
  }

  async function finish() {
    setSaving(true);
    const entry = await api.saveEntry({ date, answers, answerStates, journalEntry, completionStatus: 'complete' }, token);
    setSaving(false);
    setResult(entry);
    setPhase('result');
  }

  if (loading || phase === 'loading') {
    return (
      <Layout>
        <div className="animate-pulse text-slate-400 text-center py-20">Préparation de votre bilan…</div>
      </Layout>
    );
  }

  if (phase === 'readonly') {
    return (
      <Layout>
        <div className="max-w-lg mx-auto space-y-6 text-center py-10">
          <span className="text-4xl">🔒</span>
          <h1 className="text-xl font-bold text-slate-800">Journée du {date}</h1>
          <p className="text-sm text-slate-400">
            Cette journée date de plus de {EDITABLE_WINDOW_DAYS} jours. Elle est en lecture seule pour préserver la fiabilité de vos statistiques.
          </p>
          <div className="card p-5 text-left space-y-2">
            {modules.filter((m) => answers && Object.keys(answers).some((k) => m.questions.some((q) => q.id === k))).map((m) => (
              <div key={m.id} className="text-sm text-slate-500">{m.icon} {m.name}</div>
            ))}
            {Object.keys(answers).length === 0 && <p className="text-sm text-slate-400">Aucune réponse enregistrée.</p>}
          </div>
          <div className="flex justify-center gap-3">
            <button onClick={() => navigate('/statistiques')} className="btn-secondary">Voir les statistiques</button>
            <button onClick={() => { setForceEdit(true); setPhase('flow'); }} className="btn-ghost text-sm">Modifier quand même</button>
          </div>
        </div>
      </Layout>
    );
  }

  if (phase === 'context') {
    return (
      <Layout>
        <div className="max-w-lg mx-auto space-y-8 text-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Une chose à signaler pour aujourd'hui ?</h1>
            <p className="text-sm text-slate-400 mt-2">Cela aide à mieux interpréter vos données plus tard. Facultatif.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CONTEXT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => chooseContext(opt.value)}
                className="flex flex-col items-center gap-2 rounded-2xl px-4 py-4 border border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50 transition-all"
              >
                <span className="text-2xl">{opt.icon}</span>
                <span className="text-xs font-semibold">{opt.label}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setPhase('flow')} className="btn-ghost text-sm">Passer</button>
        </div>
      </Layout>
    );
  }

  if (phase === 'result') {
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

  if (phase === 'journal') {
    return (
      <Layout>
        <div className="max-w-lg mx-auto space-y-8 text-center">
          <div>
            <p className="text-sm text-brand-600 font-semibold">Dernière étape · facultative</p>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">Qu'est-ce que vous voulez retenir de cette journée ?</h1>
            <p className="text-sm text-slate-400 mt-2">Quelques mots suffisent. Cette note ne modifie pas votre score.</p>
          </div>
          <textarea
            value={journalEntry}
            onChange={(e) => handleJournal(e.target.value)}
            placeholder="Un moment, une pensée, une réussite…"
            rows={6}
            className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-base text-left focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
          />
          <div className="flex items-center justify-between">
            <button onClick={() => setPhase('flow')} className="btn-ghost">← Retour</button>
            <button onClick={finish} className="btn-primary">Enregistrer ma journée ✓</button>
          </div>
          <button onClick={finish} className="btn-ghost text-sm">Passer le journal</button>
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
        {forceEdit && (
          <div className="text-center text-xs text-amber-600 bg-amber-50 rounded-xl py-2 px-3">
            Modification d'une journée ancienne ({date})
          </div>
        )}
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
            <button onClick={() => setPhase('journal')} className="btn-primary">Continuer →</button>
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
