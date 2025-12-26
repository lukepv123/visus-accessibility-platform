// RadarChartWidget.tsx

import { useTheme } from "@mui/material/styles";
import {
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
} from "recharts";

type RadarChartWidgetProps = {
    data: { [key: string]: any }[];
    /** eixo (nome da dimensão: "Nota", "Presença"... ) */
    angleKey: string;
    /** campo do valor numérico (0–100) */
    valueKey: string;
    valueLabel?: string;
    maxValue?: number;
};

/**
 * Radar genérico para "perfil de saúde" (nota, presença, conclusão, etc).
 * Agora estilizado com o tema MUI.
 */
export function RadarChartWidget({
    data,
    angleKey,
    valueKey,
    valueLabel = "Valor",
    maxValue = 100,
}: RadarChartWidgetProps) {
    const theme = useTheme();

    const strokeColor = theme.palette.primary.main;
    const fillColor = `${theme.palette.primary.main}20`; // alpha 12.5%
    const gridColor = theme.palette.divider;
    const angleTickColor = theme.palette.text.secondary;
    const radiusTickColor = theme.palette.text.secondary;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RadarChart
                data={data}
                outerRadius="70%" // ocupa bem a área disponível
                margin={{ top: 16, right: 24, bottom: 16, left: 24 }} // menos margem
            >
                <PolarGrid stroke={gridColor} />
                <PolarAngleAxis
                    dataKey={angleKey}
                    tick={{ fontSize: 11, fill: angleTickColor }} // labels mais legíveis
                />
                <PolarRadiusAxis
                    angle={30}
                    domain={[0, maxValue]}
                    tick={{ fontSize: 11, fill: radiusTickColor }}
                    stroke={gridColor}
                />
                <Radar
                    name={valueLabel}
                    dataKey={valueKey}
                    stroke={strokeColor}
                    strokeWidth={2}
                    fill={fillColor}
                    fillOpacity={1}
                />
            </RadarChart>
        </ResponsiveContainer>
    );
}
