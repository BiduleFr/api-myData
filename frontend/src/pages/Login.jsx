import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
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
          <span className="text-3xl">✨</span>
          <h1 className="text-2xl font-extrabold text-slate-800 mt-2">Bon retour</h1>
          <p className="text-sm text-slate-400 mt-1">Connectez-vous pour continuer votre suivi.</p>
        </div>
        <form onSubmit={handleSubmit} autoComplete="on" className="flex flex-col gap-4">
          <input
            type="email" required autoComplete="email" placeholder="Adresse e-mail" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <input
            type="password" required autoComplete="current-password" placeholder="Mot de passe" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-400 mt-6">
          Pas encore de compte ?{' '}
          <Link to="/inscription" className="text-brand-600 font-semibold">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}
