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
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Unit } from "@/types/Unit";
import { ModalDeleteUnit } from "./Modals/ModalDeleteUnit";
import { ModalEditUnit } from "./Modals/ModalEditUnit";
import { ModalAssocCategoryToUnit } from "./Modals/ModalAssocCategoryToUnit";
import { Drawer, DrawerTrigger } from "./ui/drawer";
import { UnitDrawer } from "./UnitDrawer";
import { api } from "@/lib/axios";
import { Category } from "@/types/Category";
import { UnitContext } from "@/context/UnitContext";

export function UnitList({ data }: { data: Unit[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [itemSelected, setItemSelected] = React.useState<Unit>();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const { openDrawer, setOpenDrawer, openEditUnit, setOpenEditUnit } =
    React.useContext(UnitContext);

  const columns: ColumnDef<Unit>[] = [
    {
      accessorKey: "id",
      header: "#",
    },
    {
      accessorKey: "description",
      header: "Descrição",
    },
    {
      accessorKey: "situacao",
      header: "Situação",
      cell: (info) => {
        return info.getValue() === "A" ? "Ativa" : "Inativa";
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

  function handleItemSelection(row: Row<Unit>) {
    setItemSelected(row.original);
    setIsLoading(true);
    api.get(`/unit/categories?id=${row.original.id}`).then((data) => {
      setCategories(data.data);
      setIsLoading(false);
    });
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por descrição..."
          value={
            (table.getColumn("description")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("description")?.setFilterValue(event.target.value)
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
                  open={openDrawer}
                  onOpenChange={setOpenDrawer}
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
                  <UnitDrawer
                    unit={itemSelected}
                    data={categories}
                    isLoading={isLoading}
                    openEdit={openEditUnit}
                    setOpenEdit={setOpenEditUnit}
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

      {/* <div className="flex items-center justify-end space-x-2 mt-5">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={"outline"} disabled={!isItemSelected}>
              Associar uma categoria
            </Button>
          </AlertDialogTrigger>
          <ModalAssocCategoryToUnit
            id={itemSelected}
            description={description}
          />
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={!isItemSelected} variant={"destructive"}>
              Deletar
            </Button>
          </AlertDialogTrigger>
          <ModalDeleteUnit id={itemSelected} description={description} />
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={!isItemSelected}>Editar</Button>
          </AlertDialogTrigger>
          <ModalEditUnit id={itemSelected} description={description} />
        </AlertDialog>
      </div> */}
      <div className="mt-4">
        <p className="text-xs text-muted-foreground">
          *Para editar ou excluir uma unidade existente, ou associar uma
          categoria, você precisa primeiro selecioná-la na lista.
        </p>
      </div>
    </div>
  );
}
