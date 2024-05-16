import {
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "../ui/alert-dialog";
import { useUnit } from "@/hooks/useUnit";

interface ModalDeleteUnitProps {
  id: string | undefined;
  description: string | undefined;
}

export const ModalDeleteUnit = ({ id, description }: ModalDeleteUnitProps) => {
  const { handleDeleteUnit } = useUnit();

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Deletar Unidade <b>{description}</b>?
        </AlertDialogTitle>
        <AlertDialogDescription>
          Excluindo esta unidade, todos os registros associados a ela, como
          movimentações e contas a pagar, serão também removidos.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          onClick={async () => {
            if (id) {
              await handleDeleteUnit(id);
            }
          }}
        >
          Deletar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
