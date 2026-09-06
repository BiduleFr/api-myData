import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useAppearance } from '../context/AppearanceContext.jsx';
import { api } from '../lib/api';
import { applyModeOverride } from '../lib/questionFlow';
import { translateModuleName, translateQuestion } from '../lib/schemaTranslations.js';

const LEVELS = ['essentiel', 'detaille', 'avance'];
const LEVEL_LABELS = {
  simple: 'Essentiel',
  essentiel: 'Essentiel',
  detaille: 'Détaillé',
  avance: 'Avancé'
};

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
            const level = normalizeLevel(modPref.level || 'essentiel');
            const visibleQuestions = m.questions.filter((q) => levelAllowed(q.level, level));
            const enabledCount = visibleQuestions.filter((q) => modPref.questions?.[q.id]?.enabled !== false).length;

            return (
              <div key={m.id} className="card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{m.icon}</span>
                    <div>
                      <p className="font-bold text-slate-800">{translateModuleName(m.name, locale)}</p>
                      <p className="text-xs text-slate-400">{LEVEL_LABELS[level]} · {enabledCount} indicateurs actifs</p>
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
                            {LEVEL_LABELS[lvl]}
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
                          // (surcharges par mode). Aux niveaux supérieurs, les questions
                          // essentielles sont grisées car déjà incluses par défaut.
                          const displayQuestion = level === 'essentiel' ? applyModeOverride(q, 'rapide') : q;
                          const isEssentielLevel = normalizeLevel(q.level || 'essentiel') === 'essentiel';
                          const dimmed = isEssentielLevel && level !== 'essentiel';
                          const translated = translateQuestion(displayQuestion, locale);
                          const translatedDependsOn = dependsOn ? (translateQuestion(questionsById.get((q.when?.all || q.when?.any || (q.dependsOn ? [q.dependsOn] : []))[0]?.questionId) || {}, locale).label || dependsOn) : null;
                          return (
                            <label key={q.id} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 ${dependsOn ? 'ml-6 border-l-2 border-brand-200 bg-brand-50/50' : 'border border-slate-100'} ${dimmed ? 'opacity-50' : ''}`}>
                              <input
                                type="checkbox"
                                checked={qEnabled}
                                disabled={q.required}
                                onChange={(e) => toggleQuestion(m.id, q.id, e.target.checked)}
                                className="accent-brand-600"
                              />
                              <span className="flex min-w-0 flex-col">
                                <span>{dependsOn && <span className="mr-1 text-brand-600">↳</span>}{translated.label}</span>
                                {dimmed && <span className="text-xs text-slate-400">{locale === 'en' ? 'Included in Essential' : 'Incluse dans Essentiel'}</span>}
                                {translatedDependsOn && <span className="text-xs text-slate-400">{locale === 'en' ? 'Shown depending on:' : 'Affichée selon :'} {translatedDependsOn}</span>}
                              </span>
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
