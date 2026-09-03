function formatMinutes(minutes) {
  if (minutes === 0) return '0 min';
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (hours === 0) return `${remainder} min`;
  return remainder === 0 ? `${hours} h` : `${hours} h ${remainder}`;
}

export default function DurationQuestion({ question, value, onChange }) {
  const values = question.config?.values || [0];
  const selectedIndex = Math.max(0, values.indexOf(value));
  const current = values[selectedIndex];

  return (
    <div className="w-full max-w-md mx-auto">
      <output className="mb-5 block text-center text-5xl font-extrabold tabular-nums text-brand-700">
        {formatMinutes(current)}
      </output>
      <input
        type="range"
        min="0"
        max={values.length - 1}
        step="1"
        value={selectedIndex}
        onChange={(event) => onChange(values[Number(event.target.value)])}
        className="w-full h-2 cursor-pointer appearance-none rounded-full bg-brand-100 accent-brand-600"
        aria-label={question.label}
      />
      <div className="mt-2 flex justify-between text-xs text-slate-400">
        <span>{formatMinutes(values[0])}</span>
        <span>{formatMinutes(values[values.length - 1])}</span>
      </div>
    </div>
  );
}
