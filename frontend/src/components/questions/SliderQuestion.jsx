export default function SliderQuestion({ question, value, onChange }) {
  const { min = 0, max = 12, step = 0.5, unit = '' } = question.config || {};
  const current = value ?? (min + max) / 2;

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <span className="text-5xl font-extrabold text-brand-700 tabular-nums">
          {current}{unit}
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
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}
