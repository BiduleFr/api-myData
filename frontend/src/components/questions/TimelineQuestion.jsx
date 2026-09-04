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
  const globalValue = Math.round(POINTS.reduce((sum, point) => sum + current[point.id], 0) / POINTS.length);

  function changePoint(pointId, nextValue) {
    onChange({ ...current, [pointId]: Number(nextValue) });
  }

  function changeAll(nextValue) {
    onChange(Object.fromEntries(POINTS.map(({ id }) => [id, Number(nextValue)])));
  }

  return (
    <div className="mx-auto w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-5 rounded-lg bg-slate-50 px-4 py-3">
        <label className="block text-sm font-semibold text-slate-600">
          Ajuster tous les points
          <input type="range" min="1" max="5" step="1" value={globalValue} onChange={(event) => changeAll(event.target.value)} className="elan-rating mt-3 w-full" aria-label="Ajuster tous les points" />
        </label>
      </div>

      <div className="relative px-4 pt-2 pb-3">
        <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-4 top-2 h-24 w-[calc(100%-2rem)] overflow-visible" role="img" aria-label="Évolution de la journée">
          <polyline
            points={POINTS.map((point, index) => {
              const x = (index / (POINTS.length - 1)) * 100;
              const y = 26 - ((current[point.id] - 1) / 4) * 22;
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="#6a3fe3"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="relative grid grid-cols-6 gap-2">
          {POINTS.map((point) => (
            <label key={point.id} className="flex min-w-0 flex-col items-center gap-2 text-center">
              <input type="range" min="1" max="5" step="1" value={current[point.id]} onChange={(event) => changePoint(point.id, event.target.value)} className="timeline-slider h-24 cursor-pointer" aria-label={`${question.label} : ${point.label}`} />
              <span className="text-xs font-semibold text-slate-600">{point.label}</span>
            </label>
          ))}
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-slate-500">Faites glisser les curseurs pour modifier les points reliés.</p>
    </div>
  );
}
