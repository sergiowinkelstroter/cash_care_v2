import { useInstallment } from "@/hooks/useInstallment";
import {
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "../ui/alert-dialog";

interface ModalDeleteInstallmentProps {
  id: string | undefined;
}

export const ModalDeleteInstallment = ({ id }: ModalDeleteInstallmentProps) => {
  const { handleDeleteInstallment } = useInstallment();

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Deletar parcela</AlertDialogTitle>
        <AlertDialogDescription>
          Tem certeza que deseja deletar esta parcela?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          onClick={async () => {
            if (id) {
              await handleDeleteInstallment(id);
            }
          }}
        >
          Deletar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
