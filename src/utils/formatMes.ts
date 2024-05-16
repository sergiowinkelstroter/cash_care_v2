export function formatMes(inputDate: string) {
  const [year, month] = inputDate.split("-");
  const formattedMonth = month.length === 1 ? `0${month}` : month.slice();
  return `${formattedMonth}/${year.slice(2)}`;
}
