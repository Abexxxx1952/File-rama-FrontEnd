export function formatDate(isoDate: string) {
  const dateFromIso = new Date(isoDate);
  const date = dateFromIso.toLocaleDateString("ru-RU");
  const time = dateFromIso.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${date} ${time}`;
}
