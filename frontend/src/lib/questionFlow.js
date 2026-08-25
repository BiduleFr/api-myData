// Construit la liste ordonnée des questions à poser, en tenant compte des
// préférences utilisateur (modules/questions activés, niveau simple/détaillé)
// et des dépendances entre questions (ex: pas de durée de sport si pas de sport).
export function buildQuestionFlow(modules, preferences, answers) {
  const steps = [];

  for (const mod of modules) {
    const modPref = preferences?.[mod.id];
    if (modPref?.enabled === false) continue;
    const level = modPref?.level || 'simple';

    for (const q of mod.questions) {
      if (q.level === 'detaille' && level !== 'detaille') continue;

      const qPref = modPref?.questions?.[q.id];
      if (qPref?.enabled === false) continue;

      if (q.dependsOn) {
        const depValue = answers?.[q.dependsOn.questionId];
        if (depValue !== q.dependsOn.value) continue;
      }

      steps.push({ ...q, moduleId: mod.id, moduleName: mod.name, moduleIcon: mod.icon });
    }
  }

  return steps;
}

export function moduleIsEnabled(preferences, moduleId) {
  return preferences?.[moduleId]?.enabled !== false;
}
