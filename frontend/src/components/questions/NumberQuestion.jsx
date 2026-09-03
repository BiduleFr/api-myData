export default function NumberQuestion({ question, value, onChange }) {
  const { min = 0, max = 240, unit = '', step: increment = 1 } = question.config || {};
  const current = value ?? '';

  function step(delta) {
    const base = Number(value ?? min);
    const next = Math.min(max, Math.max(min, base + delta));
    onChange(next);
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => step(-increment)}
        className="w-12 h-12 rounded-full bg-white border border-slate-200 text-xl font-bold text-brand-600 hover:bg-brand-50 active:scale-90 transition-all"
      >
        −
      </button>
      <div className="text-4xl font-extrabold text-brand-700 tabular-nums w-28 text-center">
        {current === '' ? '—' : current}{unit}
      </div>
      <button
        type="button"
        onClick={() => step(increment)}
        className="w-12 h-12 rounded-full bg-white border border-slate-200 text-xl font-bold text-brand-600 hover:bg-brand-50 active:scale-90 transition-all"
      >
        +
      </button>
    </div>
  );
}
