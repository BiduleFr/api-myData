// Formate la valeur d'une réponse pour un affichage lisible en résumé de journée.
function formatMinutes(minutes) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest}`;
}

function optionLabel(question, value) {
  const option = (question.options || []).find((opt) => opt.value === value);
  return option?.label ?? String(value);
}

export function formatAnswerValue(question, value) {
  if (value === undefined || value === null || value === '') return null;

  switch (question.type) {
    case 'boolean':
      return value ? 'Oui' : 'Non';
    case 'choice':
      return optionLabel(question, value);
    case 'multichoice':
      return Array.isArray(value) && value.length ? value.map((v) => optionLabel(question, v)).join(', ') : null;
    case 'bodymap':
      return Array.isArray(value) && value.length ? value.map((v) => optionLabel(question, v)).join(', ') : null;
    case 'slider': {
      const unit = question.config?.unit;
      if (unit === 'h') {
        const hours = Math.floor(value);
        const minutes = Math.round((value - hours) * 60);
        return minutes === 0 ? `${hours} h` : `${hours} h ${minutes}`;
      }
      return `${value}${unit || ''}`;
    }
    case 'duration':
      return formatMinutes(Number(value));
    case 'number':
      return `${value}${question.config?.unit || ''}`;
    case 'rating':
    case 'scale':
      return `${value} / ${question.config?.max ?? 10}`;
    case 'quickstep':
      return String(value);
    case 'dualrating': {
      if (!value || typeof value !== 'object') return null;
      const parts = [];
      if (value.midi !== undefined) parts.push(`Midi : ${value.midi}/10`);
      if (value.soir !== undefined) parts.push(`Soir : ${value.soir}/10`);
      return parts.join(' · ') || null;
    }
    case 'timeline': {
      if (!value || typeof value !== 'object') return null;
      const labels = { matin: 'Matin', matinee: 'Matinée', midi: 'Midi', aprem: 'Après-midi', fin_journee: 'Fin de journée', soir: 'Soir' };
      return Object.entries(value).map(([id, v]) => `${labels[id] || id} ${v}/5`).join(' · ');
    }
    case 'text':
      return value;
    case 'time':
      return value;
    default:
      return String(value);
  }
}
