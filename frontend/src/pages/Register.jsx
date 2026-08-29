import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(username, password, email);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="card w-full max-w-sm p-8 animate-fade-up">
        <div className="text-center mb-8">
          <span className="text-3xl">🌱</span>
          <h1 className="text-2xl font-extrabold text-slate-800 mt-2">Créer votre suivi</h1>
          <p className="text-sm text-slate-400 mt-1">Un pseudo et un mot de passe suffisent.</p>
        </div>
        <form onSubmit={handleSubmit} autoComplete="on" className="flex flex-col gap-4">
          <input
            type="text" required autoComplete="username" placeholder="Choisissez un pseudo" value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <div>
            <input
              type="password" required minLength={8} autoComplete="new-password" placeholder="Mot de passe (8 caractères min.)" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <p className="text-xs text-slate-400 mt-2">
              Évitez d'utiliser votre vrai prénom, nom ou une information qui vous identifie : cela protège votre vie privée.
            </p>
          </div>

          {showEmail ? (
            <div>
              <input
                type="email" autoComplete="email" placeholder="Adresse e-mail (facultatif)" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              <p className="text-sm text-slate-400 mt-2">
                Utile uniquement pour récupérer l'accès à votre compte en cas d'oubli du mot de passe,
                ou comme solution de secours pour vous connecter. Toujours facultatif.
              </p>
            </div>
          ) : (
            <button type="button" onClick={() => setShowEmail(true)} className="text-sm text-brand-600 font-semibold text-left">
              + Ajouter un email (facultatif, pour récupérer l'accès en cas d'oubli du mot de passe)
            </button>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? 'Création…' : 'Créer mon compte'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-400 mt-6">
          Déjà un compte ?{' '}
          <Link to="/connexion" className="text-brand-600 font-semibold">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
