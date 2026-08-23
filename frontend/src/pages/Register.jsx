import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api.js';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await authApi.register({ username, email, password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 1200);
        } catch (err) {
            setError(err.response?.data?.error || "Erreur lors de l'inscription.");
        }
    };

    return (
        <div className="page-center">
            <form className="card" onSubmit={handleSubmit}>
                <h1>Inscription</h1>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">Compte créé ! Redirection...</p>}
                <label>
                    Nom d'utilisateur
                    <input value={username} onChange={(e) => setUsername(e.target.value)} required />
                </label>
                <label>
                    Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    Mot de passe
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <button type="submit">S'inscrire</button>
                <p>Déjà un compte ? <Link to="/login">Connectez-vous</Link></p>
            </form>
        </div>
    );
}
