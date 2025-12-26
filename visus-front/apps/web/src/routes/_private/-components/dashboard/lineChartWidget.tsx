import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type LineSeriesConfig = {
    dataKey: string;
    name?: string;
    /** tipo de linha: monotone, linear, etc */
    type?: "monotone" | "linear";
};

type LineChartWidgetProps = {
    data: Record<string, any>[];
    /** eixo X categórico (ex.: "periodo") */
    xKey: string;
    /** série(s) numéricas */
    series: LineSeriesConfig[];
    yDomain?: [number, number] | number[];
    showLegend?: boolean;
    gridStrokeDasharray?: string;
};

/**
 * Gráfico de linha simples ou múltiplo (ex.: média geral, atraso x presença, NPS).
 * Estilo moderno com cores fixas, tipografia suave e grid leve.
 */
export function LineChartWidget({
    data,
    xKey,
    series,
    yDomain,
    showLegend = true,
    gridStrokeDasharray = "3 3",
}: LineChartWidgetProps) {
    const lineColors = ["#4F46E5", "#10B981", "#F59E0B", "#EC4899"];

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
            >
                <CartesianGrid
                    stroke="#E5E7EB"
                    strokeDasharray={gridStrokeDasharray}
                />
                <XAxis
                    dataKey={xKey}
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                    tickLine={false}
                />
                <YAxis
                    domain={yDomain}
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                    tickLine={false}
                />
                <Tooltip
                    contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #E5E7EB",
                        fontSize: 12,
                    }}
                />
                {showLegend && (
                    <Legend
                        wrapperStyle={{ fontSize: 12, color: "#4B5563" }}
                        iconType="circle"
                    />
                )}
                {series.map((s, index) => (
                    <Line
                        key={s.dataKey}
                        type={s.type ?? "monotone"}
                        dataKey={s.dataKey}
                        name={s.name ?? s.dataKey}
                        stroke={lineColors[index % lineColors.length]}
                        strokeWidth={2}
                        dot={{ r: 3, strokeWidth: 2 }}
                        activeDot={{ r: 5 }}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
}
