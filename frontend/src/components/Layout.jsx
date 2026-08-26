import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const LINKS = [
  { to: '/', label: 'Accueil', icon: '🏠' },
  { to: '/statistiques', label: 'Statistiques', icon: '📈' },
  { to: '/suivi', label: 'Suivi', icon: '🎯' },
  { to: '/personnaliser', label: 'Personnaliser', icon: '⚙️' }
];

export default function Layout({ children }) {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-black/5">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-5 py-3">
          <Link to="/" className="font-extrabold text-brand-700 text-lg tracking-tight hover:opacity-80 transition-opacity">
            ✨ Elan
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    isActive ? 'bg-brand-100 text-brand-700' : 'text-slate-500 hover:bg-slate-100'
                  }`
                }
              >
                {l.icon} {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-sm text-slate-400">{user?.username}</span>
            {token ? (
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="btn-ghost text-sm"
              >
                Déconnexion
              </button>
            ) : (
              <span className="text-xs text-slate-400">Mode local</span>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-5 py-8">{children}</main>

      <nav className="sm:hidden sticky bottom-0 z-10 bg-white/90 backdrop-blur border-t border-black/5 flex justify-around py-2">
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-xs font-semibold ${
                isActive ? 'text-brand-700' : 'text-slate-400'
              }`
            }
          >
            <span className="text-lg">{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
