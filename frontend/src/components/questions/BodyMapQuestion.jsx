// Selection visuelle de zones corporelles, plus rapide qu'une longue liste deroulante.
const ICONS = {
  tete: '\u{1F9E0}',
  nuque_epaules: '\u{1FAAD}',
  dos_haut: '\u{1F9CD}',
  dos_bas: '\u{1F9CD}',
  poitrine: '\u2764\uFE0F',
  bras: '\u{1F4AA}',
  ventre: '\u{1FAC3}',
  hanches: '\u{1FAA9}',
  jambes: '\u{1F9B5}',
  pieds: '\u{1F9B6}'
};

export default function BodyMapQuestion({ question, value, onChange }) {
  const selected = Array.isArray(value) ? value : [];

  function toggle(zone) {
    if (selected.includes(zone)) onChange(selected.filter((z) => z !== zone));
    else onChange([...selected, zone]);
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
      {(question.options || []).map((opt) => {
        const active = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={`flex flex-col items-center gap-1 rounded-2xl px-3 py-4 border transition-all ${
              active
                ? 'bg-brand-600 text-white border-brand-600 scale-105 shadow-soft'
                : 'bg-white border-slate-200 hover:border-brand-300 hover:bg-brand-50'
            }`}
          >
            <span className="text-2xl">{ICONS[opt.value] || '\u{1FAB7}'}</span>
            <span className="text-xs font-semibold text-center">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
