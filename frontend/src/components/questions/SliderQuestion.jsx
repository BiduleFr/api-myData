// Formate les heures et minutes de manière lisible
function formatDuration(value, unit) {
  if (unit === 'min') {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    if (hours === 0) return `${minutes} min`;
    return minutes === 0 ? `${hours} h` : `${hours} h ${minutes}`;
  }
  if (unit !== 'h' && unit !== 'heure' && unit !== 'heures') {
    return `${value}${unit}`;
  }
  
  // Convertir en heures et minutes
  const hours = Math.floor(value);
  const minutes = Math.round((value - hours) * 60);
  
  if (minutes === 0) {
    return `${hours} h`;
  }
  return `${hours} h ${minutes}`;
}

export default function SliderQuestion({ question, value, onChange }) {
  const { min = 0, max = 12, step = 0.5, unit = '' } = question.config || {};
  const current = value ?? question.config?.defaultValue ?? (min + max) / 2;
  const displayValue = formatDuration(current, unit);

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <span className="text-5xl font-extrabold text-brand-700 tabular-nums">
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none bg-brand-100 accent-brand-600 cursor-pointer"
      />
      <div className="flex justify-between text-xs text-slate-400 mt-2">
        <span>{formatDuration(min, unit)}</span>
        <span>{formatDuration(max, unit)}</span>
      </div>
    </div>
  );
}
