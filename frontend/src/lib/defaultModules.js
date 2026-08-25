const DEFAULT_MODULES = [
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
        label: 'Avez-vous mangé à votre faim aujourd\'hui ?',
        options: [
          { value: 'trop_peu', label: 'Pas assez', score: 40 },
          { value: 'juste', label: 'Juste ce qu\'il fallait', score: 100 },
          { value: 'trop', label: 'Trop', score: 60 }
        ]
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
        label: 'Avez-vous fait du sport aujourd\'hui ?',
        config: { positiveValue: true }
      },
      {
        id: 'sport_duree', type: 'number', level: 'simple', weight: 1,
        label: 'Combien de minutes ?',
        config: { min: 0, max: 240, unit: 'min', target: 45 },
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
      }
    ]
  },
  {
    id: 'mental',
    name: 'Mental',
    icon: '🧠',
    description: 'Votre état d\'esprit',
    weight: 0.2,
    questions: [
      {
        id: 'mental_humeur', type: 'scale', level: 'simple', required: true, weight: 1.5,
        label: 'Quelle était votre humeur générale ?',
        config: { min: 1, max: 5, emojis: ['😫', '😕', '😐', '🙂', '😄'] }
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
        id: 'bilan_meilleur_moment', type: 'text', level: 'simple', weight: 0,
        label: 'Quel a été le meilleur moment de votre journée ?'
      }
    ]
  }
];

export default DEFAULT_MODULES;