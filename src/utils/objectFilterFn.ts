import { FilterFn, Row } from "@tanstack/react-table";

export const objectFilterFn: FilterFn<any> = (
  row: Row<any>,
  columnId: string,
  filterValue: string
) => {
  const value = row.getValue(columnId);
  if (typeof value === "object" && value !== null && "description" in value) {
    return (value as { description: string }).description
      .toLowerCase()
      .includes(filterValue.toLowerCase());
  }
  return false;
};
