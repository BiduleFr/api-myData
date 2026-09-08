import { useAppearance } from '../../context/AppearanceContext.jsx';

export default function DualCountQuestion({ question, value, onChange }) {
  const { locale } = useAppearance();
  const current = value && typeof value === 'object' ? value : {};
  const left = current.left ?? question.config?.defaultLeft ?? 0;
  const right = current.right ?? question.config?.defaultRight ?? 0;
  const { max = 12, leftLabel = 'A', rightLabel = 'B' } = question.config || {};

  function update(side, next) {
    onChange({ left: side === 'left' ? next : left, right: side === 'right' ? next : right });
  }

  function stepper(side, value) {
    return (
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => update(side, Math.max(0, value - 1))}
          className="w-11 h-11 rounded-full bg-white border border-slate-200 text-lg font-bold text-brand-600 hover:bg-brand-50 active:scale-90 transition-all"
          aria-label={`${locale === 'en' ? 'Decrease' : 'Diminuer'} ${side === 'left' ? leftLabel : rightLabel}`}
        >
          −
        </button>
        <span className="text-3xl font-extrabold text-brand-700 tabular-nums w-10 text-center">{value}</span>
        <button
          type="button"
          onClick={() => update(side, Math.min(max, value + 1))}
          className="w-11 h-11 rounded-full bg-white border border-slate-200 text-lg font-bold text-brand-600 hover:bg-brand-50 active:scale-90 transition-all"
          aria-label={`${locale === 'en' ? 'Increase' : 'Augmenter'} ${side === 'left' ? leftLabel : rightLabel}`}
        >
          +
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-5">
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-600">{leftLabel}</p>
        {stepper('left', left)}
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-600">{rightLabel}</p>
        {stepper('right', right)}
      </div>
    </div>
  );
}
