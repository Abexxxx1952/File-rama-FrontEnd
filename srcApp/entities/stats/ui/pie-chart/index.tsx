"use client";

import {
  pieChartColorFirst,
  pieChartColorSecond,
} from "@/srcApp/shared/constants/pie-chart-colors";
import { useMediaQuery } from "@/srcApp/shared/hooks/useMediaQuery";
import { formatBytes } from "@/srcApp/shared/model/formatBytes";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import styles from "./styles.module.css";

type PieChartGeneralProps = {
  data: { name: string; value: number }[];
};

export function PieChartGeneral({ data }: PieChartGeneralProps) {
  const matches768 = useMediaQuery("(max-width: 768px)");
  const matches576 = useMediaQuery("(max-width: 576px)");

  const innerRadius = matches576 ? 85 : matches768 ? 100 : 120;
  const outerRadius = matches576 ? 130 : matches768 ? 160 : 200;

  const COLORS = [pieChartColorFirst, pieChartColorSecond];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          endAngle={-280}
          dataKey="value"
          startAngle={88}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <text
          x="50%"
          y="47%"
          dominantBaseline="middle"
          textAnchor="middle"
          className={styles.pieChart__text}
        >
          {`${data[0].name}: ${formatBytes(data[0].value)}`}
        </text>
        <text
          x="50%"
          y="53%"
          dominantBaseline="middle"
          textAnchor="middle"
          className={styles.pieChart__text}
        >
          {`${data[1].name}: ${formatBytes(data[1].value)}`}
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
}
