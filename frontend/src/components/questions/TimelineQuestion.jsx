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

  function changePoint(pointId, nextValue) {
    onChange({ ...current, [pointId]: Number(nextValue) });
  }

  return (
    <div className="mx-auto w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex justify-between text-xs font-medium text-slate-500">
        <span>{question.config?.invert ? 'Très stressé' : 'Très mauvaise'}</span>
        <span>{question.config?.invert ? 'Très calme' : 'Très bonne'}</span>
      </div>
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
