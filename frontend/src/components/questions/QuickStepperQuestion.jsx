export default function QuickStepperQuestion({ question, value, onChange }) {
  const { max = 5, plusLabel = `${max}+` } = question.config || {};
  const options = Array.from({ length: max }, (_, i) => i);

  return (
    <div className="flex justify-center gap-2 flex-wrap">
      {options.map((n) => {
        const active = value === n;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-14 h-14 rounded-2xl font-bold text-lg border transition-all ${
              active
                ? 'bg-brand-600 text-white border-brand-600 scale-105 shadow-soft'
                : 'bg-white border-slate-200 hover:border-brand-300 hover:bg-brand-50'
            }`}
          >
            {n}
          </button>
        );
      })}
      <button
        type="button"
        onClick={() => onChange(max)}
        className={`px-5 h-14 rounded-2xl font-bold text-lg border transition-all ${
          value === max
            ? 'bg-brand-600 text-white border-brand-600 scale-105 shadow-soft'
            : 'bg-white border-slate-200 hover:border-brand-300 hover:bg-brand-50'
        }`}
      >
        {plusLabel}
      </button>
    </div>
  );
}
