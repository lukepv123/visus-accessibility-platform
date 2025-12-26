// src/components/dashboard/common/AreaLineChartWidget.tsx

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type AreaLineChartWidgetProps = {
    data: Record<string, any>[];
    xKey: string;
    yKey: string;
    name?: string;
    yDomain?: [number, number] | number[];
    gridStrokeDasharray?: string;
};

/**
 * Gráfico de linha com área preenchida (ex.: taxa de conclusão, NPS, retenção).
 */
export function AreaLineChartWidget({
    data,
    xKey,
    yKey,
    name,
    yDomain,
    gridStrokeDasharray = "3 3",
}: AreaLineChartWidgetProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <CartesianGrid strokeDasharray={gridStrokeDasharray} />
                <XAxis dataKey={xKey} />
                <YAxis domain={yDomain} />
                <Tooltip />
                <Area
                    type="monotone"
                    dataKey={yKey}
                    name={name ?? yKey}
                    fillOpacity={0.4}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
