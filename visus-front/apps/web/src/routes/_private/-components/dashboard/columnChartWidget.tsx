// ColumnChartWidget.tsx

import { useTheme } from "@mui/material/styles";
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
    stackId?: string;
};

type ColumnChartWidgetProps = {
    data: Record<string, any>[];
    categoryKey: string;
    series: SeriesConfig[];
    showLegend?: boolean;
    gridStrokeDasharray?: string;
    yDomain?: [number, number] | number[];
};

/**
 * Gráfico de colunas (barras VERTICAIS) com layout mais "clean" e legível.
 */
export function ColumnChartWidget({
    data,
    categoryKey,
    series,
    showLegend = true,
    gridStrokeDasharray = "3 3",
    yDomain,
}: ColumnChartWidgetProps) {
    const theme = useTheme();

    const barColors = [
        theme.palette.primary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
        theme.palette.error.main,
    ];

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{ top: 16, right: 24, left: 4, bottom: 40 }}
                barCategoryGap="25%"
            >
                <CartesianGrid
                    stroke={theme.palette.divider}
                    strokeDasharray={gridStrokeDasharray}
                />

                <XAxis
                    dataKey={categoryKey}
                    interval={0}
                    tick={{
                        fontSize: 11,
                        fill: theme.palette.text.secondary,
                    }}
                    angle={-20}
                    textAnchor="end"
                    height={50}
                    axisLine={{ stroke: theme.palette.divider }}
                    tickLine={false}
                />

                <YAxis
                    domain={yDomain}
                    tick={{
                        fontSize: 11,
                        fill: theme.palette.text.secondary,
                    }}
                    axisLine={{ stroke: theme.palette.divider }}
                    tickLine={false}
                />

                <Tooltip
                    contentStyle={{
                        borderRadius: 8,
                        border: `1px solid ${theme.palette.divider}`,
                        fontSize: 12,
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                    }}
                />

                {showLegend && (
                    <Legend
                        verticalAlign="top"
                        align="right"
                        wrapperStyle={{
                            fontSize: 12,
                            color: theme.palette.text.secondary,
                            paddingBottom: 8,
                        }}
                        iconType="circle"
                    />
                )}

                {series.map((s, index) => (
                    <Bar
                        key={s.dataKey}
                        dataKey={s.dataKey}
                        name={s.name ?? s.dataKey}
                        stackId={s.stackId}
                        radius={[8, 8, 0, 0]}
                        barSize={28}
                        fill={barColors[index % barColors.length]}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
}
