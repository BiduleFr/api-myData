import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Questionnaire from './pages/Questionnaire.jsx';
import Stats from './pages/Stats.jsx';
import Customize from './pages/Customize.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/connexion" element={<Navigate to="/" replace />} />
      <Route path="/inscription" element={<Navigate to="/" replace />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/questionnaire" element={<Questionnaire />} />
      <Route path="/statistiques" element={<Stats />} />
      <Route path="/personnaliser" element={<Customize />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
