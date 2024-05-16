"use client";
import { PageContainer } from "@/components/PageContainer";
import { Card } from "@/components/ui/card";
import { Pie, PieChart } from "recharts";

const data01 = [
  {
    name: "Group A",
    value: 400,
  },
  {
    name: "Group B",
    value: 300,
  },
  {
    name: "Group C",
    value: 300,
  },
  {
    name: "Group D",
    value: 200,
  },
  {
    name: "Group E",
    value: 278,
  },
  {
    name: "Group F",
    value: 189,
  },
];
const data02 = [
  {
    name: "Group A",
    value: 2400,
  },
  {
    name: "Group B",
    value: 4567,
  },
  {
    name: "Group C",
    value: 1398,
  },
  {
    name: "Group D",
    value: 9800,
  },
  {
    name: "Group E",
    value: 3908,
  },
  {
    name: "Group F",
    value: 4800,
  },
];
export default function Analise() {
  return (
    <PageContainer>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3   px-4 md:px-8">
        <Card className="items-center justify-center flex">
          <PieChart width={730} height={250}>
            <Pie
              data={data01}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#2c24ca"
            />
          </PieChart>
        </Card>
      </div>
    </PageContainer>
  );
}
