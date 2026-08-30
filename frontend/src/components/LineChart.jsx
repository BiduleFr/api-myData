import { useState } from 'react';

// Graphique en ligne SVG interactif avec tooltip tactile et survol.
export default function LineChart({ data = [], height = 180, color = '#6a3fe3' }) {
  const [activePoint, setActivePoint] = useState(null);

  const points = data.filter((d) => d && d.value !== null && d.value !== undefined);
  if (points.length < 2) {
    return (
      <div className="flex items-center justify-center text-sm text-slate-400" style={{ height }}>
        Pas encore assez de données à afficher (au moins 2 journées nécessaires).
      </div>
    );
  }

  const width = 600;
  const paddingX = 30;
  const paddingY = 24;
  const values = points.map((p) => Number(p.value));
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 100);

  const stepX = (width - paddingX * 2) / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = paddingX + i * stepX;
    const y = height - paddingY - ((Number(p.value) - min) / (max - min || 1)) * (height - paddingY * 2);
    return { ...p, x, y, numValue: Number(p.value), index: i };
  });

  const path = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x},${c.y}`).join(' ');
  const areaPath = `${path} L${coords[coords.length - 1].x},${height - paddingY} L${coords[0].x},${height - paddingY} Z`;

  function formatDate(dStr) {
    if (!dStr) return '';
    try {
      const d = new Date(`${dStr}T00:00:00`);
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dStr;
    }
  }

  function handleInteraction(clientX, rect) {
    if (!rect || rect.width === 0) return;
    const relX = ((clientX - rect.left) / rect.width) * width;
    let closest = coords[0];
    let minDist = Math.abs(coords[0].x - relX);
    for (const c of coords) {
      const dist = Math.abs(c.x - relX);
      if (dist < minDist) {
        minDist = dist;
        closest = c;
      }
    }
    setActivePoint(closest);
  }

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full touch-none"
        style={{ height }}
        preserveAspectRatio="none"
        onMouseMove={(e) => handleInteraction(e.clientX, e.currentTarget.getBoundingClientRect())}
        onMouseLeave={() => setActivePoint(null)}
        onTouchStart={(e) => {
          if (e.touches[0]) handleInteraction(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
        }}
        onTouchMove={(e) => {
          if (e.touches[0]) handleInteraction(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
        }}
      >
        <defs>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Lignes de repère douces */}
        <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#f1f5f9" strokeDasharray="4 4" />
        <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#f1f5f9" strokeDasharray="4 4" />
        <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#e2e8f0" />

        <path d={areaPath} fill="url(#chart-fill)" />
        <path d={path} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {coords.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={activePoint && activePoint.index === i ? '6' : '3.5'}
            fill={activePoint && activePoint.index === i ? '#ffffff' : color}
            stroke={color}
            strokeWidth={activePoint && activePoint.index === i ? '3' : '1.5'}
            className="transition-all"
          />
        ))}

        {activePoint && (
          <line
            x1={activePoint.x}
            y1={paddingY}
            x2={activePoint.x}
            y2={height - paddingY}
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.6"
          />
        )}
      </svg>

      {/* Tooltip flottant au survol / tap */}
      {activePoint && (
        <div
          className="pointer-events-none absolute -top-2 transform -translate-x-1/2 -translate-y-full bg-slate-900/90 backdrop-blur text-white text-xs rounded-xl px-3 py-1.5 shadow-lg flex flex-col items-center gap-0.5 z-20 whitespace-nowrap animate-fade-up"
          style={{
            left: `${(activePoint.x / width) * 100}%`
          }}
        >
          <span className="text-[10px] text-slate-300">{formatDate(activePoint.date)}</span>
          <span className="font-bold text-sm text-brand-300">
            Score : {activePoint.numValue.toLocaleString('fr-FR', { maximumFractionDigits: 1 })}
          </span>
        </div>
      )}
    </div>
  );
}
