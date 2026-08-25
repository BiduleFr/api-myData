import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(username, email, password);
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
          <p className="text-sm text-slate-400 mt-1">Quelques secondes suffisent.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text" required placeholder="Prénom ou pseudo" value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <input
            type="email" required placeholder="Adresse e-mail" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <input
            type="password" required minLength={6} placeholder="Mot de passe" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
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
