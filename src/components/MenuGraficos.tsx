import {
  CartesianGrid,
  Legend,
  LineChart,
  XAxis,
  YAxis,
  Line,
  PieChart,
  Pie,
  ResponsiveContainer,
  Customized,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Tooltip } from "./ui/tooltip";
import { Transaction } from "@/types/Transaction";
import { groupAndSumByCategory } from "@/utils/groupAndSumByCategory";
import { formatMes } from "@/utils/formatMes";

export interface VariationData {
  name: string;
  total: number;
}

export const MenuGrafico = ({
  data,
  variations,
  monthtoday,
}: {
  data: Transaction[];
  variations: VariationData[];
  monthtoday: string;
}) => {
  const mes_atual = formatMes(monthtoday);

  const entradas = data.filter((transaction) => transaction.type === "entrada");
  const saidas = data.filter((transaction) => transaction.type === "saida");

  const saidas_categorias = groupAndSumByCategory(saidas);

  const entradas_categorias = groupAndSumByCategory(entradas);

  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 pb-10">
      <Card className="w-[350px] sm:w-full">
        <Tabs defaultValue="entradas">
          <CardHeader>
            <TabsList className="w-[150px]">
              <TabsTrigger value="entradas">Entradas</TabsTrigger>
              <TabsTrigger value="saidas">Saidas</TabsTrigger>
            </TabsList>
            <CardDescription>Valores por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <TabsContent value="entradas">
              <ResponsiveContainer width="100%" height={250}>
                {entradas_categorias.length === 0 ? (
                  <p className="text-center text-muted-foreground text-sm">
                    Nenhuma entrada
                  </p>
                ) : (
                  <PieChart>
                    <Pie
                      data={entradas_categorias}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {saidas_categorias.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="saidas">
              <ResponsiveContainer width="100%" height={250}>
                {saidas_categorias.length === 0 ? (
                  <p className="text-center text-muted-foreground text-sm">
                    Nenhuma saida
                  </p>
                ) : (
                  <PieChart>
                    <Pie
                      data={saidas_categorias}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {saidas_categorias.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <Customized component={Tooltip} key={"total"} />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
      <Card className="w-[350px] sm:w-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Receita total</CardTitle>
          <CardDescription>
            Valores referentes ao mês de {mes_atual}
            <div className="mt-8">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={variations}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#ed0b0b" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};
