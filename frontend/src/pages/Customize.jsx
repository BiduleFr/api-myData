import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useAppearance } from '../context/AppearanceContext.jsx';
import { api } from '../lib/api';
import { applyModeOverride } from '../lib/questionFlow';
import { translateModuleName, translateQuestion } from '../lib/schemaTranslations.js';
import { TRACKING_KEY, getTracking, buildTrackingQuestions } from '../lib/tracking';

const LEVELS = ['essentiel', 'detaille', 'avance'];
const LEVEL_LABELS_FR = {
  simple: 'Rapide',
  essentiel: 'Rapide',
  detaille: 'Intermédiaire',
  avance: 'Long'
};
const LEVEL_LABELS_EN = {
  simple: 'Quick',
  essentiel: 'Quick',
  detaille: 'Medium',
  avance: 'Long'
};
function levelLabel(level, locale) {
  return (locale === 'en' ? LEVEL_LABELS_EN : LEVEL_LABELS_FR)[level];
}

function normalizeLevel(level) {
  if (!level || level === 'simple') return 'essentiel';
  return level;
}

function levelAllowed(questionLevel, selectedLevel) {
  const order = { essentiel: 0, detaille: 1, avance: 2 };
  return order[normalizeLevel(questionLevel || 'essentiel')] <= order[normalizeLevel(selectedLevel)];
}

function dependencyLabel(question, questionsById) {
  const rules = question.when?.all || question.when?.any || (question.dependsOn ? [question.dependsOn] : []);
  if (!rules.length) return null;
  const parent = questionsById.get(rules[0].questionId);
  return parent?.label || 'une réponse précédente';
}

// Une question est non désactivable si elle fait partie du niveau Essentiel,
// ou si sa question parente fait partie du niveau Essentiel.
function isEssentialChain(question, questionsById) {
  if (normalizeLevel(question.level || 'essentiel') === 'essentiel') return true;
  const rules = question.when?.all || question.when?.any || (question.dependsOn ? [question.dependsOn] : []);
  for (const rule of rules) {
    const parent = questionsById.get(rule.questionId);
    if (parent && isEssentialChain(parent, questionsById)) return true;
  }
  return false;
}

// Carte listant les questions de suivi générées par les habitudes/comportements actifs.
function TrackingQuestionsCard({ preferences, locale, onToggleQuestion }) {
  const tracking = getTracking(preferences);
  const activeHabits = tracking.habits.filter((item) => item.active !== false);
  const activeBehaviors = tracking.behaviors.filter((item) => item.active !== false);
  const total = activeHabits.length + activeBehaviors.length;
  const questions = buildTrackingQuestions(preferences, { date: '2999-12-31', locale });

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌱</span>
          <div>
            <p className="font-bold text-slate-800">{locale === 'en' ? 'Daily tracking' : 'Suivi du jour'}</p>
            <p className="text-xs text-slate-400">
              {locale === 'en'
                ? `${total} tracking question${total === 1 ? '' : 's'} added to the questionnaire`
                : `${total} question${total === 1 ? '' : 's'} de suivi ajoutée${total === 1 ? '' : 's'} au questionnaire`}
            </p>
          </div>
        </div>
      </div>
      {total === 0 ? (
        <p className="text-sm text-slate-400">
          {locale === 'en'
            ? 'No active habit or behavior. Add them from the Tracking tab.'
            : 'Aucune habitude ni comportement actif. Ajoutez-les depuis l’onglet Suivi.'}
        </p>
      ) : (
        <div className="space-y-2">
          {questions.map((q) => {
            const qEnabled = preferences[TRACKING_KEY]?.questions?.[q.id]?.enabled !== false;
            return (
              <label key={q.id} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 border border-slate-100">
                <input
                  type="checkbox"
                  checked={qEnabled}
                  onChange={(e) => onToggleQuestion(TRACKING_KEY, q.id, e.target.checked)}
                  className="accent-brand-600"
                />
                <span>{q.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Customize() {
  const { token } = useAuth();
  const { locale } = useAppearance();
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
        <div className="animate-pulse text-slate-400 text-center py-20">{locale === 'en' ? 'Loading…' : 'Chargement…'}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-up">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">{locale === 'en' ? 'Customize my tracking' : 'Personnaliser mon suivi'}</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {locale === 'en'
              ? 'Set up your preferences once, then enjoy a simple daily questionnaire.'
              : 'Configurez une fois vos préférences, profitez ensuite d’un questionnaire quotidien simple.'}
          </p>
        </div>

        <div className="space-y-4">
          {modules.flatMap((m) => {
            const cards = [];
            const modPref = preferences[m.id] || {};
            const enabled = modPref.enabled !== false;
            const level = normalizeLevel(modPref.level || 'essentiel');
            const visibleQuestions = m.questions.filter((q) => levelAllowed(q.level, level));
            const enabledCount = visibleQuestions.filter((q) => modPref.questions?.[q.id]?.enabled !== false).length;

            const moduleCard = (
              <div key={m.id} className="card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{m.icon}</span>
                    <div>
                      <p className="font-bold text-slate-800">{translateModuleName(m.name, locale)}</p>
                      <p className="text-xs text-slate-400">{levelLabel(level, locale)} · {enabledCount} {locale === 'en' ? 'active indicators' : 'indicateurs actifs'}</p>
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
                    {m.questions.length > 0 && (
                      <div className="flex gap-2">
                        {LEVELS.map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => updateModule(m.id, { level: lvl })}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                              level === lvl ? 'bg-brand-100 text-brand-700' : 'text-slate-400 hover:bg-slate-100'
                            }`}
                          >
                            {levelLabel(lvl, locale)}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="space-y-2">
                      {m.questions
                        .filter((q) => levelAllowed(q.level, level))
                        .map((q) => {
                          const qEnabled = modPref.questions?.[q.id]?.enabled !== false;
                          const questionsById = new Map(m.questions.map((question) => [question.id, question]));
                          const dependsOn = dependencyLabel(q, questionsById);
                          // Au niveau Essentiel, on affiche l'ébauche du questionnaire rapide
                          // (surcharges par mode). Ce qui est dans Essentiel est non désactivable,
// y compris les sous-questions dont la question générale est essentielle.
                          const displayQuestion = level === 'essentiel' ? applyModeOverride(q, 'rapide') : q;
                          const locked = isEssentialChain(q, questionsById) || q.required;
                          const translated = translateQuestion(displayQuestion, locale);
                          return (
                            <label key={q.id} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 ${dependsOn ? 'ml-6 border-l-2 border-brand-200 bg-brand-50/50' : 'border border-slate-100'}`}>
                              <input
                                type="checkbox"
                                checked={qEnabled}
                                disabled={locked}
                                onChange={(e) => toggleQuestion(m.id, q.id, e.target.checked)}
                                className="accent-brand-600"
                              />
                              <span className="flex min-w-0 flex-col">
                                <span>{dependsOn && <span className="mr-1 text-brand-600">↳</span>}{translated.label}</span>
                                {locked && <span className="text-xs text-brand-600 font-semibold">{locale === 'en' ? 'Always included' : 'Toujours incluse'}</span>}
                                {q.frequency === 'weekly' && <span className="text-xs text-slate-400">{locale === 'en' ? 'Asked once a week (Mondays)' : 'Posée une fois par semaine (le lundi)'}</span>}
                              </span>
                            </label>
                          );
                        })}
                    </div>
                  </>
                )}
              </div>
            );

            cards.push(moduleCard);
            // La carte Suivi du jour se place juste après le bloc Argent.
            if (m.id === 'argent') {
              cards.push(
                <TrackingQuestionsCard
                  key="_tracking_card"
                  preferences={preferences}
                  locale={locale}
                  onToggleQuestion={toggleQuestion}
                />
              );
            }
            return cards;
          })}
        </div>

        <div className="sticky bottom-16 sm:bottom-4 flex justify-center">
          <button onClick={save} className="btn-primary shadow-soft">
            {saved ? (locale === 'en' ? 'Saved ✓' : 'Enregistré ✓') : (locale === 'en' ? 'Save my preferences' : 'Enregistrer mes préférences')}
          </button>
        </div>
      </div>
    </Layout>
  );
}
