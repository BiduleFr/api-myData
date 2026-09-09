import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { useAppearance } from '../context/AppearanceContext.jsx';

const TEAM_MEMBERS = [
  {
    nameFr: 'Équipe Élan',
    nameEn: 'Elan Team',
    roleFr: 'Conception & Ingénierie logicielle',
    roleEn: 'Design & Software engineering',
    bioFr: 'Développement d\'une plateforme moderne, privacy-first et orientée auto-observation bienveillante.',
    bioEn: 'Building a modern, privacy-first platform focused on caring self-observation.',
    contributionFr: 'Architecture full-stack, expérience utilisateur, sécurité des données.',
    contributionEn: 'Full-stack architecture, user experience, data security.'
  }
];

const CREDITS = [
  { categoryFr: 'Technologies Frontend', categoryEn: 'Frontend technologies', items: ['React 18', 'Vite', 'Tailwind CSS', 'React Router'] },
  { categoryFr: 'Technologies Backend', categoryEn: 'Backend technologies', items: ['Node.js', 'Express', 'Sequelize ORM', 'PostgreSQL', 'jsonwebtoken', 'bcrypt'] },
  { categoryFr: 'Typographie & Visuels', categoryEn: 'Typography & visuals', items: ['Police Plus Jakarta Sans (Google Fonts)', 'Emojis standards Unicode'] },
  { categoryFr: 'Hébergement & Infrastructure', categoryEn: 'Hosting & infrastructure', items: ['GitHub Pages (Frontend)', 'Render (API)', 'Supabase (Base de données PostgreSQL)'] }
];

const CONTACT_CATEGORIES = [
  { value: 'question', labelFr: 'Poser une question', labelEn: 'Ask a question' },
  { value: 'bug', labelFr: 'Signaler un problème technique', labelEn: 'Report a technical issue' },
  { value: 'suggestion', labelFr: 'Faire une suggestion', labelEn: 'Make a suggestion' },
  { value: 'incorrect_content', labelFr: 'Signaler un contenu incorrect', labelEn: 'Report incorrect content' },
  { value: 'reclamation', labelFr: 'Faire une réclamation', labelEn: 'File a complaint' },
  { value: 'other', labelFr: 'Autre', labelEn: 'Other' }
];

export default function About() {
  const { locale, theme, setTheme } = useAppearance();
  const [contactForm, setContactForm] = useState({
    category: 'question',
    email: '',
    message: ''
  });
  const [sent, setSent] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState('5');
  const [donationSent, setDonationSent] = useState(false);

  function handleContactSubmit(e) {
    e.preventDefault();
    if (!contactForm.message.trim()) return;
    // Enregistrement local du message / préparation pour route API future
    try {
      const existing = JSON.parse(localStorage.getItem('elan_contact_messages') || '[]');
      existing.push({
        ...contactForm,
        date: new Date().toISOString()
      });
      localStorage.setItem('elan_contact_messages', JSON.stringify(existing));
    } catch {}
    setSent(true);
    setContactForm({ category: 'question', email: '', message: '' });
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-10 animate-fade-up">
        {/* En-tête */}
        <div className="text-center space-y-3">
          <span className="text-5xl">✨</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">{locale === 'en' ? 'About Elan' : "À propos d'Élan"}</h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto">
            {locale === 'en'
              ? 'A caring interactive companion to spend a few minutes a day, review your life and understand your progress.'
              : 'Un compagnon interactif et bienveillant pour prendre quelques minutes par jour, faire le point sur votre vie et comprendre votre évolution.'}
          </p>
        </div>

        {/* 1. Présentation & Philosophie */}
        <section className="card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>🌱</span> {locale === 'en' ? 'Overview & Philosophy' : 'Présentation & Philosophie'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {locale === 'en'
              ? "Elan was born from a simple conviction: to feel better, we need to understand the real levers of our lives. We designed Elan as a modern, positive and motivating interactive coach."
              : "Élan est né d'une conviction simple : pour aller mieux, il faut comprendre les vrais leviers importants de notre vie. Nous avons conçu Élan comme un coach interactif moderne, positif et motivant."}
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {locale === 'en' ? 'The principle: ' : 'Le principe : '}
            <strong>
              {locale === 'en'
                ? '"I take 2 minutes to review my day and progressively understand how I work."'
                : '« Je prends 2 minutes pour faire le point sur ma journée et je comprends progressivement comment je fonctionne. »'}
            </strong>
          </p>
        </section>

        {/* 2. Fonctionnement général */}
        <section className="card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>⚙️</span> {locale === 'en' ? 'How it works' : 'Comment ça marche ?'}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 text-left">
            <div className="bg-brand-50/60 rounded-2xl p-4 border border-brand-100 space-y-1.5">
              <span className="text-2xl">⚡</span>
              <h3 className="font-bold text-sm text-slate-800">{locale === 'en' ? '1. Smooth questionnaire' : '1. Questionnaire fluide'}</h3>
              <p className="text-xs text-slate-500">
                {locale === 'en'
                  ? 'One question at a time, with fitting controls (sliders, 0-10 scales, quick choices).'
                  : 'Une question à la fois, des contrôles adaptés (sliders, échelles 0-10, choix rapides).'}
              </p>
            </div>
            <div className="bg-brand-50/60 rounded-2xl p-4 border border-brand-100 space-y-1.5">
              <span className="text-2xl">🎯</span>
              <h3 className="font-bold text-sm text-slate-800">{locale === 'en' ? '2. Personalized tracking' : '2. Suivi personnalisé'}</h3>
              <p className="text-xs text-slate-500">
                {locale === 'en'
                  ? 'Enable the topics that matter to you: sleep, nutrition, activity, mind, etc.'
                  : 'Activez les thématiques qui comptent pour vous : sommeil, alimentation, activité, mental, etc.'}
              </p>
            </div>
            <div className="bg-brand-50/60 rounded-2xl p-4 border border-brand-100 space-y-1.5">
              <span className="text-2xl">📈</span>
              <h3 className="font-bold text-sm text-slate-800">{locale === 'en' ? '3. Memory & Trends' : '3. Mémoire & Tendances'}</h3>
              <p className="text-xs text-slate-500">
                {locale === 'en'
                  ? 'View your precise scores, your personal notes and your streaks without moral judgment.'
                  : 'Visualisez vos scores avec précision, vos notes personnelles et vos séries sans jugement moral.'}
              </p>
            </div>
          </div>
        </section>

        <section className="card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>🔒</span> {locale === 'en' ? 'Privacy and data' : 'Vie privée et données'}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {locale === 'en'
              ? 'Your data is never sold, never used for advertising and never shared with third parties. In guest mode, everything stays on your device. With an account, it is encrypted and stored securely. You can export or delete everything at any time.'
              : 'Vos données ne sont jamais vendues, jamais utilisées pour la publicité et jamais partagées avec des tiers. En mode invité, tout reste sur votre appareil. Avec un compte, elles sont chiffrées et stockées en sécurité. Vous pouvez tout exporter ou supprimer à tout moment.'}
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            {locale === 'en'
              ? 'Since this app handles sensitive well-being data, we recommend choosing a neutral pseudonym and avoiding any information that could identify you (real name, photo, address, etc.).'
              : "Comme cette application traite des données de bien-être sensibles, nous vous conseillons de choisir un pseudonyme neutre et d'éviter toute information qui pourrait vous identifier (vrai nom, photo, adresse, etc.)."}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/confidentialite" className="btn-secondary text-sm">
              {locale === 'en' ? 'View the Privacy Policy →' : 'Consulter la Politique de Confidentialité →'}
            </Link>
            <Link to="/conditions" className="btn-ghost text-sm">
              {locale === 'en' ? 'Terms of use →' : "Conditions d'utilisation →"}
            </Link>
          </div>
        </section>

        {/* 4. Équipe de développement */}
        <section className="card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>👥</span> {locale === 'en' ? 'Development team' : 'Équipe de développement'}
          </h2>
          <p className="text-sm text-slate-600">
            {locale === 'en'
              ? 'Elan is developed and maintained with passion by a team committed to privacy and digital well-being.'
              : 'Élan est développé et maintenu avec passion par une équipe engagée pour la confidentialité et le bien-être numérique.'}
          </p>
          <div className="grid sm:grid-cols-1 gap-3 pt-2">
            {TEAM_MEMBERS.map((member, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-800">{locale === 'en' ? member.nameEn : member.nameFr}</h3>
                  <span className="text-xs text-brand-600 font-semibold bg-brand-50 px-2.5 py-0.5 rounded-full">
                    {locale === 'en' ? member.roleEn : member.roleFr}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{locale === 'en' ? member.bioEn : member.bioFr}</p>
                <p className="text-[11px] text-slate-400">{locale === 'en' ? 'Contribution: ' : 'Contribution : '}{locale === 'en' ? member.contributionEn : member.contributionFr}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Crédits & Remerciements */}
        <section className="card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📦</span> {locale === 'en' ? 'Credits & Open Source Technologies' : 'Crédits & Technologies Open Source'}
          </h2>
          <p className="text-sm text-slate-600">
            {locale === 'en'
              ? 'This project relies on reliable and efficient open source components and libraries:'
              : "Le projet s'appuie sur des composants et bibliothèques open source fiables et performants :"}
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-left">
            {CREDITS.map((c, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl p-4 bg-white space-y-1.5">
                <h3 className="font-bold text-xs text-brand-700 uppercase tracking-wider">{locale === 'en' ? c.categoryEn : c.categoryFr}</h3>
                <ul className="text-xs text-slate-600 space-y-1">
                  {c.items.map((it, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="text-slate-400">•</span> {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Soutenir le projet / Dons */}
        <section className="card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>❤️</span> {locale === 'en' ? 'Support the project' : 'Soutenir le projet'}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {locale === 'en'
              ? 'Elan is an independent, ad-free project that respects your privacy. If the app helps you daily, you can support its hosting and continued development.'
              : "Élan est un projet indépendant, sans publicité et respectueux de votre vie privée. Si l'application vous aide au quotidien, vous pouvez soutenir son hébergement et son développement continu."}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {['2', '5', '10', '20'].map((amount) => (
              <button
                key={amount}
                onClick={() => { setSelectedDonation(amount); setDonationSent(false); }}
                className={`px-5 py-2.5 rounded-2xl font-bold text-sm border transition-all ${
                  selectedDonation === amount
                    ? 'bg-brand-600 text-white border-brand-600 shadow-soft'
                    : 'bg-white border-slate-200 hover:border-brand-300'
                }`}
              >
                {amount} €
              </button>
            ))}
          </div>
          <div>
            <button
              onClick={() => setDonationSent(true)}
              className="btn-primary"
            >
              {locale === 'en' ? `Donate ${selectedDonation} €` : `Faire un don de ${selectedDonation} €`}
            </button>
            {donationSent && (
              <p className="text-xs text-emerald-600 mt-2">
                {locale === 'en'
                  ? 'Thank you for your support! Secure payment will be connected soon.'
                  : 'Merci pour votre soutien ! Le module de paiement sécurisé sera connecté prochainement.'}
              </p>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {locale === 'en' ? 'Secure payments coming soon (Stripe / cards).' : 'Paiements sécurisés à venir (Stripe / cartes bancaires).'}
          </p>
        </section>

        {/* 7. Contact / Réclamations / Signalement */}
        <section id="contact" className="card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>✉️</span> {locale === 'en' ? 'Contact the administrators' : 'Contacter les administrateurs'}
          </h2>
          <p className="text-sm text-slate-600">
            {locale === 'en'
              ? 'A question, a suggestion, a technical issue or incorrect content to report? Send us a message:'
              : 'Une question, une suggestion, un problème technique ou un contenu incorrect à signaler ? Envoyez-nous un message :'}
          </p>
          {sent ? (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-center space-y-2">
              <span className="text-3xl">✅</span>
              <p className="font-bold text-sm text-emerald-800">{locale === 'en' ? 'Message successfully sent!' : 'Message bien enregistré !'}</p>
              <p className="text-xs text-emerald-600">
                {locale === 'en'
                  ? 'Thank you for your feedback, our team will handle your request as soon as possible.'
                  : 'Merci pour votre retour, notre équipe traitera votre demande dans les meilleurs délais.'}
              </p>
              <button
                onClick={() => setSent(false)}
                className="btn-secondary text-xs mt-2"
              >
                {locale === 'en' ? 'Send another message' : 'Envoyer un autre message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{locale === 'en' ? 'Reason for your message' : 'Motif de votre message'}</label>
                <select
                  value={contactForm.category}
                  onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
                >
                  {CONTACT_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{locale === 'en' ? cat.labelEn : cat.labelFr}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{locale === 'en' ? 'Your email (optional if you want a reply)' : 'Votre email (facultatif si vous souhaitez une réponse)'}</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="contact@exemple.com"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{locale === 'en' ? 'Your message' : 'Votre message'}</label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder={locale === 'en' ? 'Explain your request or the issue in detail…' : 'Expliquez-nous en détail votre demande ou le problème rencontré…'}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
                />
              </div>

              <button type="submit" className="btn-primary w-full justify-center">
                {locale === 'en' ? 'Send message' : 'Envoyer le message'}
              </button>
            </form>
          )}
        </section>

        {/* Apparence */}
        <section className="card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>🌗</span> {locale === 'en' ? 'Appearance' : 'Apparence'}
          </h2>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              {locale === 'en' ? 'Switch between light and dark mode for the whole site.' : 'Basculer entre le mode clair et le mode sombre pour l\'ensemble du site.'}
            </p>
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="btn-secondary text-sm whitespace-nowrap"
            >
              {theme === 'dark' ? (locale === 'en' ? '☀️ Light mode' : '☀️ Mode clair') : (locale === 'en' ? '🌙 Dark mode' : '🌙 Mode sombre')}
            </button>
          </div>
        </section>

        {/* Liens de bas de page */}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400 pt-4">
          <Link to="/" className="hover:text-brand-600 font-medium">{locale === 'en' ? 'Home' : 'Accueil'}</Link>
          <span>•</span>
          <Link to="/conditions" className="hover:text-brand-600 font-medium">{locale === 'en' ? 'Terms of Use' : "Conditions Générales d'Utilisation"}</Link>
          <span>•</span>
          <Link to="/confidentialite" className="hover:text-brand-600 font-medium">{locale === 'en' ? 'Privacy Policy' : 'Politique de Confidentialité'}</Link>
        </div>
      </div>
    </Layout>
  );
}
