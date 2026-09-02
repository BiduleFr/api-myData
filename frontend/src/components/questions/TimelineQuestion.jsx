import { useState } from 'react';

const POINTS = [
  { id: 'matin', label: 'Matin', icon: '🌅' },
  { id: 'matinee', label: 'Matinée', icon: '☀️' },
  { id: 'midi', label: 'Midi', icon: '🌞' },
  { id: 'aprem', label: 'Après-midi', icon: '🌤️' },
  { id: 'fin_journee', label: 'Fin journée', icon: '🌆' },
  { id: 'soir', label: 'Soir', icon: '🌙' }
];

const LEVELS = [
  { value: 1, label: 'Très mauvais', emoji: '😔', color: 'bg-red-500' },
  { value: 2, label: 'Mauvais', emoji: '😞', color: 'bg-orange-500' },
  { value: 3, label: 'Neutre', emoji: '😐', color: 'bg-slate-400' },
  { value: 4, label: 'Bon', emoji: '🙂', color: 'bg-lime-500' },
  { value: 5, label: 'Très bon', emoji: '😊', color: 'bg-green-500' }
];

export default function TimelineQuestion({ question, value, onChange }) {
  const current = value || POINTS.reduce((acc, p) => ({ ...acc, [p.id]: 3 }), {});
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const handlePointChange = (pointId, level) => {
    onChange({ ...current, [pointId]: level });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="space-y-8">
        {/* Timeline horizontale avec points */}
        <div className="px-4">
          <div className="relative h-32 flex items-center justify-between mb-2">
            {/* Ligne de base */}
            <div className="absolute inset-x-0 top-1/2 h-1 bg-slate-200 -translate-y-1/2 pointer-events-none" />

            {/* Points de la timeline */}
            {POINTS.map((point, idx) => {
              const levelValue = current[point.id] || 3;
              const level = LEVELS.find(l => l.value === levelValue) || LEVELS[2];
              const isHovered = hoveredPoint === point.id;

              return (
                <div
                  key={point.id}
                  className="relative flex flex-col items-center group cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(point.id)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Sélecteur vertical */}
                  <div className="absolute bottom-full mb-2 flex flex-col-reverse gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg shadow-lg p-2 border border-slate-200 z-10">
                    {LEVELS.map((lv) => (
                      <button
                        key={lv.value}
                        type="button"
                        onClick={() => handlePointChange(point.id, lv.value)}
                        className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${lv.color} text-white hover:scale-110 ${
                          levelValue === lv.value ? 'ring-2 ring-offset-1 ring-slate-400' : ''
                        }`}
                        title={lv.label}
                      >
                        {lv.value}
                      </button>
                    ))}
                  </div>

                  {/* Point principal */}
                  <div
                    className={`w-10 h-10 rounded-full ${level.color} text-white flex items-center justify-center font-bold text-lg shadow-soft transition-all ${
                      isHovered ? 'scale-125 ring-4 ring-offset-2 ring-slate-300' : 'scale-100'
                    }`}
                  >
                    {level.value}
                  </div>

                  {/* Label et heure */}
                  <div className="text-center mt-3 flex flex-col items-center">
                    <span className="text-2xl mb-1">{point.icon}</span>
                    <span className="text-xs font-semibold text-slate-700">{point.label}</span>
                  </div>

                  {/* Info au survol */}
                  {isHovered && (
                    <div className="absolute top-full mt-12 bg-slate-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-20">
                      {level.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Légende */}
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="text-xs text-slate-600 font-semibold mb-2">Échelle :</div>
          <div className="flex flex-wrap gap-2 justify-center">
            {LEVELS.map((lv) => (
              <div key={lv.value} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded ${lv.color} flex items-center justify-center text-white text-xs font-bold`}>
                  {lv.value}
                </div>
                <span className="text-xs text-slate-600">{lv.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Résumé */}
        <div className="text-center text-sm text-slate-500">
          Cliquez/survolez les points pour modifier, glissez ou sélectionnez l'échelle
        </div>
      </div>
    </div>
  );
}
