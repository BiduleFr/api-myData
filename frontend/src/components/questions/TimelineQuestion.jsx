const POINTS = [
  { id: 'matin', label: 'Matin' },
  { id: 'matinee', label: 'Matinée' },
  { id: 'midi', label: 'Midi' },
  { id: 'aprem', label: 'Après-midi' },
  { id: 'fin_journee', label: 'Fin de journée' },
  { id: 'soir', label: 'Soir' }
];

export default function TimelineQuestion({ question, value, onChange }) {
  const defaults = question.config?.defaultValue || Object.fromEntries(POINTS.map(({ id }) => [id, 3]));
  const current = value && typeof value === 'object' ? { ...defaults, ...value } : defaults;

  const chartPoints = POINTS.map((point, index) => {
    const x = 8 + index * (84 / (POINTS.length - 1));
    const y = 90 - ((current[point.id] - 1) / 4) * 80;
    return `${x},${y}`;
  }).join(' ');
  const globalValue = Math.round(POINTS.reduce((sum, point) => sum + current[point.id], 0) / POINTS.length);

  function changePoint(pointId, nextValue) {
    onChange({ ...current, [pointId]: Number(nextValue) });
  }

  function changeAll(nextValue) {
    onChange(Object.fromEntries(POINTS.map(({ id }) => [id, Number(nextValue)])));
  }

  return (
    <div className="mx-auto w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-4 rounded-lg bg-slate-50 px-4 py-3">
        <label className="block text-sm font-semibold text-slate-600">
          Ajuster tous les points
          <input type="range" min="1" max="5" step="1" value={globalValue} onChange={(event) => changeAll(event.target.value)} className="elan-rating mt-3 w-full" aria-label="Ajuster tous les points" />
        </label>
      </div>
      <svg viewBox="0 0 100 100" className="mb-2 h-28 w-full overflow-visible" role="img" aria-label="Évolution de la journée">
        <polyline points={chartPoints} fill="none" stroke="#6a3fe3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {POINTS.map((point, index) => {
          const [x, y] = chartPoints.split(' ')[index].split(',');
          return <circle key={point.id} cx={x} cy={y} r="3" fill="#6a3fe3" />;
        })}
      </svg>
      <div className="grid grid-cols-6 gap-2 border-b-2 border-slate-200 pb-3">
        {POINTS.map((point) => (
          <label key={point.id} className="flex min-w-0 flex-col items-center gap-2 text-center">
            <input type="range" min="1" max="5" step="1" value={current[point.id]} onChange={(event) => changePoint(point.id, event.target.value)} className="timeline-slider h-32 cursor-pointer" aria-label={`${question.label} : ${point.label}`} />
            <span className="text-xs font-semibold text-slate-600">{point.label}</span>
            <output className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-700">{current[point.id]}</output>
          </label>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-slate-500">Faites glisser chaque point pour représenter l'évolution de votre journée.</p>
    </div>
  );
}
