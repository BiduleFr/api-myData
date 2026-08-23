import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await authApi.login({ email, password });
            login(data.user, data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur de connexion.');
        }
    };

    return (
        <div className="page-center">
            <form className="card" onSubmit={handleSubmit}>
                <h1>Connexion</h1>
                {error && <p className="error">{error}</p>}
                <label>
                    Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    Mot de passe
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <button type="submit">Se connecter</button>
                <p>Pas encore de compte ? <Link to="/register">Inscrivez-vous</Link></p>
            </form>
        </div>
    );
}
