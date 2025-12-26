import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

type PieChartWidgetProps = {
    data: { [key: string]: any }[];
    /** campo do label (ex.: "name") */
    nameKey: string;
    /** campo do valor (ex.: "value") */
    valueKey: string;
    showLegend?: boolean;
    /** raio externo */
    outerRadius?: number;
    /** cores opcionais */
    colors?: string[];
};

/**
 * Pizza genérica (saudáveis x críticas, usam acessibilidade x não usam, etc).
 * Agora em formato donut, com legend mais suave.
 */
export function PieChartWidget({
    data,
    nameKey,
    valueKey,
    showLegend = true,
    outerRadius = 70,
    colors = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"],
}: PieChartWidgetProps) {
    const palette = colors.length ? colors : ["#4F46E5", "#10B981"];

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Tooltip
                    contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #E5E7EB",
                        fontSize: 12,
                    }}
                />
                {showLegend && (
                    <Legend
                        verticalAlign="bottom"
                        height={24}
                        iconType="circle"
                        formatter={(value: string) => (
                            <span style={{ fontSize: 12, color: "#4B5563" }}>
                                {value}
                            </span>
                        )}
                    />
                )}
                <Pie
                    data={data}
                    dataKey={valueKey}
                    nameKey={nameKey}
                    innerRadius={outerRadius - 18}
                    outerRadius={outerRadius}
                    paddingAngle={2}
                    labelLine={false}
                    label={({ percent }) => `${Math.round(percent * 100)}%`}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={String(entry[nameKey] ?? index)}
                            fill={palette[index % palette.length]}
                        />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}
