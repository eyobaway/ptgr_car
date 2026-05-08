"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area, AreaChart, PieChart, Pie, Cell } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"

const chartData = [
  { month: "Jan", views: 186, inquiries: 80, saved: 45 },
  { month: "Feb", views: 305, inquiries: 200, saved: 70 },
  { month: "Mar", views: 237, inquiries: 120, saved: 55 },
  { month: "Apr", views: 73, inquiries: 190, saved: 85 },
  { month: "May", views: 209, inquiries: 130, saved: 60 },
  { month: "Jun", views: 214, inquiries: 140, saved: 75 },
]

const chartConfig = {
  views: {
    label: "Vehicle Views",
    color: "hsl(var(--chart-1))",
  },
  inquiries: {
    label: "Inquiries Received",
    color: "hsl(var(--chart-2))",
  },
  saved: {
    label: "Times Saved",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export default function ProfileCharts({ engagementData, listingPerformance, vehicleStatusStats }: { 
    engagementData: any[], 
    listingPerformance: any[],
    vehicleStatusStats: any[]
}) {
  if (!engagementData || engagementData.length === 0) {
    return (
      <div className="bg-white p-12 rounded-4xl premium-shadow border border-slate-100 text-center mb-12">
        <p className="text-slate-500 font-bold text-lg">No activity data available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-4xl premium-shadow border border-slate-100">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Engagement Overview</h3>
            <p className="text-sm font-medium text-slate-500">Vehicle views and inquiries (Last 6 Months)</p>
          </div>
          <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
            <AreaChart
              accessibilityLayer
              data={engagementData}
              margin={{
                left: 0,
                right: 0,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
                tick={{ fill: '#64748b', fontWeight: 600 }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="views"
                type="monotone"
                fill="var(--primary)"
                fillOpacity={0.7}
                stroke="var(--primary)"
                strokeWidth={2}
                stackId="a"
              />
              <Area
                dataKey="inquiries"
                type="monotone"
                fill="var(--primary-hover)"
                fillOpacity={0.5}
                stroke="var(--primary-hover)"
                strokeWidth={2}
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </div>

        <div className="bg-white p-8 rounded-4xl premium-shadow border border-slate-100">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Listing Performance</h3>
            <p className="text-sm font-medium text-slate-500">Saves per vehicle model</p>
          </div>
          {listingPerformance && listingPerformance.length > 0 ? (
            <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
              <BarChart
                accessibilityLayer
                data={listingPerformance}
                margin={{
                  left: 0,
                  right: 0,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="saved"
                  fill="var(--primary)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] border border-dashed border-slate-200 rounded-2xl">
              <p className="text-slate-400 font-medium">No saves data available</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-4xl premium-shadow border border-slate-100 lg:col-span-1">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Inventory Type</h3>
              <p className="text-sm font-medium text-slate-500 mb-6">Rent vs Sale proportion</p>
              <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[200px]">
                  <PieChart>
                      <Pie
                          data={vehicleStatusStats}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={50}
                          outerRadius={80}
                      >
                          {vehicleStatusStats.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? "var(--primary)" : "var(--primary-hover)"} />
                          ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
              </ChartContainer>
              <div className="flex justify-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="text-xs font-bold text-slate-600">SALE</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary-hover"></div>
                      <span className="text-xs font-bold text-slate-600">RENT</span>
                  </div>
              </div>
          </div>

          <div className="bg-primary p-8 rounded-4xl shadow-xl lg:col-span-2 flex flex-col justify-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <h3 className="text-2xl font-bold mb-2 relative z-10">Maximize Your Reach</h3>
              <p className="text-emerald-50/80 mb-6 max-w-md relative z-10">Vehicles with high-quality 360° virtual tours receive up to 40% more engagement. Use our AI tools to enhance your listings today.</p>
              <button className="bg-white text-primary px-8 py-3 rounded-2xl font-bold w-fit hover:bg-blue-50 transition-colors relative z-10">
                  Try AI Enhance
              </button>
          </div>
      </div>
    </div>
  )
}
