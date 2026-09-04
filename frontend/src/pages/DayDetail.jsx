import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import ScoreRing from '../components/ScoreRing.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api';
import { formatAnswerValue } from '../lib/formatAnswer';

export default function DayDetail() {
  const { date } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getConfig(), api.getEntry(date, token)])
      .then(([cfg, e]) => {
        setModules(cfg.modules || []);
        setEntry(e);
      })
      .finally(() => setLoading(false));
  }, [date, token]);

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse text-slate-400 text-center py-20">Chargement de la journée…</div>
      </Layout>
    );
  }

  const hasData = entry?.completionStatus && entry.completionStatus !== 'not_started';

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-up">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="btn-ghost">← Retour</button>
          <span className="text-sm text-slate-400">🔒 Journée non modifiable</span>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-2xl font-extrabold text-slate-800">
            {new Date(`${date}T00:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </h1>
          {hasData && <ScoreRing score={entry?.globalScore ?? null} label="Score de la journée" />}
        </div>

        {!hasData && (
          <p className="text-center text-sm text-slate-400">Aucune réponse n'a été enregistrée pour cette journée.</p>
        )}

        {hasData && Object.keys(entry?.moduleScores || {}).length > 0 && (
          <div className="card p-5 space-y-2">
            <h2 className="text-sm font-semibold text-slate-500 mb-2">Scores par domaine</h2>
            {modules.filter((m) => entry.moduleScores[m.id] !== undefined).map((m) => (
              <div key={m.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{m.icon} {m.name}</span>
                <span className="font-bold text-slate-800">{entry.moduleScores[m.id]}</span>
              </div>
            ))}
          </div>
        )}

        {hasData && modules.map((mod) => {
          const rows = mod.questions
            .map((q) => ({ question: q, display: formatAnswerValue(q, entry.answers?.[q.id]) }))
            .filter((row) => row.display !== null);
          if (rows.length === 0) return null;
          return (
            <div key={mod.id} className="card p-5 space-y-3">
              <h2 className="text-sm font-semibold text-slate-500">{mod.icon} {mod.name}</h2>
              <div className="space-y-2">
                {rows.map(({ question, display }) => (
                  <div key={question.id} className="flex items-start justify-between gap-4 text-sm">
                    <span className="text-slate-500">{question.label}</span>
                    <span className="font-semibold text-slate-800 text-right">{display}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {hasData && entry.journalEntry && (
          <div className="card p-5 space-y-2">
            <h2 className="text-sm font-semibold text-slate-500">📝 Ce que vous avez retenu de cette journée</h2>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{entry.journalEntry}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
