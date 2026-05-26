"use client"

import React, { useState, useEffect } from "react"
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

// FHIR Observation の型定義
interface Coding {
  system: string
  code: string
  display: string
}

interface Code {
  coding: Coding[]
}

interface ValueQuantity {
  value: number
  unit: string
}

interface Observation {
  resourceType: "Observation"
  id: string
  status: string
  code: Code
  subject: { reference: string }
  valueQuantity: ValueQuantity
  effectiveDateTime: string // ISO 8601 string
}

// バックエンド未起動時のためのフォールバック用モックデータ
const FALLBACK_OBSERVATIONS: Observation[] = [
  {
    resourceType: "Observation",
    id: "mock-1",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "8302-2", display: "Body Height" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 170.5, unit: "cm" },
    effectiveDateTime: "2026-05-26T09:00:00Z"
  },
  {
    resourceType: "Observation",
    id: "mock-2",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "29463-7", display: "Body Weight" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 65.0, unit: "kg" },
    effectiveDateTime: "2026-05-26T09:15:00Z"
  },
  {
    resourceType: "Observation",
    id: "mock-3",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "8867-4", display: "Heart rate" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 72, unit: "/min" },
    effectiveDateTime: "2026-05-26T09:30:00Z"
  },
  {
    resourceType: "Observation",
    id: "mock-4",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "29463-7", display: "Body Weight" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 65.5, unit: "kg" },
    effectiveDateTime: "2026-05-25T10:00:00Z"
  },
  {
    resourceType: "Observation",
    id: "mock-5",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "8480-6", display: "Systolic blood pressure" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 120, unit: "mmHg" },
    effectiveDateTime: "2026-05-25T10:15:00Z"
  },
  {
    resourceType: "Observation",
    id: "mock-6",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "8462-4", display: "Diastolic blood pressure" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 80, unit: "mmHg" },
    effectiveDateTime: "2026-05-25T10:15:00Z"
  },
  {
    resourceType: "Observation",
    id: "mock-7",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "8867-4", display: "Heart rate" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 68, unit: "/min" },
    effectiveDateTime: "2026-05-25T10:30:00Z"
  }
]

export function LabResultTable() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date("2026-05-26"))
  const [observations, setObservations] = useState<Observation[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false)

  // データフェッチ
  const fetchObservations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:8000/observations")
      if (!response.ok) {
        throw new Error("Failed to fetch from API")
      }
      const data = await response.json()
      setObservations(data)
      setIsUsingFallback(false)
    } catch (error) {
      console.warn("Backend API not reachable, using fallback mockup data.", error)
      setObservations(FALLBACK_OBSERVATIONS)
      setIsUsingFallback(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchObservations()
  }, [])

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
    } catch (e) {
      return ""
    }
  }

  // 選択された日付に一致するデータを抽出
  const selectedDateStr = formatSelectedDate(selectedDate)
  const filteredObservations = observations.filter(obs => {
    if (!obs.effectiveDateTime) return false
    return getLocalDateString(obs.effectiveDateTime) === selectedDateStr
  })

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
              日付ごとの詳細な測定データ
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
                  <CalendarIcon className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
                  {selectedDate ? formatSelectedDate(selectedDate) : <span>日付を選択</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border border-slate-200 dark:border-slate-800" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleCalendarSelect}
                  initialFocus
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
              onClick={fetchObservations}
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
                  <TableHead className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider h-auto">
                    検査結果項目名
                  </TableHead>
                  <TableHead className="py-3.5 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right h-auto">
                    検査結果値
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {filteredObservations.map((obs) => {
                  const label = obs.code.coding[0]?.display || "不明な項目"
                  const value = obs.valueQuantity.value
                  const unit = obs.valueQuantity.unit
                  
                  return (
                    <TableRow 
                      key={obs.id}
                      className="group hover:bg-slate-50/50 dark:hover:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/50 transition-colors"
                    >
                      <TableCell className="py-3.5 px-4 text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-teal-500 transition-colors" />
                        {label}
                      </TableCell>
                      <TableCell className="py-3.5 px-4 text-sm font-semibold text-slate-900 dark:text-slate-100 text-right tabular-nums">
                        {value} <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">{unit}</span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </tbody>
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
