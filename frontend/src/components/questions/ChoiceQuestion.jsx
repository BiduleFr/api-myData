export default function ChoiceQuestion({ question, value, onChange }) {
  return (
    <div className="flex flex-col gap-3 max-w-sm mx-auto">
      {(question.options || []).map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-6 py-4 rounded-2xl font-semibold border text-left transition-all ${
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
