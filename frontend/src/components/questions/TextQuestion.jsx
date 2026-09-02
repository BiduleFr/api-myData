export default function TextQuestion({ question, value, onChange }) {
  const help = question?.help;
  
  return (
    <div className="w-full max-w-md mx-auto">
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Votre réponse (facultatif)…"
        rows={4}
        className="w-full block rounded-2xl border border-slate-200 px-5 py-4 text-base focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
      />
      {help && (
        <div className="mt-3 text-sm text-slate-500 italic bg-slate-50 rounded-lg px-4 py-3 border border-slate-200">
          {help}
        </div>
      )}
    </div>
  );
}
