"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface StatsRadarChartProps {
  data: {
    stat: string
    value: number
    max: number
  }[]
}

export function StatsRadarChart({ data }: StatsRadarChartProps) {
  const chartData = data.map((item) => ({
    stat: item.stat,
    value: (item.value / item.max) * 100,
  }))

  return (
    <ChartContainer
      config={{
        value: {
          label: "Nível",
          color: "hsl(217, 91%, 60%)",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData}>
          <PolarGrid stroke="hsl(215, 20%, 25%)" />
          <PolarAngleAxis dataKey="stat" tick={{ fill: "hsl(215, 20%, 65%)", fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "hsl(215, 20%, 65%)" }} />
          <Radar name="Stats" dataKey="value" stroke="hsl(217, 91%, 60%)" fill="hsl(217, 91%, 60%)" fillOpacity={0.6} />
          <ChartTooltip content={<ChartTooltipContent />} />
        </RadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
