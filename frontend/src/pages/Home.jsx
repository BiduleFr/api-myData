import { useState } from 'react';
import Welcome from './Welcome.jsx';
import Dashboard from './Dashboard.jsx';

const VISITED_KEY = 'elan_visited';

export default function Home() {
  const [visited, setVisited] = useState(() => localStorage.getItem(VISITED_KEY) === 'true');

  if (!visited) {
    return <Welcome onContinue={() => { localStorage.setItem(VISITED_KEY, 'true'); setVisited(true); }} />;
  }

  return <Dashboard />;
}
