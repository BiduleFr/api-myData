// Configuration déclarative des modules et questions du questionnaire quotidien.
// Ajouter une question ou un module = ajouter une entrée ici, sans toucher au reste de l'app.
const MODULES = [
  {
    id: 'sommeil',
    name: 'Sommeil',
    icon: '🌙',
    description: 'Votre nuit et votre récupération',
    weight: 0.25,
    questions: [
      {
        id: 'sommeil_duree', type: 'slider', level: 'simple', required: true, weight: 1.5,
        label: 'Combien de temps avez-vous dormi ?',
        config: { min: 0, max: 12, step: 0.5, unit: 'h', targetMin: 7, targetMax: 9 }
      },
      {
        id: 'sommeil_qualite', type: 'scale', level: 'simple', required: true, weight: 1.5,
        label: 'Comment était la qualité de votre sommeil ?',
        config: { min: 1, max: 5, emojis: ['😫', '😕', '😐', '🙂', '😄'] }
      },
      {
        id: 'sommeil_recuperation', type: 'scale', level: 'simple', weight: 1,
        label: 'Vous sentez-vous récupéré(e) ?',
        config: { min: 1, max: 5, emojis: ['😩', '😕', '😐', '🙂', '💪'] }
      },
      {
        id: 'sommeil_coucher', type: 'time', level: 'detaille', weight: 0,
        label: 'À quelle heure vous êtes-vous couché(e) ?'
      },
      {
        id: 'sommeil_reveil', type: 'time', level: 'detaille', weight: 0,
        label: 'À quelle heure vous êtes-vous réveillé(e) ?'
      }
    ]
  },
  {
    id: 'alimentation',
    name: 'Alimentation',
    icon: '🍎',
    description: 'Votre énergie et votre équilibre alimentaire',
    weight: 0.15,
    questions: [
      {
        id: 'alim_qualite', type: 'scale', level: 'simple', required: true, weight: 1,
        label: 'Comment évaluez-vous la qualité de votre alimentation ?',
        config: { min: 1, max: 5, emojis: ['😫', '😕', '😐', '🙂', '😄'] }
      },
      {
        id: 'alim_quantite', type: 'choice', level: 'simple', weight: 1,
        label: 'Avez-vous mangé à votre faim aujourd\u2019hui ?',
        options: [
          { value: 'trop_peu', label: 'Pas assez', score: 40 },
          { value: 'juste', label: 'Juste ce qu\u2019il fallait', score: 100 },
          { value: 'trop', label: 'Trop', score: 60 }
        ]
      },
      {
        id: 'alim_equilibre', type: 'scale', level: 'simple', weight: 1,
        label: 'Votre alimentation vous semble-t-elle équilibrée ?',
        config: { min: 1, max: 5 }
      }
    ]
  },
  {
    id: 'activite',
    name: 'Activité physique',
    icon: '🏃',
    description: 'Votre mouvement du jour',
    weight: 0.15,
    questions: [
      {
        id: 'sport_fait', type: 'boolean', level: 'simple', required: true, weight: 1,
        label: 'Avez-vous fait du sport aujourd\u2019hui ?',
        config: { positiveValue: true }
      },
      {
        id: 'sport_duree', type: 'number', level: 'simple', weight: 1,
        label: 'Combien de minutes ?',
        config: { min: 0, max: 240, unit: 'min', target: 45 },
        dependsOn: { questionId: 'sport_fait', value: true }
      },
      {
        id: 'sport_intensite', type: 'scale', level: 'simple', weight: 0.5,
        label: 'Quelle intensité ?',
        config: { min: 1, max: 5 },
        dependsOn: { questionId: 'sport_fait', value: true }
      }
    ]
  },
  {
    id: 'travail',
    name: 'Travail',
    icon: '💼',
    description: 'Votre journée professionnelle',
    weight: 0.15,
    questions: [
      {
        id: 'travail_satisfaction', type: 'scale', level: 'simple', required: true, weight: 1,
        label: 'Êtes-vous satisfait(e) de votre journée de travail ?',
        config: { min: 1, max: 5 }
      },
      {
        id: 'travail_pression', type: 'scale', level: 'simple', weight: 1,
        label: 'Quel niveau de pression avez-vous ressenti ?',
        config: { min: 1, max: 5, invert: true }
      },
      {
        id: 'travail_efficacite', type: 'scale', level: 'simple', weight: 1,
        label: 'Vous êtes-vous senti(e) efficace ?',
        config: { min: 1, max: 5 }
      }
    ]
  },
  {
    id: 'mental',
    name: 'Mental',
    icon: '🧠',
    description: 'Votre état d\u2019esprit',
    weight: 0.2,
    questions: [
      {
        id: 'mental_humeur', type: 'scale', level: 'simple', required: true, weight: 1.5,
        label: 'Quelle était votre humeur générale ?',
        config: { min: 1, max: 5, emojis: ['😫', '😕', '😐', '🙂', '😄'] }
      },
      {
        id: 'mental_stress', type: 'scale', level: 'simple', weight: 1,
        label: 'Quel niveau de stress avez-vous ressenti ?',
        config: { min: 1, max: 5, invert: true }
      },
      {
        id: 'mental_motivation', type: 'scale', level: 'simple', weight: 1,
        label: 'Comment était votre motivation ?',
        config: { min: 1, max: 5 }
      }
    ]
  },
  {
    id: 'bilan',
    name: 'Bilan de la journée',
    icon: '✨',
    description: 'Un dernier mot sur votre journée',
    weight: 0.1,
    questions: [
      {
        id: 'bilan_note', type: 'scale', level: 'simple', required: true, weight: 1,
        label: 'Quelle note donneriez-vous à votre journée ?',
        config: { min: 1, max: 5 }
      },
      {
        id: 'bilan_meilleur_moment', type: 'text', level: 'simple', weight: 0, required: false,
        label: 'Quel a été le meilleur moment de votre journée ?'
      }
    ]
  }
];

module.exports = MODULES;
