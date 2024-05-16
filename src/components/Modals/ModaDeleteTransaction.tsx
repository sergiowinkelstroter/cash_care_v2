import { useTransaction } from "@/hooks/useTransaction";
import {
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "../ui/alert-dialog";

interface ModalDeleteTransactionProps {
  id: string | undefined;
}

export const ModalDeleteTransaction = ({ id }: ModalDeleteTransactionProps) => {
  const { handleDeleteTransaction } = useTransaction();

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Deletar Transação</AlertDialogTitle>
        <AlertDialogDescription>
          Tem certeza que deseja deletar esta transação?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          onClick={async () => {
            if (id) {
              await handleDeleteTransaction(id);
            }
          }}
        >
          Deletar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
