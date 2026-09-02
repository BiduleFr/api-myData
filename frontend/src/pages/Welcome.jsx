import { Link } from 'react-router-dom';

export default function Welcome({ onContinue }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10">
      <div className="max-w-lg w-full text-center space-y-8 animate-fade-up">
        <div>
          <span className="text-5xl">✨</span>
          <h1 className="text-3xl font-extrabold text-slate-800 mt-4">Elan</h1>
          <p className="text-slate-600 mt-3 text-xl font-medium">
            Quelques minutes par jour pour mieux vous connaître.
          </p>
        </div>

        <div className="card p-6 text-left space-y-4">
          <p className="text-base text-slate-700">
            <strong>Comment ça marche :</strong> chaque jour, en environ 2 minutes, vous répondez à quelques
            questions rapides (sommeil, énergie, humeur…). L'app calcule un score et vous montre votre évolution
            au fil du temps.
          </p>
          <p className="text-base text-slate-700">
            <strong>Votre vie privée :</strong> ce site enregistre des données personnelles et potentiellement
            sensibles (humeur, sommeil, santé, habitudes…). Il est donc préférable de ne pouvoir être identifié
            d'aucune manière : évitez votre vrai nom, votre photo ou toute information qui vous reconnaîtrait.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link to="/inscription" className="btn-primary justify-center text-base">
            Créer un compte (pseudo + mot de passe suffisent)
          </Link>
          <Link to="/connexion" className="btn-secondary justify-center text-base">
            Se connecter
          </Link>
          <button onClick={onContinue} className="btn-ghost text-sm justify-center">
            Essayer sans compte (données gardées sur cet appareil)
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400 pt-2">
          <Link to="/a-propos" className="hover:text-brand-600 font-medium">À propos & Équipe</Link>
          <span>•</span>
          <Link to="/conditions" className="hover:text-brand-600 font-medium">Conditions d'utilisation</Link>
          <span>•</span>
          <Link to="/confidentialite" className="hover:text-brand-600 font-medium">Vie privée</Link>
        </div>
      </div>
    </div>
  );
}
