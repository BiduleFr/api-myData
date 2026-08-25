export default function BooleanQuestion({ value, onChange }) {
  return (
    <div className="flex justify-center gap-4">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`px-10 py-4 rounded-2xl font-bold text-lg border transition-all ${
          value === true
            ? 'bg-brand-600 text-white border-brand-600 scale-105 shadow-soft'
            : 'bg-white border-slate-200 hover:border-brand-300 hover:bg-brand-50'
        }`}
      >
        Oui
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`px-10 py-4 rounded-2xl font-bold text-lg border transition-all ${
          value === false
            ? 'bg-brand-600 text-white border-brand-600 scale-105 shadow-soft'
            : 'bg-white border-slate-200 hover:border-brand-300 hover:bg-brand-50'
        }`}
      >
        Non
      </button>
    </div>
  );
}
