import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { reponsesApi } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Stats() {
    const { user } = useAuth();
    const [grouped, setGrouped] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await reponsesApi.getByUser(user.id);
                const byQuestion = {};
                data.forEach((r) => {
                    const title = r.Question?.title || `Question #${r.questionId}`;
                    if (!byQuestion[title]) byQuestion[title] = [];
                    byQuestion[title].push({ date: r.date, value: Number(r.value) || r.value });
                });
                setGrouped(byQuestion);
            } catch (err) {
                setError('Impossible de charger les statistiques.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user.id]);

    if (loading) return <div className="page-center"><p>Chargement...</p></div>;

    const titles = Object.keys(grouped);

    return (
        <div className="page-center">
            <div className="card stats-card">
                <h1>Évolution de mes statistiques</h1>
                {error && <p className="error">{error}</p>}
                {titles.length === 0 && <p>Aucune donnée enregistrée pour le moment.</p>}

                {titles.map((title) => {
                    const points = grouped[title];
                    const chartData = {
                        labels: points.map((p) => p.date),
                        datasets: [
                            {
                                label: title,
                                data: points.map((p) => p.value),
                                borderColor: '#4f46e5',
                                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                                tension: 0.3,
                            },
                        ],
                    };
                    return (
                        <div key={title} className="chart-block">
                            <h2>{title}</h2>
                            <Line data={chartData} />
                        </div>
                    );
                })}

                <div className="form-actions">
                    <Link to="/" className="btn btn-link">Retour à l'accueil</Link>
                </div>
            </div>
        </div>
    );
}
