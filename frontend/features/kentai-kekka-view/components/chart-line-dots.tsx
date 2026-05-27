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
import { TEST_DEFINITIONS } from "../hooks/use-kentai-kekka"

interface ChartLineDotsProps {
  observations: Observation[]
  selectedCodes: string[]
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

export function ChartLineDots({ observations, selectedCodes }: ChartLineDotsProps) {
  // 選択された各検査項目について個別にグラフを描画する
  const charts = selectedCodes.map(code => {
    const def = TEST_DEFINITIONS[code]
    const japaneseName = def?.japaneseName || code
    const unit = def?.unit || ""
    const refMin = def?.refMin
    const refMax = def?.refMax

    // この項目のデータを抽出・ソート
    const testData = observations
      .filter(obs => obs.code.coding[0]?.code === code)
      .map(obs => {
        const date = new Date(obs.effectiveDateTime)
        const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
        const value = obs.valueQuantity.value
        
        // 基準範囲から判定
        const isPanic = (refMin !== undefined && value < refMin) || (refMax !== undefined && value > refMax)

        return {
          dateStr: formattedDate,
          rawDate: date.getTime(),
          value,
          isPanic
        }
      })
      .sort((a, b) => a.rawDate - b.rawDate)

    const hasPanic = testData.some(d => d.isPanic)

    // Y軸ドメインの計算
    let domainMin = 0
    let domainMax = 100
    if (testData.length > 0) {
      const values = testData.map(d => d.value)
      let minVal = Math.min(...values)
      let maxVal = Math.max(...values)
      if (refMin !== undefined) minVal = Math.min(minVal, refMin)
      if (refMax !== undefined) maxVal = Math.max(maxVal, refMax)

      const margin = (maxVal - minVal) * 0.15 || 2
      domainMin = Math.max(0, Math.floor(minVal - margin)) // マイナス値は防ぐ（検査値なので）
      domainMax = Math.ceil(maxVal + margin)
    }

    const refRangeStr = refMin !== undefined && refMax !== undefined 
      ? `基準値: ${refMin} - ${refMax} ${unit}`
      : ""

    return {
      code,
      japaneseName,
      unit,
      refMin,
      refMax,
      data: testData,
      hasPanic,
      domainMin,
      domainMax,
      refRangeStr
    }
  }).filter(c => c.data.length > 0)

  if (charts.length === 0) {
    return (
      <Card className="w-full h-[300px] flex flex-col items-center justify-center text-center p-6 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
        <Activity className="h-10 w-10 text-slate-350 mb-3 animate-pulse" />
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
          表示対象のデータがありません
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
          検査項目が選択されていないか、選択された項目の測定データが登録されていません。左側の一覧で項目をチェックしてください。
        </p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {charts.map(chart => (
        <Card 
          key={chart.code} 
          className="w-full shadow-md border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950 flex flex-col"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Activity className="h-4.5 w-4.5 text-teal-600 dark:text-teal-400" />
              {chart.japaneseName}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              {chart.refRangeStr || "時系列推移"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chart.data}
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
                    style={{ fontSize: '10px', fill: '#64748b' }}
                  />
                  <YAxis
                    domain={[chart.domainMin, chart.domainMax]}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    style={{ fontSize: '10px', fill: '#64748b' }}
                    label={{ value: chart.unit, angle: -90, position: "insideLeft", offset: 10, style: { fontSize: '10px', fill: '#64748b' } }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    }}
                    itemStyle={{ color: "#0f172a", fontSize: "11px" }}
                    labelStyle={{ fontWeight: "bold", fontSize: "10px", color: "#64748b", marginBottom: "4px" }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => [`${value} ${chart.unit}`, "測定値"]}
                  />
                  
                  {/* 基準値範囲の帯 */}
                  {chart.refMin !== undefined && chart.refMax !== undefined && (
                    <ReferenceArea
                      y1={chart.refMin}
                      y2={chart.refMax}
                      fill="#0d9488"
                      fillOpacity={0.04}
                      stroke="none"
                    />
                  )}

                  <Line
                    dataKey="value"
                    type="monotone"
                    stroke="#0d9488"
                    strokeWidth={2}
                    dot={<RenderCustomDot />}
                    activeDot={{
                      r: 5,
                      fill: "#0d9488",
                      strokeWidth: 1.5,
                      stroke: "#fff"
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-100/50 dark:border-slate-800/50 pt-3 pb-3 flex items-center justify-between text-xs mt-auto">
            {chart.hasPanic ? (
              <div className="flex gap-1.5 leading-none font-medium text-red-650 dark:text-red-400 items-center">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>基準値を逸脱した値があります</span>
              </div>
            ) : (
              <div className="flex gap-1.5 leading-none font-medium text-slate-550 dark:text-slate-400 items-center">
                <TrendingUp className="h-3.5 w-3.5 text-teal-650 shrink-0" />
                <span>測定値は基準値内です</span>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
