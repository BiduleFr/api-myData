// Construit la liste ordonnée des questions à poser selon la personnalisation
// utilisateur et des règles conditionnelles plus expressives.
const LEVEL_ORDER = {
  simple: 0,
  essentiel: 0,
  detaille: 1,
  avance: 2
};

function normalizeLevel(level) {
  if (!level) return 'essentiel';
  if (level === 'simple') return 'essentiel';
  return level;
}

function compare(op, actual, expected) {
  switch (op) {
    case 'eq': return actual === expected;
    case 'neq': return actual !== expected;
    case 'gt': return Number(actual) > Number(expected);
    case 'gte': return Number(actual) >= Number(expected);
    case 'lt': return Number(actual) < Number(expected);
    case 'lte': return Number(actual) <= Number(expected);
    case 'includes': return Array.isArray(actual) && actual.includes(expected);
    case 'exists': return actual !== undefined && actual !== null && actual !== '';
    default: return actual === expected;
  }
}

function evaluateCondition(rule, answers) {
  if (!rule) return true;
  if (rule.all) return rule.all.every((r) => evaluateCondition(r, answers));
  if (rule.any) return rule.any.some((r) => evaluateCondition(r, answers));
  if (rule.not) return !evaluateCondition(rule.not, answers);

  const value = answers?.[rule.questionId];
  return compare(rule.op || 'eq', value, rule.value);
}

export function applyModeOverride(question, mode) {
  const override = question.modeOverrides?.[mode];
  if (!override) return question;
  return {
    ...question,
    ...override,
    config: { ...question.config, ...override.config }
  };
}

export function buildQuestionFlow(modules, preferences, answers, options = {}) {
  const steps = [];
  const { levelOverride, onlyModuleId, moduleLevelOverrides, moduleModes } = options;

  for (const mod of modules) {
    if (onlyModuleId && mod.id !== onlyModuleId) continue;
    const modPref = preferences?.[mod.id];
    if (modPref?.enabled === false) continue;
    const hasLockedMode = Object.hasOwn(moduleModes || {}, mod.id);
    const lockedMode = moduleModes?.[mod.id];
    // Le niveau choisi au lancement du questionnaire (rapide/intermédiaire/long)
    // prime toujours. La préférence personnalisée du module ne s'applique QUE
    // lorsque le mode choisi est l'intermédiaire (standard) — pas de niveau forcé.
    const hasExplicitMode = levelOverride !== null && levelOverride !== undefined;
    let level;
    if (hasLockedMode && lockedMode !== 'standard') {
      level = normalizeLevel(moduleLevelOverrides?.[mod.id]);
    } else if (hasLockedMode && lockedMode === 'standard') {
      // Mode intermédiaire verrouillé : respecte la préférence personnalisée du module.
      level = normalizeLevel(modPref?.level || 'essentiel');
    } else if (hasExplicitMode) {
      level = normalizeLevel(levelOverride);
    } else {
      level = normalizeLevel(modPref?.level || 'essentiel');
    }

    for (const q of mod.questions) {
      const qLevel = normalizeLevel(q.level || 'essentiel');
      if ((LEVEL_ORDER[qLevel] ?? 0) > (LEVEL_ORDER[level] ?? 0)) continue;

      const qPref = modPref?.questions?.[q.id];
      if (qPref?.enabled === false) continue;

      // Fréquence hebdomadaire : la question n'apparaît qu'en début de semaine
      // (lundi) ou tant qu'elle n'a pas encore été répondue cette semaine.
      if (q.frequency === 'weekly' && options.date) {
        const d = new Date(`${options.date}T00:00:00`);
        const day = d.getDay(); // 0 = dimanche, 1 = lundi
        const isWeekStart = day === 1;
        const alreadyAnsweredThisWeek = answers?.[q.id] !== undefined && answers?.[q.id] !== null;
        if (!isWeekStart && !alreadyAnsweredThisWeek) continue;
      }

      if (q.dependsOn && !evaluateCondition({ ...q.dependsOn, op: q.dependsOn.op || 'eq' }, answers)) continue;
      if (q.when && !evaluateCondition(q.when, answers)) continue;

      const question = applyModeOverride(q, moduleModes?.[mod.id] ?? options.mode);
      steps.push({ ...question, moduleId: mod.id, moduleName: mod.name, moduleIcon: mod.icon });
    }
  }

  return steps;
}

export function moduleIsEnabled(preferences, moduleId) {
  return preferences?.[moduleId]?.enabled !== false;
}
