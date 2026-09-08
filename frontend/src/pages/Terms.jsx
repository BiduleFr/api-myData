import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { useAppearance } from '../context/AppearanceContext.jsx';

export default function Terms() {
  const { locale } = useAppearance();
  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">{locale === 'en' ? 'Terms of Use' : "Conditions Générales d'Utilisation"}</h1>
          <p className="text-sm text-slate-400 mt-2">{locale === 'en' ? 'Last updated: August 30, 2026' : 'Dernière mise à jour : 30 août 2026'}</p>
        </div>

        <section className="card p-6 space-y-3">
          <h2 className="text-lg font-bold text-slate-800">{locale === 'en' ? '1. Purpose of the service' : '1. Objet du service'}</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {locale === 'en'
              ? 'Elan is a personal web application for daily self-observation (sleep, activity, energy, mood, work, habits, personal notes). It lets you track your feelings and view their progress over time.'
              : "Élan est une application web personnelle d'auto-observation quotidienne (sommeil, activité, énergie, humeur, travail, habitudes, notes personnelles). Elle permet de suivre ses ressentis et de visualiser leur évolution dans le temps."}
          </p>
        </section>

        <section className="card p-6 space-y-3 border-l-4 border-amber-400 bg-amber-50/40">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>⚠️</span> {locale === 'en' ? '2. Strict non-medical disclaimer' : '2. Avertissement non médical strict'}
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            <strong>{locale === 'en' ? 'Elan is not a medical device, nor a diagnostic, treatment or medical prevention tool.' : "Élan n'est pas un dispositif médical, ni un outil de diagnostic, de traitement ou de prévention médicale."}</strong>
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            {locale === 'en'
              ? 'The scores, averages, trends and visualizations shown are purely indicative and reflect only the self-reported data entered by the user. They in no way constitute medical, psychological or therapeutic advice. In case of pain, psychological distress, sleep disorder or health issue, always consult a qualified healthcare professional.'
              : "Les scores, moyennes, tendances et visualisations affichés sont purement indicatifs et reflètent uniquement les données déclaratives saisies par l'utilisateur. Ils ne constituent en aucun cas un avis médical, psychologique ou thérapeutique. En cas de douleur, de détresse psychologique, de trouble du sommeil ou de problème de santé, consultez impérativement un professionnel de santé qualifié."}
          </p>
        </section>

        <section className="card p-6 space-y-3">
          <h2 className="text-lg font-bold text-slate-800">{locale === 'en' ? '3. Service access and account creation' : '3. Accès au service et création de compte'}</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {locale === 'en'
              ? "The service is accessible in guest mode (data stored exclusively in your device's browser) or with a user account (username + password, optional email) to sync your data."
              : 'Le service est accessible en mode invité (données stockées exclusivement dans le navigateur de votre appareil) ou avec un compte utilisateur (pseudo + mot de passe, email facultatif) pour synchroniser vos données.'}
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            <strong>{locale === 'en' ? 'Privacy recommendation: ' : 'Recommandation de confidentialité : '}</strong>
            {locale === 'en'
              ? 'we expressly invite you to choose a neutral pseudonym that does not allow you to be identified (no real first name, last name, date of birth or photo).'
              : 'nous vous invitons expressément à choisir un pseudonyme neutre qui ne permet pas de vous identifier (aucun vrai prénom, nom, date de naissance ou photo).'}
          </p>
        </section>

        <section className="card p-6 space-y-3">
          <h2 className="text-lg font-bold text-slate-800">{locale === 'en' ? '4. Your data and respect for privacy' : '4. Vos données et respect de la vie privée'}</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {locale === 'en'
              ? 'Your personal data belongs to you. It is neither sold, rented nor transferred to third parties, and is not used for advertising targeting or commercial profiling.'
              : "Vos données personnelles vous appartiennent. Elles ne sont ni vendues, ni louées, ni cédées à des tiers, et ne sont pas exploitées à des fins de ciblage publicitaire ou de profilage commercial."}
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            {locale === 'en' ? 'For more details on storage, technical providers and your export or deletion rights, see our ' : 'Pour plus de détails sur le stockage, les prestataires techniques et vos droits d\'exportation ou de suppression, consultez notre '}
            <Link to="/confidentialite" className="text-brand-600 font-semibold underline">
              {locale === 'en' ? 'Privacy Policy' : 'Politique de Confidentialité'}
            </Link>.
          </p>
        </section>

        <section className="card p-6 space-y-3">
          <h2 className="text-lg font-bold text-slate-800">{locale === 'en' ? '5. Limitation of liability' : '5. Limitation de responsabilité'}</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {locale === 'en'
              ? 'The service is provided "as is" and "as available". Despite technical efforts to ensure the security and continuity of the service, we cannot guarantee the absence of interruption, failure, bug, cyberattack or accidental data loss.'
              : 'Le service est fourni « en l\'état » et « selon disponibilité ». Malgré les efforts techniques pour assurer la sécurité et la continuité du service, nous ne pouvons garantir l\'absence d\'interruption, de panne, de bug, d\'attaque informatique ou de perte accidentelle de données.'}
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            {locale === 'en' ? 'Users are encouraged to regularly export a copy of their data from the ' : 'L\'utilisateur est encouragé à exporter régulièrement une copie de ses données depuis la section '}
            <Link to="/confidentialite" className="text-brand-600 font-semibold underline">
              {locale === 'en' ? 'Data' : 'Données'}
            </Link> {locale === 'en' ? 'section.' : '.'}
          </p>
        </section>

        <section className="card p-6 space-y-3">
          <h2 className="text-lg font-bold text-slate-800">{locale === 'en' ? '6. Termination and account deletion' : '6. Résiliation et suppression de compte'}</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {locale === 'en'
              ? 'You can delete all of your local data from your browser at any time, or permanently delete your account and all associated entries.'
              : 'Vous pouvez à tout moment supprimer l\'ensemble de vos données locales depuis votre navigateur ou supprimer définitivement votre compte et toutes les entrées associées.'}
          </p>
        </section>

        <section className="card p-6 space-y-3">
          <h2 className="text-lg font-bold text-slate-800">{locale === 'en' ? '7. Contact and reporting' : '7. Contact et signalement'}</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {locale === 'en' ? 'For any question, complaint or report of a technical issue, you can contact the team via the dedicated form on the ' : 'Pour toute question, réclamation ou signalement d\'un problème technique, vous pouvez contacter l\'équipe via le formulaire dédié sur la page '}
            <Link to="/a-propos#contact" className="text-brand-600 font-semibold underline">
              {locale === 'en' ? 'About' : 'À propos'}
            </Link> {locale === 'en' ? 'page.' : '.'}
          </p>
        </section>

        <p className="text-xs text-slate-400 text-center">
          {locale === 'en'
            ? 'Working document — to be legally validated before commercial or medical use.'
            : 'Document de travail — à faire valider juridiquement avant une exploitation commerciale ou médicale.'}
        </p>
      </div>
    </Layout>
  );
}
