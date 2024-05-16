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
import { Installment } from "@/types/Installment";
import { inverterData } from "@/utils/inverterData";

interface ModalRetirarBaixaInstallmentProps {
  item: Installment;
}

export const ModalRetirarBaixaInstallment = ({
  item,
}: ModalRetirarBaixaInstallmentProps) => {
  const { handleRetirarBaixarInstallment } = useInstallment();

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="text-center text-xl">
          Retirar Baixa
        </AlertDialogTitle>
        {/* <AlertDialogDescription>
          Tem certeza que deseja retirar a baixa desta parcela?
        </AlertDialogDescription> */}
      </AlertDialogHeader>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
        <p className="flex flex-col">
          <b>Parcela</b>
          <span className="bg-gray-50 border border-gray-300 p-2 w-full rounded">
            {item.moviment?.description}
          </span>
        </p>
        <p className="flex flex-col">
          <b>Data da baixa</b>{" "}
          <span className="bg-gray-50 border border-gray-300 p-2 w-full rounded">
            {item.moviment?.date && inverterData(item.moviment.date)}
          </span>
        </p>
        <p className="flex flex-col">
          <b>Valor pago </b>
          <span className="bg-gray-50 border border-gray-300 p-2 w-full rounded">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(item.moviment?.value) || 0)}
          </span>
        </p>
        <p className="flex flex-col">
          <b>Forma de pagamento</b>
          <span className="bg-gray-50 border border-gray-300 p-2 w-full rounded">
            {item.moviment?.paymentMethod || "Não informada"}
          </span>
        </p>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          onClick={async () => {
            if (item.id) {
              await handleRetirarBaixarInstallment(item.id, item.status);
            }
          }}
        >
          Retirar baixa
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
