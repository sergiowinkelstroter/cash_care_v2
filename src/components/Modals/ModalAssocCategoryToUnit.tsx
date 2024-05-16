import { useContext, useEffect, useState } from "react";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { useMutation, useQueryClient } from "react-query";
import { Category } from "@/types/Category";
import { Check } from "lucide-react";
import { UnitContext } from "@/context/UnitContext";

export const ModalAssocCategoryToUnit = ({
  id,
  description,
}: {
  id: string;
  description: string;
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesSeleted, setCategoriesSeleted] = useState<number[]>([]);
  const [isLoadingCategory, setIsLoadingCategory] = useState(true);
  const { setOpenDrawer } = useContext(UnitContext);

  const { mutateAsync: updateUnit, isLoading } = useMutation({
    mutationKey: ["categorias"],
    mutationFn: async () => {
      await api.post(`/unit/categories?id=${id}`, {
        categories: categoriesSeleted,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });

  useEffect(() => {
    setIsLoadingCategory(true);
    api.get(`/categories-unit?id=${id}`).then((data) => {
      setIsLoadingCategory(false);
      setCategories(data.data);
    });
  }, [id]);

  async function handleCategoryClick(categoryId: string) {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === categoryId
          ? { ...category, associated: !category.associated }
          : category
      )
    );
    setCategoriesSeleted((prevCategories) =>
      prevCategories.includes(Number(categoryId))
        ? prevCategories.filter((id) => id !== Number(categoryId))
        : [...prevCategories, Number(categoryId)]
    );
  }

  async function handleAssociateCategories() {
    try {
      await updateUnit();
      setOpenDrawer(false);
      toast({
        description: "Agora sua unidade tem novas categorias!",
        title: "Sucesso!",
        variant: "default",
      });
    } catch (error) {
      toast({
        description: "Erro ao editar a unidade",
        title: "Algo de errado aconteceu!!",
        variant: "destructive",
      });
    }
  }

  return (
    <AlertDialogContent className="w-[320px] sm:w-full  sm:mt-0">
      {isLoadingCategory ? (
        <p>Carregando...</p>
      ) : (
        <>
          <AlertDialogHeader className="mb-4">
            <AlertDialogTitle className="text-xl ">
              Associar categorias a unidade: <b>{description.toUpperCase()}</b>
            </AlertDialogTitle>
            {/* <AlertDialogDescription>
              Clique nas categorias que deseja associar.
            </AlertDialogDescription> */}
          </AlertDialogHeader>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <p
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`${
                  category.associated
                    ? "text-white bg-green-500"
                    : "border border-black"
                } cursor-pointer flex items-center gap-2  rounded-md  p-2 justify-center font-medium `}
              >
                {category.associated && <Check />}
                {category.description}
              </p>
            ))}
          </div>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              disabled={isLoading}
              onClick={handleAssociateCategories}
            >
              Associar
            </AlertDialogAction>
          </AlertDialogFooter>
        </>
      )}
    </AlertDialogContent>
  );
};
