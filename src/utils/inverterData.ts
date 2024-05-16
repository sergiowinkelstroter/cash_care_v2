export function inverterData(data: string) {
  if (data === undefined) return "";
  const date = new Date(data);
  date.setHours(date.getHours() + 3);

  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
