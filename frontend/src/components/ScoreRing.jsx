export default function ScoreRing({ score, size = 160, label = 'Score du jour' }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeScore = score ?? 0;
  const offset = circumference - (safeScore / 100) * circumference;

  const color = safeScore >= 75 ? '#6a3fe3' : safeScore >= 50 ? '#7c5cf0' : '#ff9f5b';

  const formattedScore =
    score !== null && score !== undefined
      ? Number(score).toLocaleString('fr-FR', { maximumFractionDigits: 1 })
      : '–';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#f1eefe" strokeWidth={12} fill="none" />
        {score !== null && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={12}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        )}
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-extrabold text-slate-800 tabular-nums">
          {formattedScore}
        </span>
        <span className="text-xs text-slate-400 mt-1">{label}</span>
      </div>
    </div>
  );
}
