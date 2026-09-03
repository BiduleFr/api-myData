import RatingQuestion from './RatingQuestion.jsx';

export default function DualRatingQuestion({ question, value, onChange }) {
  const current = value && typeof value === 'object' ? value : {};

  return (
    <div className="space-y-7">
      <div>
        <p className="mb-3 text-sm font-semibold text-slate-600">Repas du midi</p>
        <RatingQuestion question={{ ...question, label: 'Qualité du repas du midi' }} value={current.midi} onChange={(midi) => onChange({ ...current, midi })} />
      </div>
      <div>
        <p className="mb-3 text-sm font-semibold text-slate-600">Repas du soir</p>
        <RatingQuestion question={{ ...question, label: 'Qualité du repas du soir' }} value={current.soir} onChange={(soir) => onChange({ ...current, soir })} />
      </div>
    </div>
  );
}
