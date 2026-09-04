import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import QuestionRenderer from '../components/questions/QuestionRenderer.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api, todayISO } from '../lib/api';
import { buildQuestionFlow } from '../lib/questionFlow';
import { EDITABLE_WINDOW_DAYS, daysBetween } from '../lib/editableWindow';

const CONTEXT_KEY = '_contexte_journee';
// Types dont une seule interaction (clic) suffit à donner une réponse définitive.
const AUTO_ADVANCE_TYPES = new Set(['boolean', 'choice', 'quickstep']);

const CONTEXT_OPTIONS = [
  { value: 'normale', label: 'Journée normale', icon: '🙂' },
  { value: 'repos', label: 'Journée de repos', icon: '🛋️' },
  { value: 'voyage', label: 'Voyage', icon: '✈️' },
  { value: 'malade', label: 'Malade', icon: '🤒' },
  { value: 'evenement_pro', label: 'Événement professionnel', icon: '💼' },
  { value: 'manque_sommeil', label: 'Manque de sommeil exceptionnel', icon: '😴' },
  { value: 'autre', label: 'Autre', icon: '✨' }
];

const MODE_LEVEL = {
  rapide: 'essentiel',
  standard: null,
  approfondi: 'avance'
};

const MODES = [
  { value: 'rapide', label: 'Rapide', hint: '~1-2 min', icon: '⚡' },
  { value: 'standard', label: 'Intermédiaire', hint: 'votre sélection habituelle', icon: '🙂' },
  { value: 'approfondi', label: 'Long', hint: 'toutes les questions', icon: '🔍' }
];

function moduleStatus(mod, preferences, answers) {
  const questions = buildQuestionFlow([mod], preferences, answers);
  if (questions.length === 0) return { total: 0, answered: 0, status: 'disabled' };
  const answered = questions.filter((q) => answers[q.id] !== undefined && answers[q.id] !== null).length;
  const status = answered === 0 ? 'not_started' : answered === questions.length ? 'done' : 'partial';
  return { total: questions.length, answered, status };
}

const STATUS_DOT = { not_started: 'bg-slate-200', partial: 'bg-amber-400', done: 'bg-emerald-500', disabled: 'bg-slate-100' };
const STATUS_LABEL = { not_started: 'Non commencé', partial: 'En cours', done: 'Terminé', disabled: 'Désactivé' };

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
  const [mode, setMode] = useState('standard');
  const saveTimer = useRef(null);
  const autoAdvanceTimer = useRef(null);

  const clearAutoAdvance = useCallback(() => clearTimeout(autoAdvanceTimer.current), []);
  useEffect(() => () => clearAutoAdvance(), [clearAutoAdvance]);

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
        else setPhase(alreadyStarted ? 'flow' : 'overview');
      })
      .finally(() => setLoading(false));
  }, [token, date, withinWindow]);

  const flow = useMemo(
    () => buildQuestionFlow(modules, preferences, answers, { levelOverride: MODE_LEVEL[mode], mode }),
    [modules, preferences, answers, mode]
  );
  const current = flow[Math.min(index, flow.length - 1)];

  useEffect(() => {
    if (flow.length && index >= flow.length) setIndex(flow.length - 1);
  }, [flow.length, index]);

  function changeMode(nextMode) {
    clearAutoAdvance();
    const currentQuestionId = current?.id;
    setMode(nextMode);
    const nextFlow = buildQuestionFlow(modules, preferences, answers, { levelOverride: MODE_LEVEL[nextMode], mode: nextMode });
    const nextIndex = nextFlow.findIndex((question) => question.id === currentQuestionId);
    if (nextIndex >= 0) setIndex(nextIndex);
    else setIndex(Math.min(index, Math.max(0, nextFlow.length - 1)));
  }

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

    clearAutoAdvance();
    if (AUTO_ADVANCE_TYPES.has(current.type)) {
      const nextFlow = buildQuestionFlow(modules, preferences, next, { levelOverride: MODE_LEVEL[mode], mode });
      const currentIndex = nextFlow.findIndex((q) => q.id === current.id);
      if (currentIndex >= 0 && currentIndex < nextFlow.length - 1) {
        autoAdvanceTimer.current = setTimeout(() => setIndex(currentIndex + 1), 280);
      }
    }
  }

  function saveDefaultAnswer(question) {
    if (answers[question.id] !== undefined || question.config?.defaultValue === undefined) return;
    const nextAnswers = { ...answers, [question.id]: question.config.defaultValue };
    const nextStates = { ...answerStates, [question.id]: 'answered' };
    setAnswers(nextAnswers);
    setAnswerStates(nextStates);
    scheduleAutosave(nextAnswers, journalEntry, nextStates);
  }

  function chooseContext(value) {
    const next = { ...answers, [CONTEXT_KEY]: value };
    const nextStates = { ...answerStates, [CONTEXT_KEY]: 'answered' };
    setAnswers(next);
    setAnswerStates(nextStates);
    scheduleAutosave(next, journalEntry, nextStates);
  }

  function jumpToModule(moduleId) {
    clearAutoAdvance();
    const target = flow.findIndex((step) => step.moduleId === moduleId);
    setIndex(target >= 0 ? target : 0);
    setPhase('flow');
  }

  function startFromBeginning() {
    clearAutoAdvance();
    setIndex(0);
    setPhase('flow');
  }

  function handleJournal(value) {
    setJournalEntry(value);
    scheduleAutosave(answers, value, answerStates);
  }

  function goNext() {
    clearAutoAdvance();
    saveDefaultAnswer(current);
    if (index < flow.length - 1) setIndex(index + 1);
  }
  function goBack() {
    clearAutoAdvance();
    if (index > 0) setIndex(index - 1);
    else setPhase('overview');
  }

  async function finish() {
    setSaving(true);
    const finalAnswers = current?.config?.defaultValue !== undefined && answers[current.id] === undefined
      ? { ...answers, [current.id]: current.config.defaultValue }
      : answers;
    const finalAnswerStates = current?.config?.defaultValue !== undefined && answerStates[current.id] === undefined
      ? { ...answerStates, [current.id]: 'answered' }
      : answerStates;
    const entry = await api.saveEntry({ date, answers: finalAnswers, answerStates: finalAnswerStates, journalEntry, completionStatus: 'complete' }, token);
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

  if (phase === 'overview') {
    const currentContext = answers[CONTEXT_KEY];
    return (
      <Layout>
        <div className="max-w-lg mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Comment voulez-vous faire aujourd'hui ?</h1>
            <p className="text-sm text-slate-400 mt-2">Choisissez un niveau, puis commencez ou allez directement à un thème.</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => setMode(m.value)}
                className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-3 border transition-all ${
                  mode === m.value ? 'bg-brand-600 text-white border-brand-600' : 'bg-white border-slate-200 hover:border-brand-300'
                }`}
              >
                <span className="text-xl">{m.icon}</span>
                <span className="text-xs font-bold">{m.label}</span>
                <span className={`text-[10px] ${mode === m.value ? 'text-white/80' : 'text-slate-400'}`}>{m.hint}</span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {modules.map((mod) => {
              const modPref = preferences[mod.id];
              if (modPref?.enabled === false) return null;
              const { total, answered, status } = moduleStatus(mod, preferences, answers);
              if (total === 0) return null;
              return (
                <button
                  key={mod.id}
                  onClick={() => jumpToModule(mod.id)}
                  className="w-full flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 hover:border-brand-300 hover:bg-brand-50 transition-all"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{mod.icon}</span>
                    <span className="text-sm font-semibold text-slate-700">{mod.name}</span>
                  </span>
                  <span className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{answered}/{total}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[status]}`} title={STATUS_LABEL[status]} />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            <p className="text-xs text-slate-400 text-center">Une chose à signaler pour aujourd'hui ? (facultatif)</p>
            <div className="flex flex-wrap justify-center gap-2">
              {CONTEXT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => chooseContext(opt.value)}
                  className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs border transition-all ${
                    currentContext === opt.value ? 'bg-brand-600 text-white border-brand-600' : 'bg-white border-slate-200 hover:border-brand-300'
                  }`}
                >
                  <span>{opt.icon}</span> {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={startFromBeginning} className="btn-primary w-full justify-center">
            Commencer
          </button>
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
            <button onClick={() => setPhase('overview')} className="btn-ghost">← Retour</button>
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
  const currentValue = current.id === 'bilan_journal' ? journalEntry : answers[current.id];
  const hasDefaultValue = current.config?.defaultValue !== undefined;
  const canGoNext = true;

  return (
    <Layout>
      <div className="max-w-lg mx-auto space-y-8 pb-24">
        {forceEdit && (
          <div className="text-center text-xs text-amber-600 bg-amber-50 rounded-xl py-2 px-3">
            Modification d'une journée ancienne ({date})
          </div>
        )}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <button onClick={() => setPhase('overview')} className="hover:text-brand-600">{current.moduleIcon} {current.moduleName} · Vue d'ensemble</button>
            <span>{index + 1} / {flow.length}</span>
          </div>
          <ProgressBar current={index + 1} total={flow.length} />
        </div>

        <div className="grid grid-cols-3 gap-2" aria-label="Mode du questionnaire">
          {MODES.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => changeMode(option.value)}
              className={`rounded-lg border px-2 py-2 text-xs font-semibold transition-colors ${
                mode === option.value ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div key={current.id} className="animate-fade-up text-center space-y-8">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{current.label}</h1>
          <QuestionRenderer question={current} value={currentValue} onChange={current.id === 'bilan_journal' ? handleJournal : handleAnswer} />
          {current.help && current.type !== 'text' && <p className="mx-auto max-w-md text-sm text-slate-500">{current.help}</p>}
        </div>

        <div className="pointer-events-none fixed inset-x-5 bottom-36 z-20 mx-auto flex max-w-lg items-center justify-between px-1 py-2 sm:bottom-28">
          <button onClick={goBack} className="btn-ghost pointer-events-auto">← Retour</button>
          <span className="text-xs text-slate-300">{saving ? 'Enregistrement…' : 'Enregistré'}</span>
          {isLast ? (
            <button onClick={finish} disabled={!canGoNext} className="btn-primary pointer-events-auto">Enregistrer ma journée</button>
          ) : (
            <button onClick={goNext} disabled={!canGoNext} className="btn-primary pointer-events-auto">Suivant →</button>
          )}
        </div>
      </div>
    </Layout>
  );
}
