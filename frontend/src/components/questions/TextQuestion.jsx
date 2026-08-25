export default function TextQuestion({ value, onChange }) {
  return (
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Votre réponse (facultatif)…"
      rows={3}
      className="w-full max-w-md mx-auto block rounded-2xl border border-slate-200 px-5 py-4 text-base focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
    />
  );
}
