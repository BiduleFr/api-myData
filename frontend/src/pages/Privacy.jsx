import { useState } from 'react';
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
  const { logout } = useAuth();
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
          <h1 className="text-2xl font-extrabold text-slate-800">Confidentialité et mes données</h1>
          <p className="text-sm text-slate-400 mt-1">Un contrôle clair sur ce que vous choisissez de conserver.</p>
        </div>

        <section className="card p-6 space-y-3">
          <h2 className="font-bold text-slate-800">Ce qui est enregistré</h2>
          <p className="text-sm text-slate-600">Vos réponses structurées, scores dérivés, notes de journal, préférences, habitudes, comportements et objectifs peuvent être conservés pour fournir votre historique.</p>
          <p className="text-sm text-slate-600">Le journal est stocké séparément des réponses et n'entre jamais dans le calcul du score. Une absence de réponse reste distincte d'une valeur zéro.</p>
        </section>

        <section className="card p-6 space-y-3">
          <h2 className="font-bold text-slate-800">Mode actuel</h2>
          <p className="text-sm text-slate-600">Dans ce mode public sans compte obligatoire, les données sont conservées dans le stockage local de ce navigateur. Elles ne sont pas envoyées à un service tiers par le mode local. Effacer les données du navigateur peut les supprimer.</p>
          <p className="text-sm text-slate-600">Si un compte et une API distante sont activés plus tard, les données transmises au serveur seront nécessaires au fonctionnement du service et pourront être traitées par l'hébergeur technique. L'application ne vend pas ces données et ne les utilise pas pour de la publicité.</p>
        </section>

        <section className="card p-6 space-y-3">
          <h2 className="font-bold text-slate-800">Vos contrôles</h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={exportData} className="btn-secondary">Exporter mes données</button>
            <button onClick={() => setConfirmDelete(true)} className="btn-ghost text-red-500 hover:bg-red-50">Supprimer les données locales</button>
          </div>
          {confirmDelete && (
            <div className="rounded-xl bg-red-50 p-4 space-y-3">
              <p className="text-sm text-red-700">Cette action efface les données conservées dans ce navigateur. Elle ne peut pas être annulée.</p>
              <div className="flex gap-2">
                <button onClick={deleteLocalData} className="btn-primary bg-red-600 hover:bg-red-700">Confirmer la suppression</button>
                <button onClick={() => setConfirmDelete(false)} className="btn-ghost">Annuler</button>
              </div>
            </div>
          )}
          {deleted && <p className="text-sm text-emerald-600">Les données locales ont été supprimées.</p>}
        </section>

        <p className="text-xs text-slate-400">Cette page décrit les garanties du mode actuel, pas une promesse absolue d'inaccessibilité technique. Ne saisissez pas une information que vous ne souhaitez pas stocker numériquement.</p>
      </div>
    </Layout>
  );
}
