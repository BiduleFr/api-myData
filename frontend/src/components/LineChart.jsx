// Petit graphique en ligne en SVG pur, sans dépendance externe.
export default function LineChart({ data, height = 180, color = '#6a3fe3' }) {
  const points = data.filter((d) => d.value !== null && d.value !== undefined);
  if (points.length < 2) {
    return (
      <div className="flex items-center justify-center text-sm text-slate-400" style={{ height }}>
        Pas encore assez de données à afficher.
      </div>
    );
  }

  const width = 600;
  const padding = 20;
  const values = points.map((p) => p.value);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 100);

  const stepX = (width - padding * 2) / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = padding + i * stepX;
    const y = height - padding - ((p.value - min) / (max - min || 1)) * (height - padding * 2);
    return [x, y];
  });

  const path = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
  const areaPath = `${path} L${coords[coords.length - 1][0]},${height - padding} L${coords[0][0]},${height - padding} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none">
      <defs>
        <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#chart-fill)" />
      <path d={path} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {coords.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill={color} />
      ))}
    </svg>
  );
}
