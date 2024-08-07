"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Drawer, DrawerTrigger } from "./ui/drawer";
import { User } from "@/types/User";
import { AdminContext } from "@/context/AdminContext";
import { UserDrawer } from "./UserDrawer";

export function UsersList({ data }: { data: User[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [itemSelected, setItemSelected] = React.useState<User>();
  const { openUserDrawer, setOpenUserDrawer, openEditUser, setOpenEditUser } =
    React.useContext(AdminContext);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "#",
    },
    {
      accessorKey: "name",
      header: "Nome",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return <div className="truncate">{value}</div>;
      },
    },
    {
      accessorKey: "situacao",
      header: "Situação",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return value === "A" ? "Ativa" : "Inativa";
      },
    },
    {
      accessorKey: "perfil",
      header: "Perfil",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return <div className="truncate capitalize">{value}</div>;
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  function handleItemSelection(row: Row<User>) {
    setItemSelected(row.original);
    setIsLoading(true);
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por nome..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <Drawer
                  key={row.id}
                  open={openUserDrawer}
                  onOpenChange={setOpenUserDrawer}
                >
                  <DrawerTrigger asChild>
                    <TableRow
                      onClick={() => handleItemSelection(row)}
                      className={`cursor-pointer`}
                      //   data-state={isItemSelected && "selected"}
                    >
                      {row.getVisibleCells().map((cell, idx) => (
                        <TableCell key={cell.id} className="py-1">
                          {/* onClick={() => { if (idx > 0) onClick(row.original) }} */}
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </DrawerTrigger>
                  <UserDrawer
                    user={itemSelected}
                    openEditUser={openEditUser}
                    setOpenEditUser={setOpenEditUser}
                  />
                </Drawer>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum Resultado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        {/* <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} registro(s) selecionado(s).
        </div> */}
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="select-none cursor-pointer"
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="select-none cursor-pointer"
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
}
