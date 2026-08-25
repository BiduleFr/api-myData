export default function TimeQuestion({ value, onChange }) {
  return (
    <div className="flex justify-center">
      <input
        type="time"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="text-2xl font-bold text-brand-700 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-brand-400"
      />
    </div>
  );
}
