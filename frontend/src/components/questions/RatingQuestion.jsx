export default function RatingQuestion({ question, value, onChange }) {
  const { min = 1, max = 10, defaultValue = Math.ceil((min + max) / 2), labels = [] } = question.config || {};
  const current = value ?? defaultValue;
  const progress = ((current - min) / (max - min || 1)) * 100;

  return (
    <div className="w-full max-w-md mx-auto">
      <output className="mb-5 block text-center text-5xl font-extrabold tabular-nums text-brand-700">
        {current}<span className="ml-1 text-lg text-slate-400">/ {max}</span>
      </output>
      <input
        type="range"
        min={min}
        max={max}
        step="1"
        value={current}
        onChange={(event) => onChange(Number(event.target.value))}
        className="elan-rating w-full"
        style={{ background: `linear-gradient(90deg, #ef4444 0%, #f59e0b 45%, #22c55e 100%)`, backgroundSize: `${Math.max(progress, 8)}% 100%, 100% 100%` }}
        aria-label={question.label}
      />
      {labels.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-500">
          <span className="text-left">{labels[0]}</span>
          <span className="text-center">{labels[Math.floor(labels.length / 2)]}</span>
          <span className="text-right">{labels[labels.length - 1]}</span>
        </div>
      )}
    </div>
  );
}
