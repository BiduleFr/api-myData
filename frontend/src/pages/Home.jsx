import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
    const { user, logout } = useAuth();

    return (
        <div className="page-center">
            <div className="card home-card">
                <h1>Bonjour {user?.username} 👋</h1>
                <p>Que souhaitez-vous faire aujourd'hui ?</p>
                <div className="home-buttons">
                    <Link to="/form" className="btn btn-primary">Remplir mes données du jour</Link>
                    <Link to="/stats" className="btn btn-secondary">Voir mes statistiques</Link>
                </div>
                <button className="btn btn-link" onClick={logout}>Se déconnecter</button>
            </div>
        </div>
    );
}
