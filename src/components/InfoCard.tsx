import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface InfoCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: string;
  bgColor?: string;
}
export const InfoCard = ({
  title,
  value,
  icon,
  color,
  bgColor,
}: InfoCardProps) => {
  const valor = value ? value : "0";

  return (
    <Card className={`${color} ${bgColor}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm lg:text-base font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {" "}
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(Number(valor))}
        </div>
      </CardContent>
    </Card>
  );
};
