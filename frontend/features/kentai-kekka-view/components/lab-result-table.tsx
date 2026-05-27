"use client"

import React, { useState } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Observation, ReferenceRange } from "../types"
import { getTestJapaneseName } from "../hooks/use-kentai-kekka"


const checkIsPanic = (value: number, range?: ReferenceRange[]) => {
  if (!range || range.length === 0) return false
  const r = range[0]
  if (r.low?.value !== undefined && value < r.low.value) return true
  if (r.high?.value !== undefined && value > r.high.value) return true
  return false
}

const getReferenceRangeString = (range?: ReferenceRange[]) => {
  if (!range || range.length === 0) return "-"
  const r = range[0]
  if (r.low?.value !== undefined && r.high?.value !== undefined) {
    return `${r.low.value} - ${r.high.value}`
  }
  if (r.low?.value !== undefined) {
    return `>= ${r.low.value}`
  }
  if (r.high?.value !== undefined) {
    return `<= ${r.high.value}`
  }
  return "-"
}

export interface LabResultTableProps {
  selectedDate: Date
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>
  observations: Observation[]
  isLoading: boolean
  isUsingFallback: boolean
  onRefresh: () => void
  selectedCodes: string[]
  onSelectedCodesChange: (codes: string[]) => void
}

export function LabResultTable({
  selectedDate,
  setSelectedDate,
  observations,
  isLoading,
  isUsingFallback,
  onRefresh,
  selectedCodes,
  onSelectedCodesChange,
}: LabResultTableProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false)

  // 日付オブジェクトを比較用および表示用の YYYY-MM-DD 文字列にパース
  const formatSelectedDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

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

  // 選択された日付に一致するデータを抽出
  const selectedDateStr = formatSelectedDate(selectedDate)
  const filteredObservations = observations.filter(obs => {
    if (!obs.effectiveDateTime) return false
    return getLocalDateString(obs.effectiveDateTime) === selectedDateStr
  })

  // 表示されている項目のコードリスト
  const displayedCodes = filteredObservations
    .map(obs => obs.code.coding[0]?.code)
    .filter(Boolean) as string[]

  const isAllSelectedOnDate = displayedCodes.length > 0 && displayedCodes.every(code => selectedCodes.includes(code))
  const isSomeSelectedOnDate = displayedCodes.length > 0 && displayedCodes.some(code => selectedCodes.includes(code)) && !isAllSelectedOnDate

  const handleToggleAllOnDate = () => {
    if (isAllSelectedOnDate) {
      // 表示中の項目をすべて選択解除
      onSelectedCodesChange(selectedCodes.filter(code => !displayedCodes.includes(code)))
    } else {
      // 表示中の項目をすべて選択
      const newSelected = Array.from(new Set([...selectedCodes, ...displayedCodes]))
      onSelectedCodesChange(newSelected)
    }
  }

  const handleToggleCode = (code: string) => {
    if (selectedCodes.includes(code)) {
      onSelectedCodesChange(selectedCodes.filter(c => c !== code))
    } else {
      onSelectedCodesChange([...selectedCodes, code])
    }
  }

  // 日付の増減処理
  const handlePrevDay = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev)
      newDate.setDate(newDate.getDate() - 1)
      return newDate
    })
  }

  const handleNextDay = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev)
      newDate.setDate(newDate.getDate() + 1)
      return newDate
    })
  }

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      setIsCalendarOpen(false) // 日付選択後、ポップオーバーを閉じる
    }
  }

  return (
    <Card className="w-full shadow-lg border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-teal-500 animate-pulse" />
              検査結果一覧
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              日付ごとの詳細な測定データ（チェックした項目が右側のグラフと表に連動します）
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2 self-start sm:self-center">
            {/* 前日ボタン */}
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevDay}
              className="h-9 w-9 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
 
            {/* Popover & Calendarによる日付選択 */}
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-9 justify-start text-left font-medium text-sm pl-3 pr-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-850",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-teal-650 dark:text-teal-400" />
                  {selectedDate ? formatSelectedDate(selectedDate) : <span>日付を選択</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border border-slate-200 dark:border-slate-800" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleCalendarSelect}
                  className="bg-white dark:bg-slate-950 rounded-md border-0"
                />
              </PopoverContent>
            </Popover>
 
            {/* 翌日ボタン */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextDay}
              className="h-9 w-9 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
 
            {/* リフレッシュボタン */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              disabled={isLoading}
              title="データを更新"
              className="h-9 w-9 text-slate-400 hover:text-teal-500 dark:text-slate-500 dark:hover:text-teal-400"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
          </div>
        </div>
 
        {isUsingFallback && !isLoading && (
          <div className="mt-2 text-xs flex items-center gap-1.5 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1.5 rounded-md border border-amber-200/50 dark:border-amber-900/30">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>API接続不可のため、ローカルのデモデータを使用中</span>
          </div>
        )}
      </CardHeader>
 
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-teal-500" />
            <p className="text-sm text-slate-500 dark:text-slate-400">検査データを読み込み中...</p>
          </div>
        ) : filteredObservations.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <Table>
              <TableHeader className="bg-slate-50/70 dark:bg-slate-900/50">
                <TableRow className="hover:bg-transparent border-b border-slate-100 dark:border-slate-800">
                  <TableHead className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider h-auto w-12 text-center">
                    <input
                      type="checkbox"
                      ref={el => {
                        if (el) el.indeterminate = isSomeSelectedOnDate
                      }}
                      checked={isAllSelectedOnDate}
                      onChange={handleToggleAllOnDate}
                      className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 cursor-pointer"
                    />
                  </TableHead>
                  <TableHead className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider h-auto">
                    検査結果項目名
                  </TableHead>
                  <TableHead className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right h-auto">
                    検査結果値
                  </TableHead>
                  <TableHead className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center h-auto">
                    基準値範囲
                  </TableHead>
                  <TableHead className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center h-auto">
                    判定
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {filteredObservations.map((obs) => {
                  const rawCode = obs.code.coding[0]?.code || ""
                  const rawLabel = obs.code.coding[0]?.display || "不明な項目"
                  const label = getTestJapaneseName(rawCode, rawLabel)
                  
                  const value = obs.valueQuantity.value
                  const unit = obs.valueQuantity.unit
                  const isPanic = checkIsPanic(value, obs.referenceRange)
                  const refRangeStr = getReferenceRangeString(obs.referenceRange)
                  
                  return (
                    <TableRow 
                      key={obs.id}
                      onClick={() => handleToggleCode(rawCode)}
                      className={cn(
                        "group hover:bg-slate-50/50 dark:hover:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/50 transition-colors cursor-pointer",
                        isPanic && "bg-red-50/30 dark:bg-red-950/10 hover:bg-red-50/50 dark:hover:bg-red-950/20"
                      )}
                    >
                      <TableCell className="py-3.5 px-4 text-center w-12" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedCodes.includes(rawCode)}
                          onChange={() => handleToggleCode(rawCode)}
                          className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 cursor-pointer"
                        />
                      </TableCell>
                      <TableCell className="py-3.5 px-4 text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-teal-500 transition-colors",
                          isPanic && "bg-red-400 dark:bg-red-500 group-hover:bg-red-500"
                        )} />
                        {label}
                      </TableCell>
                      <TableCell className={cn(
                        "py-3.5 px-4 text-sm font-semibold text-right tabular-nums",
                        isPanic ? "text-red-650 dark:text-red-400" : "text-slate-900 dark:text-slate-100"
                      )}>
                        <div className="flex items-center justify-end gap-1.5">
                          {isPanic && <AlertCircle className="h-4 w-4 text-red-500 animate-pulse shrink-0" />}
                          <span>{value} <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">{unit}</span></span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5 px-4 text-sm text-slate-500 dark:text-slate-400 text-center tabular-nums">
                        {refRangeStr}
                      </TableCell>
                      <TableCell className="py-3.5 px-4 text-sm text-center">
                        {obs.referenceRange ? (
                          isPanic ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
                              異常
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                              正常
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-150 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            -
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-lg border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/10">
            <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
              該当日のデータはありません
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              選択された日付（{selectedDateStr}）に記録された検査結果は見つかりませんでした。前後の日付を選択してください。
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
