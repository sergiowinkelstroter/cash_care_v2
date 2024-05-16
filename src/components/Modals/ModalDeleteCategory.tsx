import { useCategory } from "@/hooks/useCategory";
import {
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "../ui/alert-dialog";

interface ModalDeleteCategoryProps {
  id: string | undefined;
  description: string | undefined;
}

export const ModalDeleteCategory = ({
  id,
  description,
}: ModalDeleteCategoryProps) => {
  const { handleDeleteCategory } = useCategory();

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Deletar categoria <b>{description}</b>?
        </AlertDialogTitle>
        <AlertDialogDescription>
          Excluindo esta categoria, todos os registros associados a ela, como
          movimentações e contas a pagar, serão também removidos.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          onClick={async () => {
            if (id) {
              await handleDeleteCategory(id);
            }
          }}
        >
          Deletar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
