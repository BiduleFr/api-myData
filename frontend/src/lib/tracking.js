// Listes prédéfinies et génération des questions de suivi (habitudes / comportements).
// Les IDs techniques sont stables et ne doivent jamais dépendre du texte affiché.

export const HABITS = [
  { id: 'habit_exercise', label: 'Faire du sport', labelEn: 'Exercise', icon: '🏃' },
  { id: 'habit_walk', label: 'Marcher', labelEn: 'Walk', icon: '🚶' },
  { id: 'habit_hydration', label: "Boire suffisamment d'eau", labelEn: 'Drink enough water', icon: '💧' },
  { id: 'habit_reading', label: 'Lire', labelEn: 'Read', icon: '📖' },
  { id: 'habit_meditation', label: 'Méditer', labelEn: 'Meditate', icon: '🧘' },
  { id: 'habit_stretching', label: 'Faire des étirements', labelEn: 'Stretch', icon: '🤸' },
  { id: 'habit_bedtime_reasonable', label: 'Se coucher à une heure raisonnable', labelEn: 'Go to bed at a reasonable time', icon: '🌙' },
  { id: 'habit_wake_regular', label: 'Se lever à une heure régulière', labelEn: 'Wake up at a regular time', icon: '⏰' },
  { id: 'habit_fruits_veggies', label: 'Manger davantage de fruits et légumes', labelEn: 'Eat more fruit and vegetables', icon: '🥦' },
  { id: 'habit_breakfast', label: 'Prendre un petit-déjeuner', labelEn: 'Have breakfast', icon: '🥐' },
  { id: 'habit_cooking', label: 'Cuisiner', labelEn: 'Cook', icon: '🍳' },
  { id: 'habit_outdoors', label: 'Passer du temps dehors', labelEn: 'Spend time outdoors', icon: '🌳' },
  { id: 'habit_learning', label: 'Apprendre quelque chose', labelEn: 'Learn something new', icon: '🎓' },
  { id: 'habit_personal_project', label: 'Travailler sur un projet personnel', labelEn: 'Work on a personal project', icon: '🛠️' },
  { id: 'habit_writing', label: 'Écrire', labelEn: 'Write', icon: '✍️' },
  { id: 'habit_limit_social', label: 'Limiter les réseaux sociaux', labelEn: 'Limit social media', icon: '📵' },
  { id: 'habit_limit_screens', label: "Limiter le temps d'écran", labelEn: 'Limit screen time', icon: '🖥️' },
  { id: 'habit_no_smoking', label: 'Ne pas fumer', labelEn: 'Do not smoke', icon: '🚭' },
  { id: 'habit_limit_alcohol', label: "Limiter l'alcool", labelEn: 'Limit alcohol', icon: '🍷' },
  { id: 'habit_limit_sugar', label: 'Limiter les aliments très sucrés', labelEn: 'Limit very sugary food', icon: '🍬' },
  { id: 'habit_relaxing_activity', label: 'Faire une activité relaxante', labelEn: 'Do a relaxing activity', icon: '🛁' },
  { id: 'habit_time_loved_ones', label: 'Passer du temps avec ses proches', labelEn: 'Spend time with loved ones', icon: '❤️' }
];

export const BEHAVIORS = [
  { id: 'behavior_smoking', label: 'Fumer', labelEn: 'Smoking', icon: '🚬' },
  { id: 'behavior_alcohol', label: "Boire de l'alcool", labelEn: 'Drinking alcohol', icon: '🍺' },
  { id: 'behavior_sugary_food', label: 'Manger des aliments très sucrés', labelEn: 'Eating very sugary food', icon: '🍭' },
  { id: 'behavior_snacking', label: 'Grignoter', labelEn: 'Snacking', icon: '🍿' },
  { id: 'behavior_social_media', label: 'Passer beaucoup de temps sur les réseaux sociaux', labelEn: 'Spending a lot of time on social media', icon: '📱' },
  { id: 'behavior_phone_time', label: 'Passer beaucoup de temps sur son téléphone', labelEn: 'Spending a lot of time on their phone', icon: '📲' },
  { id: 'behavior_late_bedtime', label: 'Se coucher très tard', labelEn: 'Going to bed very late', icon: '🌃' },
  { id: 'behavior_procrastination', label: 'Procrastiner', labelEn: 'Procrastinating', icon: '⏳' },
  { id: 'behavior_impulse_buying', label: 'Acheter de manière impulsive', labelEn: 'Impulse buying', icon: '🛍️' },
  { id: 'behavior_anger', label: 'Se mettre en colère', labelEn: 'Getting angry', icon: '😠' },
  { id: 'behavior_avoid_task', label: 'Éviter une tâche importante', labelEn: 'Avoiding an important task', icon: '🙈' },
  { id: 'behavior_screen_time', label: 'Passer trop de temps devant des écrans', labelEn: 'Spending too much time in front of screens', icon: '📺' },
  { id: 'behavior_boredom_eating', label: 'Manger par ennui', labelEn: 'Eating out of boredom', icon: '🍩' }
];

export const TRACKING_KEY = '_tracking';

export function getTracking(preferences) {
  const raw = preferences?.[TRACKING_KEY] || {};
  return {
    habits: Array.isArray(raw.habits) ? raw.habits : [],
    behaviors: Array.isArray(raw.behaviors) ? raw.behaviors : []
  };
}

export function habitById(id) {
  return HABITS.find((habit) => habit.id === id);
}

export function behaviorById(id) {
  return BEHAVIORS.find((behavior) => behavior.id === id);
}

export function trackQuestionId(kind, itemId) {
  return `track_${kind}_${itemId}`;
}

export function itemLabel(item, locale) {
  return locale === 'en' ? (item?.labelEn || item?.label) : item?.label;
}

// Une habitude/comportement n'est interrogée qu'à partir du questionnaire suivant son activation.
function isDue(entry, date) {
  return entry.active !== false && entry.startDate && entry.startDate < date;
}

export function buildTrackingQuestions(preferences, { date, locale = 'fr', includeStartPrompts = true } = {}) {
  const tracking = getTracking(preferences);
  const questions = [];
  const moduleName = locale === 'en' ? 'Daily tracking' : 'Suivi du jour';

  for (const entry of tracking.habits.filter((item) => isDue(item, date))) {
    const habit = habitById(entry.id);
    if (!habit) continue;
    questions.push({
      id: trackQuestionId('habit', habit.id),
      type: 'boolean',
      level: 'essentiel',
      weight: 0,
      label: locale === 'en'
        ? `Did you keep up your habit today: ${habit.labelEn}?`
        : `Avez-vous fait votre habitude aujourd'hui : ${habit.label} ?`,
      moduleId: 'suivi',
      moduleName,
      moduleIcon: habit.icon || '🌱'
    });
  }

  for (const entry of tracking.behaviors.filter((item) => isDue(item, date))) {
    const behavior = behaviorById(entry.id);
    if (!behavior) continue;
    questions.push({
      id: trackQuestionId('behavior', behavior.id),
      type: 'boolean',
      level: 'essentiel',
      weight: 0,
      label: locale === 'en'
        ? `Did you engage in this behavior today: ${behavior.labelEn}?`
        : `Avez-vous eu ce comportement aujourd'hui : ${behavior.label} ?`,
      moduleId: 'suivi',
      moduleName,
      moduleIcon: behavior.icon || '🛡️'
    });
  }

  if (includeStartPrompts) {
    questions.push({
      id: 'tracking_start_habits',
      type: 'boolean',
      level: 'essentiel',
      weight: 0,
      label: locale === 'en' ? 'Would you like to start a new habit?' : 'Souhaitez-vous commencer une nouvelle habitude ?',
      moduleId: 'suivi',
      moduleName,
      moduleIcon: '🌱'
    });
    questions.push({
      id: 'tracking_start_behaviors',
      type: 'boolean',
      level: 'essentiel',
      weight: 0,
      label: locale === 'en' ? 'Would you like to start watching a behavior?' : 'Souhaitez-vous surveiller un comportement ?',
      moduleId: 'suivi',
      moduleName,
      moduleIcon: '🛡️'
    });
  }

  return questions;
}
