const EN = {
  'Accueil': 'Home',
  'Statistiques': 'Statistics',
  'Suivi': 'Tracking',
  'Conseils': 'Advice',
  'Personnaliser': 'Customize',
  'Données': 'Data',
  'Déconnexion': 'Sign out',
  'Connexion': 'Sign in',
  'Quitter': 'Exit',
  'À propos': 'About',
  'Se connecter': 'Sign in',
  'Vie privée & Données': 'Privacy & Data',
  'Conditions d’utilisation': 'Terms of use',
  'Contact': 'Contact',
  'Rapide': 'Quick',
  'Intermédiaire': 'Medium',
  'Long': 'Long',
  'Retour': 'Back',
  'Suivant': 'Next',
  'Enregistrer ma journée': 'Save my day',
  'Enregistré': 'Saved',
  'Enregistrement…': 'Saving…',
  'Vue d’ensemble': 'Overview',
  'Personnaliser mon suivi': 'Customize my tracking',
  'Conseils': 'Advice',
  'Des pistes personnalisées pour comprendre vos tendances et avancer à votre rythme.': 'Personal guidance to understand your patterns and move at your own pace.',
  'Vos premiers conseils apparaîtront ici au fil de vos bilans.': 'Your first advice will appear here as you complete daily check-ins.',
  'Comment voulez-vous faire aujourd’hui ?': 'How would you like to do this today?',
  'Choisissez un niveau, puis commencez ou allez directement à un thème.': 'Choose a level, then start or go directly to a topic.',
  'Commencer': 'Start'
};

export function t(locale, text) {
  return locale === 'en' ? (EN[text] || text) : text;
}
