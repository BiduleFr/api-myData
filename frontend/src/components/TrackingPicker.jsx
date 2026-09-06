import { HABITS, BEHAVIORS, getTracking, itemLabel } from '../lib/tracking';

export default function TrackingPicker({ kind, preferences, locale = 'fr', onToggle }) {
  const catalog = kind === 'habit' ? HABITS : BEHAVIORS;
  const tracking = getTracking(preferences);
  const active = new Set(
    (kind === 'habit' ? tracking.habits : tracking.behaviors)
      .filter((item) => item.active !== false)
      .map((item) => item.id)
  );

  return (
    <div className="grid grid-cols-2 gap-2 max-w-md mx-auto text-left">
      {catalog.map((item) => {
        const isActive = active.has(item.id);
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onToggle(kind, item.id)}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all ${
              isActive
                ? 'bg-brand-600 text-white border-brand-600 shadow-soft'
                : 'bg-white border-slate-200 hover:border-brand-300 hover:bg-brand-50'
            }`}
          >
            <span>{item.icon}</span>
            <span>{itemLabel(item, locale)}</span>
          </button>
        );
      })}
      <p className="col-span-2 text-center text-xs text-slate-400 mt-1">
        {locale === 'en'
          ? 'Selected items will be asked from tomorrow onward.'
          : 'Les éléments sélectionnés seront demandés à partir du questionnaire de demain.'}
      </p>
    </div>
  );
}
