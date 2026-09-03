import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';

const TEAM_MEMBERS = [
  {
    name: 'Équipe Élan',
    role: 'Conception & Ingénierie logicielle',
    bio: 'Développement d\'une plateforme moderne, privacy-first et orientée auto-observation bienveillante.',
    contribution: 'Architecture full-stack, expérience utilisateur, sécurité des données.'
  }
];

const CREDITS = [
  { category: 'Technologies Frontend', items: ['React 18', 'Vite', 'Tailwind CSS', 'React Router'] },
  { category: 'Technologies Backend', items: ['Node.js', 'Express', 'Sequelize ORM', 'PostgreSQL', 'jsonwebtoken', 'bcrypt'] },
  { category: 'Typographie & Visuels', items: ['Police Plus Jakarta Sans (Google Fonts)', 'Emojis standards Unicode'] },
  { category: 'Hébergement & Infrastructure', items: ['GitHub Pages (Frontend)', 'Render (API)', 'Supabase (Base de données PostgreSQL)'] }
];

const CONTACT_CATEGORIES = [
  { value: 'question', label: 'Poser une question' },
  { value: 'bug', label: 'Signaler un problème technique' },
  { value: 'suggestion', label: 'Faire une suggestion' },
  { value: 'incorrect_content', label: 'Signaler un contenu incorrect' },
  { value: 'reclamation', label: 'Faire une réclamation' },
  { value: 'other', label: 'Autre' }
];

export default function About() {
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
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">À propos d'Élan</h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto">
            Un compagnon interactif et bienveillant pour prendre quelques minutes par jour,
            faire le point sur votre vie et comprendre votre évolution.
          </p>
        </div>

        {/* 1. Présentation & Philosophie */}
        <section className="card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>🌱</span> Présentation & Philosophie
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Élan est né d'une conviction simple : pour aller mieux, il ne faut ni formulaire administratif
            austère, ni tableau froid, ni diagnostic médical anxiogène. Nous avons conçu Élan comme un coach
            interactif moderne, positif et motivant.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Le principe : <strong>« Je prends 2 minutes pour faire le point sur ma journée et je comprends
            progressivement comment je vais. »</strong>
          </p>
        </section>

        {/* 2. Fonctionnement général */}
        <section className="card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>⚙️</span> Comment ça fonctionne
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 text-left">
            <div className="bg-brand-50/60 rounded-2xl p-4 border border-brand-100 space-y-1.5">
              <span className="text-2xl">⚡</span>
              <h3 className="font-bold text-sm text-slate-800">1. Questionnaire fluide</h3>
              <p className="text-xs text-slate-500">
                Une question à la fois, des contrôles adaptés (sliders, échelles 0-10, choix rapides).
              </p>
            </div>
            <div className="bg-brand-50/60 rounded-2xl p-4 border border-brand-100 space-y-1.5">
              <span className="text-2xl">🎯</span>
              <h3 className="font-bold text-sm text-slate-800">2. Suivi personnalisé</h3>
              <p className="text-xs text-slate-500">
                Activez les thématiques qui comptent pour vous : sommeil, alimentation, activité, mental, etc.
              </p>
            </div>
            <div className="bg-brand-50/60 rounded-2xl p-4 border border-brand-100 space-y-1.5">
              <span className="text-2xl">📈</span>
              <h3 className="font-bold text-sm text-slate-800">3. Mémoire & Tendances</h3>
              <p className="text-xs text-slate-500">
                Visualisez vos scores avec précision, vos notes personnelles et vos séries sans jugement moral.
              </p>
            </div>
          </div>
        </section>

        <section className="card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>🔒</span> Vie privée et données
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Retrouvez les informations sur la gestion, l'exportation et la suppression de vos données dans la politique de confidentialité.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/confidentialite" className="btn-secondary text-sm">
              Consulter la Politique de Confidentialité →
            </Link>
            <Link to="/conditions" className="btn-ghost text-sm">
              Conditions d'utilisation →
            </Link>
          </div>
        </section>

        {/* 4. Équipe de développement */}
        <section className="card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>👥</span> Équipe de développement
          </h2>
          <p className="text-sm text-slate-600">
            Élan est développé et maintenu avec passion par une équipe engagée pour la confidentialité et le bien-être numérique.
          </p>
          <div className="grid sm:grid-cols-1 gap-3 pt-2">
            {TEAM_MEMBERS.map((member, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-800">{member.name}</h3>
                  <span className="text-xs text-brand-600 font-semibold bg-brand-50 px-2.5 py-0.5 rounded-full">
                    {member.role}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{member.bio}</p>
                <p className="text-[11px] text-slate-400">Contribution : {member.contribution}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Crédits & Remerciements */}
        <section className="card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📦</span> Crédits & Technologies Open Source
          </h2>
          <p className="text-sm text-slate-600">
            Le projet s'appuie sur des composants et bibliothèques open source fiables et performants :
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-left">
            {CREDITS.map((c, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl p-4 bg-white space-y-1.5">
                <h3 className="font-bold text-xs text-brand-700 uppercase tracking-wider">{c.category}</h3>
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
            <span>❤️</span> Soutenir le projet
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Élan est un projet indépendant, sans publicité et respectueux de votre vie privée. Si l'application vous
            aide au quotidien, vous pouvez soutenir son hébergement et son développement continu.
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
              Faire un don de {selectedDonation} €
            </button>
            {donationSent && (
              <p className="text-xs text-emerald-600 mt-2">
                Merci pour votre soutien ! Le module de paiement sécurisé sera connecté prochainement.
              </p>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Paiements sécurisés à venir (Stripe / cartes bancaires).
          </p>
        </section>

        {/* 7. Contact / Réclamations / Signalement */}
        <section id="contact" className="card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>✉️</span> Contacter les administrateurs
          </h2>
          <p className="text-sm text-slate-600">
            Une question, une suggestion, un problème technique ou un contenu incorrect à signaler ? Envoyez-nous un message :
          </p>
          {sent ? (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-center space-y-2">
              <span className="text-3xl">✅</span>
              <p className="font-bold text-sm text-emerald-800">Message bien enregistré !</p>
              <p className="text-xs text-emerald-600">
                Merci pour votre retour, notre équipe traitera votre demande dans les meilleurs délais.
              </p>
              <button
                onClick={() => setSent(false)}
                className="btn-secondary text-xs mt-2"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Motif de votre message</label>
                <select
                  value={contactForm.category}
                  onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
                >
                  {CONTACT_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Votre email (facultatif si vous souhaitez une réponse)</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="contact@exemple.com"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Votre message</label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Expliquez-nous en détail votre demande ou le problème rencontré…"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
                />
              </div>

              <button type="submit" className="btn-primary w-full justify-center">
                Envoyer le message
              </button>
            </form>
          )}
        </section>

        {/* Liens de bas de page */}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400 pt-4">
          <Link to="/" className="hover:text-brand-600 font-medium">Accueil</Link>
          <span>•</span>
          <Link to="/conditions" className="hover:text-brand-600 font-medium">Conditions Générales d'Utilisation</Link>
          <span>•</span>
          <Link to="/confidentialite" className="hover:text-brand-600 font-medium">Politique de Confidentialité</Link>
        </div>
      </div>
    </Layout>
  );
}
