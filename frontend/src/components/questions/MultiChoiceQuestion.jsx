export default function MultiChoiceQuestion({ question, value, onChange }) {
  const selected = Array.isArray(value) ? value : [];

  function toggle(optValue) {
    if (selected.includes(optValue)) {
      onChange(selected.filter((v) => v !== optValue));
    } else {
      onChange([...selected, optValue]);
    }
  }

  return (
    <div className="flex flex-wrap justify-center gap-3 max-w-lg mx-auto">
      {(question.options || []).map((opt) => {
        const active = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={`px-5 py-3 rounded-full font-semibold border transition-all ${
              active
                ? 'bg-brand-600 text-white border-brand-600 shadow-soft'
                : 'bg-white border-slate-200 hover:border-brand-300 hover:bg-brand-50'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
