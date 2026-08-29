import { Link } from 'react-router-dom';

export default function Welcome({ onContinue }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10">
      <div className="max-w-lg w-full text-center space-y-8 animate-fade-up">
        <div>
          <span className="text-5xl">✨</span>
          <h1 className="text-3xl font-extrabold text-slate-800 mt-4">Elan</h1>
          <p className="text-slate-500 mt-3 text-lg">
            Quelques minutes par jour pour comprendre comment vous allez, vraiment.
          </p>
        </div>

        <div className="card p-6 text-left space-y-3">
          <p className="text-sm text-slate-600">
            <strong>Comment ça marche :</strong> chaque jour, vous répondez à quelques questions rapides
            (sommeil, énergie, humeur…). L'app calcule un score et vous montre votre évolution au fil du temps.
          </p>
          <p className="text-sm text-slate-600">
            <strong>Votre vie privée :</strong> pas besoin d'email pour commencer, juste un pseudo et un mot de passe.
            Évitez d'utiliser votre vrai nom ou des informations identifiables.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link to="/inscription" onClick={onContinue} className="btn-primary justify-center">
            Créer un compte (pseudo + mot de passe)
          </Link>
          <Link to="/connexion" onClick={onContinue} className="btn-secondary justify-center">
            Se connecter
          </Link>
          <button onClick={onContinue} className="btn-ghost text-sm justify-center">
            Essayer sans compte (données gardées sur cet appareil)
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Environ 2 minutes par jour. Vous pouvez créer un compte plus tard pour retrouver vos données sur un autre appareil.
        </p>
      </div>
    </div>
  );
}
