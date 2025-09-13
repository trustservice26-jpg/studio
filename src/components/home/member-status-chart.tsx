"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { useAppContext } from "@/context/app-context"

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))"];

export function MemberStatusChart() {
  const { members, language } = useAppContext()

  const chartData = React.useMemo(() => {
    const active = members.filter((m) => m.status === "active").length
    const inactive = members.filter((m) => m.status === "inactive").length
    return [
      { status: language === 'bn' ? 'সক্রিয়' : 'Active', count: active, fill: COLORS[0] },
      { status: language === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive', count: inactive, fill: COLORS[1] },
    ]
  }, [members, language])
  
  const chartConfig = React.useMemo(() => ({
    count: {
      label: language === 'bn' ? 'সদস্য' : 'Members',
    },
    active: {
      label: language === 'bn' ? 'সক্রিয়' : 'Active',
      color: COLORS[0],
    },
    inactive: {
      label: language === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive',
      color: COLORS[1],
    },
  }), [language])


  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>{language === 'bn' ? 'সক্রিয় বনাম নিষ্ক্রিয়' : 'Active vs. Inactive'}</CardTitle>
        <CardDescription>{language === 'bn' ? 'সদস্যদের বর্তমান অবস্থার বন্টন' : 'Distribution of current member statuses'}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
               ))}
            </Pie>
             <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="-translate-y-[20px] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
