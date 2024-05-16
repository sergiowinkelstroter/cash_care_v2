import { PlusCircle } from "lucide-react";
import { Category } from "@/types/Category";
import { Button } from "@/components/ui/button";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Unit } from "@/types/Unit";
import { Loading } from "./Loading";
import { AlertDialog, AlertDialogTrigger } from "./ui/alert-dialog";
import { ModalAssocCategoryToUnit } from "./Modals/ModalAssocCategoryToUnit";
import { ModalDeleteUnit } from "./Modals/ModalDeleteUnit";
import { ModalEditUnit } from "./Modals/ModalEditUnit";
import { Dialog, DialogTrigger } from "./ui/dialog";

interface UnitDrawerProps {
  unit?: Unit;
  data?: Array<Category>;
  isLoading?: boolean;
  setOpenEdit: (open: boolean) => void;
  openEdit: boolean;
}

export function UnitDrawer({
  unit,
  data,
  isLoading,
  setOpenEdit,
  openEdit,
}: UnitDrawerProps) {
  if (unit === undefined || data === undefined) return null;

  return (
    <DrawerContent className="bg-gray-100/90">
      <div className="mx-auto w-full max-w-sm">
        <DrawerHeader className="flex flex-row  justify-between">
          <div>
            <DrawerTitle>{unit.description}</DrawerTitle>
            <DrawerDescription>
              {unit.situacao === "A" ? "Ativa" : "Inativa"}
            </DrawerDescription>
          </div>
          <DrawerClose asChild>
            <Button variant="outline">Fechar</Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <div className="py-2 flex flex-col gap-2">
            <p className="text-muted-foreground text-sm font-semibold">
              Categorias:
            </p>
            <div className=" grid grid-cols-2 gap-2">
              {isLoading ? (
                <div className="w-full flex justify-center">
                  <Loading />
                </div>
              ) : data && data.length > 0 ? (
                data.map((category) => (
                  <Button
                    key={category.id}
                    variant={"ghost"}
                    className="border border-black"
                  >
                    {category.description}
                  </Button>
                ))
              ) : (
                <p className="text-center text-muted-foreground text-sm">
                  Não existem categorias associadas a esta unidade
                </p>
              )}
            </div>
          </div>
        </div>
        <DrawerFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="mt-4">
                <PlusCircle />
                <span className="ml-2">Adicionar categoria</span>
              </Button>
            </AlertDialogTrigger>
            <ModalAssocCategoryToUnit
              id={unit.id}
              description={unit.description}
            />
          </AlertDialog>
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogTrigger asChild>
              <Button>Editar</Button>
            </DialogTrigger>
            <ModalEditUnit
              id={unit.id}
              description={unit.description}
              situacao={unit.situacao}
            />
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"}>Deletar</Button>
            </AlertDialogTrigger>
            <ModalDeleteUnit id={unit.id} description={unit.description} />
          </AlertDialog>
        </DrawerFooter>
      </div>
    </DrawerContent>
  );
}
