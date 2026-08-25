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

export function buildQuestionFlow(modules, preferences, answers) {
  const steps = [];

  for (const mod of modules) {
    const modPref = preferences?.[mod.id];
    if (modPref?.enabled === false) continue;
    const level = normalizeLevel(modPref?.level || 'essentiel');

    for (const q of mod.questions) {
      const qLevel = normalizeLevel(q.level || 'essentiel');
      if ((LEVEL_ORDER[qLevel] ?? 0) > (LEVEL_ORDER[level] ?? 0)) continue;

      const qPref = modPref?.questions?.[q.id];
      if (qPref?.enabled === false) continue;

      if (q.dependsOn && !evaluateCondition({ ...q.dependsOn, op: q.dependsOn.op || 'eq' }, answers)) continue;
      if (q.when && !evaluateCondition(q.when, answers)) continue;

      steps.push({ ...q, moduleId: mod.id, moduleName: mod.name, moduleIcon: mod.icon });
    }
  }

  return steps;
}

export function moduleIsEnabled(preferences, moduleId) {
  return preferences?.[moduleId]?.enabled !== false;
}
