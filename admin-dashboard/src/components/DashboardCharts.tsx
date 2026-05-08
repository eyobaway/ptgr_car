"use client"

import * as React from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"

const chartConfig = {
  users: {
    label: "New Users",
    color: "#163962",
  },
  agents: {
    label: "New Dealers",
    color: "#1e4b8a",
  },
  properties: {
    label: "Vehicles Listed",
    color: "#3b82f6",
  },
  sedan: {
      label: "Sedan",
      color: "#163962"
  },
  suv: {
      label: "SUV",
      color: "#1e4b8a"
  },
  truck: {
      label: "Truck",
      color: "#3b82f6"
  },
  coupe: {
      label: "Coupe",
      color: "#60a5fa"
  },
  city: {
      label: "Vehicles",
      color: "#163962"
  }
} satisfies ChartConfig

export function DashboardCharts({ growthData, typeDistribution, cityDistribution, userDistribution }: { 
    growthData: any[], 
    typeDistribution: any[],
    cityDistribution: any[],
    userDistribution: any[]
}) {
  if (!growthData || growthData.length === 0) {
      return <div className="text-center py-20 text-slate-500 font-bold">Collecting data...</div>
  }

  // Pre-process typeDistribution to map to config keys
  const formattedTypeDistribution = typeDistribution.map(td => ({
      ...td,
      fill: `var(--color-${td.name.toLowerCase()})`
  }));

  return (
    <div className="space-y-8 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50">
            <CardTitle className="text-xl font-bold text-slate-800">Platform Growth</CardTitle>
            <CardDescription>
              User and Dealer registrations over the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={growthData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="users"
                  type="monotone"
                  fill="#163962"
                  fillOpacity={0.8}
                  stroke="#163962"
                  strokeWidth={2}
                />
                <Area
                  dataKey="agents"
                  type="monotone"
                  fill="#1e4b8a"
                  fillOpacity={0.6}
                  stroke="#1e4b8a"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50">
            <CardTitle className="text-xl font-bold text-slate-800">Top Markets</CardTitle>
            <CardDescription>
              Vehicles listed per city.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={cityDistribution}
                layout="vertical"
                margin={{
                  left: 0,
                }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }}
                />
                <XAxis type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="value" fill="#163962" radius={8} barSize={32} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-slate-100 shadow-sm lg:col-span-1 overflow-hidden">
          <CardHeader className="bg-slate-50/50">
            <CardTitle className="text-xl font-bold text-slate-800">Inventory Mix</CardTitle>
            <CardDescription>Vehicle Category split</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px] w-full">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={formattedTypeDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                  paddingAngle={5}
                >
                  {formattedTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#163962" : index === 1 ? "#1e4b8a" : index === 2 ? "#3b82f6" : "#60a5fa"} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-100 shadow-sm lg:col-span-2 overflow-hidden">
          <CardHeader className="bg-slate-50/50">
            <CardTitle className="text-xl font-bold text-slate-800">Listing Trends</CardTitle>
            <CardDescription>Monthly vehicle additions</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart
                accessibilityLayer
                data={growthData}
                margin={{
                  top: 20,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="properties" fill="#163962" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
