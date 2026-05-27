"use client"

import React from "react"
import { TrendingUp, Activity, AlertCircle } from "lucide-react"
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceArea
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Observation } from "../types"

interface ChartLineDotsProps {
  observations: Observation[]
}

interface CustomDotProps {
  cx?: number
  cy?: number
  payload?: {
    isPanic: boolean
  }
}

const RenderCustomDot = (props: CustomDotProps) => {
  const { cx, cy, payload } = props
  if (payload?.isPanic) {
    return (
      <circle cx={cx} cy={cy} r={6} fill="#ef4444" stroke="#ffffff" strokeWidth={2} className="animate-pulse" />
    )
  }
  return <circle cx={cx} cy={cy} r={4} fill="#0d9488" stroke="#ffffff" strokeWidth={1} />
}

export function ChartLineDots({ observations }: ChartLineDotsProps) {
  // 心拍数 (Heart rate) データを抽出して時系列ソート
  const heartRateData = observations
    .filter(obs => obs.code.coding[0]?.code === "8867-4")
    .map(obs => {
      const date = new Date(obs.effectiveDateTime)
      const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
      const value = obs.valueQuantity.value
      
      // 基準範囲
      const range = obs.referenceRange?.[0]
      const isPanic = range 
        ? ((range.low?.value !== undefined && value < range.low.value) || 
           (range.high?.value !== undefined && value > range.high.value))
        : false

      return {
        dateStr: formattedDate,
        rawDate: date.getTime(),
        value,
        isPanic
      }
    })
    .sort((a, b) => a.rawDate - b.rawDate)

  const hasPanic = heartRateData.some(d => d.isPanic)

  return (
    <Card className="w-full shadow-lg border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950">
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Activity className="h-5 w-5 text-teal-500" />
          心拍数トレンド
        </CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400">
          測定データの時系列推移（基準値: 60 - 100 /min）
        </CardDescription>
      </CardHeader>
      <CardContent>
        {heartRateData.length > 0 ? (
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={heartRateData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis
                  dataKey="dateStr"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  style={{ fontSize: '11px', fill: 'var(--color-muted-foreground, #64748b)' }}
                />
                <YAxis
                  domain={[40, 120]}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  style={{ fontSize: '11px', fill: 'var(--color-muted-foreground, #64748b)' }}
                  label={{ value: "/min", angle: -90, position: "insideLeft", offset: 10, style: { fontSize: '11px', fill: '#64748b' } }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  }}
                  itemStyle={{ color: "#0f172a", fontSize: "12px" }}
                  labelStyle={{ fontWeight: "bold", fontSize: "11px", color: "#64748b", marginBottom: "4px" }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [`${value} /min`, "心拍数"]}
                />
                
                {/* 基準値範囲の帯 (60 - 100) */}
                <ReferenceArea
                  y1={60}
                  y2={100}
                  fill="#0d9488"
                  fillOpacity={0.05}
                  stroke="none"
                />

                <Line
                  dataKey="value"
                  type="monotone"
                  stroke="#0d9488"
                  strokeWidth={2.5}
                  dot={<RenderCustomDot />}
                  activeDot={{
                    r: 6,
                    fill: "#0d9488",
                    strokeWidth: 2,
                    stroke: "#fff"
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[240px] text-center rounded-lg border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/10">
            <Activity className="h-8 w-8 text-slate-300 mb-2" />
            <p className="text-sm text-slate-500">心拍数の測定データがありません</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm border-t border-slate-100/50 dark:border-slate-800/50 pt-4">
        {hasPanic ? (
          <div className="flex gap-1.5 leading-none font-medium text-red-650 dark:text-red-400 items-center">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>基準値を逸脱した心拍数が記録されています</span>
          </div>
        ) : (
          <div className="flex gap-1.5 leading-none font-medium text-slate-650 dark:text-slate-400 items-center">
            <TrendingUp className="h-4 w-4 text-teal-650 shrink-0" />
            <span>最新の測定値は基準値範囲内です</span>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
