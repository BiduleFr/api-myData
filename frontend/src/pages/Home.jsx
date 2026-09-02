import Welcome from './Welcome.jsx';
import Dashboard from './Dashboard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { user, token, isGuest, loading, startGuestSession } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Chargement…</div>
      </div>
    );
  }

  // Si connecté avec un compte ou en session invité active, afficher le tableau de bord
  if ((token && user) || isGuest) {
    return <Dashboard />;
  }

  // Sinon, afficher la page d'accueil de bienvenue
  return <Welcome onContinue={startGuestSession} />;
}
