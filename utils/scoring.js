// Calcule les scores (par module + global) à partir des réponses réellement fournies.
// Les questions non renseignées sont simplement exclues du calcul, sans pénalité.
// La précision est conservée au dixième (ex: 82.5).
function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value * 10) / 10));
}

function scoreQuestion(question, value) {
  if (value === undefined || value === null || value === '') return null;

  switch (question.type) {
    case 'scale': {
      const { min = 1, max = 5, invert = false } = question.config || {};
      let s = ((Number(value) - min) / (max - min)) * 100;
      if (invert) s = 100 - s;
      return clamp(s);
    }
    case 'slider': {
      const { min = 0, max = 12, targetMin, targetMax } = question.config || {};
      const v = Number(value);
      if (targetMin === undefined || targetMax === undefined) {
        return clamp(((v - min) / (max - min)) * 100);
      }
      if (v >= targetMin && v <= targetMax) return 100;
      if (v < targetMin) return clamp((v / targetMin) * 100);
      return clamp(100 - ((v - targetMax) / (max - targetMax)) * 100);
    }
    case 'number': {
      const { target = 60, invert = false } = question.config || {};
      let s = clamp((Number(value) / target) * 100);
      if (invert) s = 100 - s;
      return clamp(s);
    }
    case 'boolean': {
      const positive = question.config?.positiveValue !== false;
      const v = value === true || value === 'true';
      return v === positive ? 100 : 0;
    }
    case 'choice': {
      const opt = (question.options || []).find((o) => o.value === value);
      return opt && typeof opt.score === 'number' ? opt.score : null;
    }
    case 'quickstep': {
      const { max = 5, invert = false } = question.config || {};
      let s = clamp((Number(value) / max) * 100);
      if (invert) s = 100 - s;
      return clamp(s);
    }
    case 'multichoice': {
      if (!Array.isArray(value) || value.length === 0) return null;
      const opts = question.options || [];
      const scores = value
        .map((v) => opts.find((o) => o.value === v)?.score)
        .filter((s) => typeof s === 'number');
      if (!scores.length) return null;
      return clamp(scores.reduce((a, b) => a + b, 0) / scores.length);
    }
    case 'time':
    case 'text':
    case 'bodymap':
    default:
      return null; // non noté
  }
}

function computeScores(modules, preferences, answers) {
  const moduleScores = {};
  let weightedSum = 0;
  let totalWeight = 0;

  for (const mod of modules) {
    const modPref = preferences?.[mod.id];
    if (modPref?.enabled === false) continue;

    let modWeightedSum = 0;
    let modWeightTotal = 0;

    for (const q of mod.questions) {
      const qPref = modPref?.questions?.[q.id];
      if (qPref?.enabled === false) continue;

      const s = scoreQuestion(q, answers?.[q.id]);
      if (s === null) continue;

      const w = q.weight ?? 1;
      if (w <= 0) continue;
      modWeightedSum += s * w;
      modWeightTotal += w;
    }

    if (modWeightTotal > 0) {
      const modScore = Math.round((modWeightedSum / modWeightTotal) * 10) / 10;
      moduleScores[mod.id] = modScore;
      const mw = mod.weight ?? 1;
      weightedSum += modScore * mw;
      totalWeight += mw;
    }
  }

  const globalScore = totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 10) / 10 : null;
  return { globalScore, moduleScores };
}

module.exports = { computeScores, scoreQuestion };
