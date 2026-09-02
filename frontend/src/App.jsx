import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import Welcome from './pages/Welcome.jsx';
import Questionnaire from './pages/Questionnaire.jsx';
import Stats from './pages/Stats.jsx';
import Customize from './pages/Customize.jsx';
import Suivi from './pages/Suivi.jsx';
import Privacy from './pages/Privacy.jsx';
import About from './pages/About.jsx';
import Terms from './pages/Terms.jsx';

function WelcomeStandalone() {
  const navigate = useNavigate();
  const { startGuestSession } = useAuth();
  return (
    <Welcome
      onContinue={() => {
        startGuestSession();
        navigate('/');
      }}
    />
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/connexion" element={<Login />} />
      <Route path="/inscription" element={<Register />} />
      <Route path="/bienvenue" element={<WelcomeStandalone />} />
      <Route path="/a-propos" element={<About />} />
      <Route path="/conditions" element={<Terms />} />
      <Route path="/cgu" element={<Navigate to="/conditions" replace />} />
      <Route path="/terms" element={<Navigate to="/conditions" replace />} />
      <Route path="/" element={<Home />} />
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
