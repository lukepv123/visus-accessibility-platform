// src/components/dashboard/common/BarChartWidget.tsx

import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type SeriesConfig = {
    dataKey: string;
    name?: string;
};

type BarChartWidgetProps = {
    data: Record<string, any>[];
    /** campo categórico (ex.: "disciplina") */
    categoryKey: string;
    /** uma ou mais séries numéricas */
    series: SeriesConfig[];
    /** exibir legenda? */
    showLegend?: boolean;
    /** espaçamento do grid */
    gridStrokeDasharray?: string;
};

/**
 * Gráfico de barras HORIZONTAIS (layout="vertical").
 * Bom para rankings (top N disciplinas, etc).
 */
export function BarChartWidget({
    data,
    categoryKey,
    series,
    showLegend = true,
    gridStrokeDasharray = "3 3",
}: BarChartWidgetProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray={gridStrokeDasharray} />
                <XAxis type="number" />
                <YAxis type="category" dataKey={categoryKey} width={100} />
                <Tooltip />
                {showLegend && <Legend />}
                {series.map((s) => (
                    <Bar
                        key={s.dataKey}
                        dataKey={s.dataKey}
                        name={s.name ?? s.dataKey}
                        radius={[0, 4, 4, 0]}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
}
