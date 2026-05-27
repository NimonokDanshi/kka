"use client"

import React from "react"
import { AlertCircle, CalendarRange } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Observation } from "../types"
import { TEST_DEFINITIONS } from "../hooks/use-kentai-kekka"

interface LabResultTimelineTableProps {
  observations: Observation[]
  selectedCodes: string[]
}

export function LabResultTimelineTable({ observations, selectedCodes }: LabResultTimelineTableProps) {
  // データ中に存在するユニークな日付（YYYY-MM-DD）を抽出して昇順ソート
  const getLocalDateString = (isoString: string) => {
    try {
      const date = new Date(isoString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    } catch {
      return ""
    }
  }

  const uniqueDates = Array.from(
    new Set(observations.map(obs => obs.effectiveDateTime ? getLocalDateString(obs.effectiveDateTime) : "").filter(Boolean))
  ).sort()

  // 表示する行データを作成（選択された項目ごと）
  const rows = selectedCodes.map(code => {
    const def = TEST_DEFINITIONS[code]
    const japaneseName = def?.japaneseName || code
    const unit = def?.unit || ""
    const refMin = def?.refMin
    const refMax = def?.refMax

    const refRangeStr = refMin !== undefined && refMax !== undefined
      ? `${refMin} - ${refMax}`
      : "-"

    // 各日付ごとのデータをマッピング
    const valuesByDate = uniqueDates.reduce((acc, dateStr) => {
      // その日のこのコードに該当するデータを検索 (複数ある場合は最新のものを採用)
      const matches = observations
        .filter(obs => {
          if (obs.code.coding[0]?.code !== code || !obs.effectiveDateTime) return false
          return getLocalDateString(obs.effectiveDateTime) === dateStr
        })
        .sort((a, b) => new Date(b.effectiveDateTime).getTime() - new Date(a.effectiveDateTime).getTime())

      if (matches.length > 0) {
        const val = matches[0].valueQuantity.value
        const isPanic = (refMin !== undefined && val < refMin) || (refMax !== undefined && val > refMax)
        acc[dateStr] = { value: val, isPanic }
      } else {
        acc[dateStr] = null
      }
      return acc
    }, {} as Record<string, { value: number; isPanic: boolean } | null>)

    return {
      code,
      japaneseName,
      unit,
      refRangeStr,
      valuesByDate
    }
  })

  return (
    <Card className="w-full shadow-lg border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950">
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <CalendarRange className="h-5 w-5 text-teal-650 dark:text-teal-400" />
          検査結果時系列表
        </CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400">
          日付ごとの測定値推移の一覧（異常値は赤色で強調表示されます）
        </CardDescription>
      </CardHeader>
      <CardContent>
        {selectedCodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-lg border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/10">
            <CalendarRange className="h-8 w-8 text-slate-300 mb-2" />
            <p className="text-sm text-slate-500">表示対象の項目が選択されていません</p>
          </div>
        ) : uniqueDates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-lg border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/10">
            <CalendarRange className="h-8 w-8 text-slate-300 mb-2" />
            <p className="text-sm text-slate-500">測定データがありません</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <Table>
              <TableHeader className="bg-slate-50/70 dark:bg-slate-900/50">
                <TableRow className="hover:bg-transparent border-b border-slate-100 dark:border-slate-800">
                  <TableHead className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider h-auto min-w-[150px]">
                    検査項目
                  </TableHead>
                  <TableHead className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center h-auto">
                    基準値範囲
                  </TableHead>
                  <TableHead className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center h-auto">
                    単位
                  </TableHead>
                  {uniqueDates.map(date => (
                    <TableHead 
                      key={date} 
                      className="py-3.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-center h-auto min-w-[100px]"
                    >
                      {date}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {rows.map((row) => (
                  <TableRow 
                    key={row.code}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/50 transition-colors"
                  >
                    <TableCell className="py-3.5 px-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {row.japaneseName}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-sm text-slate-500 dark:text-slate-400 text-center tabular-nums">
                      {row.refRangeStr}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-sm text-slate-500 dark:text-slate-400 text-center">
                      {row.unit}
                    </TableCell>
                    {uniqueDates.map(date => {
                      const data = row.valuesByDate[date]
                      if (!data) {
                        return (
                          <TableCell key={date} className="py-3.5 px-4 text-sm text-slate-350 dark:text-slate-650 text-center">
                            -
                          </TableCell>
                        )
                      }
                      return (
                        <TableCell 
                          key={date} 
                          className={cn(
                            "py-3.5 px-4 text-sm font-semibold text-center tabular-nums",
                            data.isPanic ? "text-red-650 dark:text-red-400 bg-red-50/10 dark:bg-red-950/5" : "text-slate-800 dark:text-slate-200"
                          )}
                        >
                          <div className="flex items-center justify-center gap-1">
                            {data.isPanic && <AlertCircle className="h-4 w-4 text-red-500 animate-pulse shrink-0" />}
                            <span>{data.value}</span>
                          </div>
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
