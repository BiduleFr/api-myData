export default function ScaleQuestion({ question, value, onChange }) {
  const { min = 1, max = 5, emojis } = question.config || {};
  const count = max - min + 1;
  const items = Array.from({ length: count }, (_, i) => min + i);

  return (
    <div className="flex justify-center gap-2 sm:gap-4 flex-wrap">
      {items.map((item, idx) => {
        const active = value === item;
        return (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`flex flex-col items-center gap-2 rounded-2xl px-4 py-3 transition-all border ${
              active
                ? 'bg-brand-600 text-white border-brand-600 scale-105 shadow-soft'
                : 'bg-white border-slate-200 hover:border-brand-300 hover:bg-brand-50'
            }`}
          >
            <span className="text-3xl">{emojis?.[idx] ?? '⭐'}</span>
            <span className="text-xs font-semibold">{item}</span>
          </button>
        );
      })}
    </div>
  );
}
