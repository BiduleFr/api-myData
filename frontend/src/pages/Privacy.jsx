import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const DATA_KEYS = ['elan_prefs', 'elan_entries', 'elan_goals', 'elan_habits', 'elan_habit_logs', 'elan_behaviors', 'elan_behavior_logs', 'elan_modules_schema'];

function collectLocalData() {
  return DATA_KEYS.reduce((data, key) => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) data[key] = JSON.parse(raw);
    } catch {
      data[key] = null;
    }
    return data;
  }, { exportedAt: new Date().toISOString() });
}

export default function Privacy() {
  const { user, token, logout } = useAuth();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);

  function exportData() {
    const blob = new Blob([JSON.stringify(collectLocalData(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `elan-mes-donnees-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function deleteLocalData() {
    DATA_KEYS.forEach((key) => localStorage.removeItem(key));
    localStorage.removeItem('elan_token');
    logout();
    setDeleted(true);
    setConfirmDelete(false);
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Politique de Confidentialité</h1>
          <p className="text-sm text-slate-400 mt-1">Transparence technique totale sur la protection et le traitement de vos données.</p>
        </div>

        {/* Principes cardinaux */}
        <section className="card p-6 space-y-3 bg-brand-50/50 border-brand-100">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <span>🛡️</span> Nos 4 engagements fondamentaux
          </h2>
          <ul className="text-sm text-slate-700 space-y-1.5 list-disc list-inside">
            <li><strong>Aucune vente de données :</strong> nous ne vendons, louons ni échangeons jamais vos données.</li>
            <li><strong>Zéro publicité ciblée :</strong> aucun outil de pistage commercial ni profilage publicitaire.</li>
            <li><strong>Anonymat encouragé :</strong> vous pouvez utiliser l'application avec un pseudonyme sans fournir de vrai nom ni d'email obligatoire.</li>
            <li><strong>Contrôle et portabilité :</strong> vous pouvez exporter vos données en JSON ou les supprimer à tout instant.</li>
          </ul>
        </section>

        {/* Ce qui est enregistré */}
        <section className="card p-6 space-y-3">
          <h2 className="font-bold text-slate-800">1. Quelles données sont enregistrées et pourquoi ?</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Élan enregistre uniquement les informations nécessaires au suivi personnel de votre bien-être :
          </p>
          <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
            <li><strong>Réponses aux questionnaires :</strong> sommeil, alimentation, activité, mental, travail, douleurs déclarées.</li>
            <li><strong>Scores dérivés :</strong> calculés automatiquement pour générer vos courbes d'évolution.</li>
            <li><strong>Journal personnel (facultatif) :</strong> vos réflexions libres, stockées séparément et jamais incluses dans les scores.</li>
            <li><strong>Préférences & Suivis :</strong> modules activés, objectifs, habitudes suivies et comportements à réduire.</li>
            <li><strong>Compte (optionnel) :</strong> pseudonyme, mot de passe hashé (chiffré irréversiblement avec bcrypt) et email éventuel de secours.</li>
          </ul>
        </section>

        {/* Architecture et prestataires tiers */}
        <section className="card p-6 space-y-3">
          <h2 className="font-bold text-slate-800">2. Où sont stockées vos données et qui y a accès ?</h2>
          <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <p>
              <strong>En mode invité :</strong> vos données restent strictement confinées dans le stockage local (LocalStorage)
              de votre navigateur. Aucun paquet de données n'est transmis à nos serveurs.
            </p>
            <p>
              <strong>Avec un compte connecté :</strong> vos données sont transmises de manière chiffrée (HTTPS / TLS) à notre API
              hébergée chez <em>Render</em>, puis stockées dans une base de données PostgreSQL sécurisée chez <em>Supabase</em>.
            </p>
            <p>
              <strong>Prestataires techniques stricts :</strong>
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li><strong>GitHub Pages :</strong> distribution des fichiers statiques de l'application (HTML/CSS/JS).</li>
              <li><strong>Render :</strong> hébergement sécurisé de l'API Node.js/Express.</li>
              <li><strong>Supabase (AWS) :</strong> hébergement sécurisé de la base de données PostgreSQL avec chiffrement au repos.</li>
            </ul>
            <p className="text-slate-500 pt-1">
              Aucun autre tiers (Google Analytics, régie publicitaire, Facebook SDK) n'est présent sur le site.
            </p>
          </div>
        </section>

        {/* Vos contrôles */}
        <section className="card p-6 space-y-4">
          <h2 className="font-bold text-slate-800">3. Vos droits : Exportation et Suppression</h2>
          <p className="text-sm text-slate-600">
            Vous conservez la maîtrise totale de vos enregistrements :
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={exportData} className="btn-secondary text-sm">
              📥 Exporter mes données locales (JSON)
            </button>
            <button onClick={() => setConfirmDelete(true)} className="btn-ghost text-sm text-red-500 hover:bg-red-50">
              🗑️ Supprimer mes données locales
            </button>
          </div>

          {confirmDelete && (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-4 space-y-3 animate-fade-up">
              <p className="text-xs text-red-700 font-semibold">
                Attention : cette action efface immédiatement et irréversiblement toutes les réponses, notes de journal et réglages enregistrés dans ce navigateur.
              </p>
              <div className="flex gap-2">
                <button onClick={deleteLocalData} className="btn-primary bg-red-600 hover:bg-red-700 text-xs">
                  Confirmer la suppression
                </button>
                <button onClick={() => setConfirmDelete(false)} className="btn-ghost text-xs">
                  Annuler
                </button>
              </div>
            </div>
          )}

          {deleted && (
            <p className="text-xs text-emerald-600 font-semibold">
              ✓ Vos données locales ont été effacées avec succès.
            </p>
          )}
        </section>

        {/* Recommandation de sécurité */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700">⚠️ Recommandation de bon sens :</p>
          <p>
            Nous mettons en œuvre les meilleures pratiques de sécurité (chiffrement TLS, mots de passe hashés avec bcrypt, JWT sécurisés).
            Cependant, aucun système numérique n'est invulnérable. Nous vous recommandons de ne pas inscrire de données d'identité réelles
            (nom de famille, adresse, numéro de sécurité sociale) dans vos notes libres.
          </p>
        </div>

        <div className="flex justify-center gap-4 text-xs text-slate-400 pt-2">
          <Link to="/conditions" className="hover:text-brand-600 font-medium">Conditions d'utilisation</Link>
          <span>•</span>
          <Link to="/a-propos" className="hover:text-brand-600 font-medium">À propos & Contact</Link>
        </div>
      </div>
    </Layout>
  );
}
