// Fenêtre de modification des journées, partagée entre le questionnaire et l'historique.
export const EDITABLE_WINDOW_DAYS = 7;

export function daysBetween(dateA, dateB) {
  const a = new Date(`${dateA}T00:00:00`);
  const b = new Date(`${dateB}T00:00:00`);
  return Math.round((a - b) / 86400000);
}

export function isDateEditable(date, today) {
  const diff = daysBetween(today ?? new Date().toISOString().slice(0, 10), date);
  return diff >= 0 && diff <= EDITABLE_WINDOW_DAYS;
}
