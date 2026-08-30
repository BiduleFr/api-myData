import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';

export default function Terms() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Conditions Générales d'Utilisation</h1>
          <p className="text-sm text-slate-400 mt-2">Dernière mise à jour : 30 août 2026</p>
        </div>

        <section className="card p-6 space-y-3">
          <h2 className="text-lg font-bold text-slate-800">1. Objet du service</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Élan est une application web personnelle d'auto-observation quotidienne (sommeil, activité,
            énergie, humeur, travail, habitudes, notes personnelles). Elle permet de suivre ses ressentis
            et de visualiser leur évolution dans le temps.
          </p>
        </section>

        <section className="card p-6 space-y-3 border-l-4 border-amber-400 bg-amber-50/40">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>⚠️</span> 2. Avertissement non médical strict
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            <strong>Élan n'est pas un dispositif médical, ni un outil de diagnostic, de traitement ou de prévention médicale.</strong>
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Les scores, moyennes, tendances et visualisations affichés sont purement indicatifs et reflètent
            uniquement les données déclaratives saisies par l'utilisateur. Ils ne constituent en aucun cas
            un avis médical, psychologique ou thérapeutique. En cas de douleur, de détresse psychologique,
            de trouble du sommeil ou de problème de santé, consultez impérativement un professionnel de santé qualifié.
          </p>
        </section>

        <section className="card p-6 space-y-3">
          <h2 className="text-lg font-bold text-slate-800">3. Accès au service et création de compte</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Le service est accessible en mode invité (données stockées exclusivement dans le navigateur de votre appareil)
            ou avec un compte utilisateur (pseudo + mot de passe, email facultatif) pour synchroniser vos données.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            <strong>Recommandation de confidentialité :</strong> nous vous invitons expressément à choisir un pseudonyme
            neutre qui ne permet pas de vous identifier (aucun vrai prénom, nom, date de naissance ou photo).
          </p>
        </section>

        <section className="card p-6 space-y-3">
          <h2 className="text-lg font-bold text-slate-800">4. Vos données et respect de la vie privée</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Vos données personnelles vous appartiennent. Elles ne sont ni vendues, ni louées, ni cédées à des tiers,
            et ne sont pas exploitées à des fins de ciblage publicitaire ou de profilage commercial.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Pour plus de détails sur le stockage, les prestataires techniques et vos droits d'exportation ou de suppression,
            consultez notre{' '}
            <Link to="/confidentialite" className="text-brand-600 font-semibold underline">
              Politique de Confidentialité
            </Link>.
          </p>
        </section>

        <section className="card p-6 space-y-3">
          <h2 className="text-lg font-bold text-slate-800">5. Limitation de responsabilité</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Le service est fourni « en l'état » et « selon disponibilité ». Malgré les efforts techniques pour assurer
            la sécurité et la continuité du service, nous ne pouvons garantir l'absence d'interruption, de panne, de bug,
            d'attaque informatique ou de perte accidentelle de données.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            L'utilisateur est encouragé à exporter régulièrement une copie de ses données depuis la section{' '}
            <Link to="/confidentialite" className="text-brand-600 font-semibold underline">
              Données
            </Link>.
          </p>
        </section>

        <section className="card p-6 space-y-3">
          <h2 className="text-lg font-bold text-slate-800">6. Résiliation et suppression de compte</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Vous pouvez à tout moment supprimer l'ensemble de vos données locales depuis votre navigateur ou supprimer
            définitivement votre compte et toutes les entrées associées.
          </p>
        </section>

        <section className="card p-6 space-y-3">
          <h2 className="text-lg font-bold text-slate-800">7. Contact et signalement</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Pour toute question, réclamation ou signalement d'un problème technique, vous pouvez contacter l'équipe
            via le formulaire dédié sur la page{' '}
            <Link to="/a-propos#contact" className="text-brand-600 font-semibold underline">
              À propos
            </Link>.
          </p>
        </section>

        <p className="text-xs text-slate-400 text-center">
          Document de travail — à faire valider juridiquement avant une exploitation commerciale ou médicale.
        </p>
      </div>
    </Layout>
  );
}
