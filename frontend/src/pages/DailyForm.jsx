import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { questionsApi, reponsesApi } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

const today = () => new Date().toISOString().slice(0, 10);

export default function DailyForm() {
    const { user } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [values, setValues] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const { data: allQuestions } = await questionsApi.getAll();
                const sorted = [...allQuestions].sort((a, b) => a.positionQuestion - b.positionQuestion);
                setQuestions(sorted);

                const { data: existing } = await reponsesApi.getByUserAndDate(user.id, today());
                const initial = {};
                existing.forEach((r) => { initial[r.questionId] = r.value; });
                setValues(initial);
            } catch (err) {
                setError('Impossible de charger le formulaire.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user.id]);

    const handleChange = (questionId, value) => {
        setValues((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setMessage('');
        try {
            const reponses = questions
                .filter((q) => values[q.id] !== undefined && values[q.id] !== '')
                .map((q) => ({ questionId: q.id, value: String(values[q.id]) }));

            await reponsesApi.save({ userId: user.id, date: today(), reponses });
            setMessage('Données enregistrées avec succès !');
        } catch (err) {
            setError("Erreur lors de l'enregistrement des données.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="page-center"><p>Chargement...</p></div>;

    return (
        <div className="page-center">
            <form className="card form-card" onSubmit={handleSubmit}>
                <h1>Mes données du {today()}</h1>
                {error && <p className="error">{error}</p>}
                {message && <p className="success">{message}</p>}

                {questions.length === 0 && <p>Aucune question disponible pour le moment.</p>}

                {questions.map((q) => (
                    <div key={q.id} className="form-field">
                        <label htmlFor={`question-${q.id}`}>{q.title}</label>
                        <p className="field-content">{q.content}</p>
                        {q.responseType === 'Cursor' && (
                            <>
                                <input
                                    id={`question-${q.id}`}
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={values[q.id] ?? 5}
                                    onChange={(e) => handleChange(q.id, e.target.value)}
                                />
                                <span>{values[q.id] ?? 5}</span>
                            </>
                        )}
                        {q.responseType === 'Number' && (
                            <input
                                id={`question-${q.id}`}
                                type="number"
                                value={values[q.id] ?? ''}
                                onChange={(e) => handleChange(q.id, e.target.value)}
                            />
                        )}
                        {q.responseType === 'Text' && (
                            <input
                                id={`question-${q.id}`}
                                type="text"
                                value={values[q.id] ?? ''}
                                onChange={(e) => handleChange(q.id, e.target.value)}
                            />
                        )}
                    </div>
                ))}

                <div className="form-actions">
                    <button type="submit" disabled={saving || questions.length === 0}>
                        {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                    <Link to="/" className="btn btn-link">Retour à l'accueil</Link>
                </div>
            </form>
        </div>
    );
}
