import './App.css';

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">MyData</div>
        <button className="ghost-button">Mon profil</button>
      </header>

      <main className="hero">
        <div className="card main-card">
          <p className="eyebrow">Suivi santé</p>
          <h1>Bienvenue dans votre espace MyData</h1>
          <p className="subtitle">
            Remplissez vos habitudes quotidiennes et suivez votre évolution au fil du temps.
          </p>

          <div className="actions">
            <button className="primary">Remplir les données du jour</button>
            <button className="secondary">Voir l'évolution</button>
          </div>
        </div>

        <div className="card stats-mini">
          <h2>Vue rapide</h2>
          <ul>
            <li>💤 Sommeil</li>
            <li>🥗 Nutrition</li>
            <li>🏃 Sport</li>
            <li>💧 Hydratation</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;

