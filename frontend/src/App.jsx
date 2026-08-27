import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Questionnaire from './pages/Questionnaire.jsx';
import Stats from './pages/Stats.jsx';
import Customize from './pages/Customize.jsx';
import Suivi from './pages/Suivi.jsx';
import Privacy from './pages/Privacy.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/connexion" element={<Navigate to="/" replace />} />
      <Route path="/inscription" element={<Navigate to="/" replace />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/questionnaire" element={<Questionnaire />} />
      <Route path="/statistiques" element={<Stats />} />
      <Route path="/suivi" element={<Suivi />} />
      <Route path="/objectifs" element={<Navigate to="/suivi" replace />} />
      <Route path="/personnaliser" element={<Customize />} />
      <Route path="/confidentialite" element={<Privacy />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
