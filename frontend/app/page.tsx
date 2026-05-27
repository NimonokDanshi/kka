"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LabResultTable, Observation, FALLBACK_OBSERVATIONS } from "@/components/lab-result-table"
import { ChartLineDots } from "@/components/chart-line-dots"

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date("2026-05-27"))
  const [observations, setObservations] = useState<Observation[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false)

  // データフェッチ
  const fetchObservations = async (showLoading = false) => {
    if (showLoading) setIsLoading(true)
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
    const timer = setTimeout(() => {
      fetchObservations()
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      {/* ヘッダーセクション（患者概要） */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 shadow-sm border-slate-100 bg-white dark:bg-slate-900 transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">患者基本情報</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-slate-450 dark:text-slate-500 block text-xs">氏名</span>
              <span className="font-semibold text-slate-850 dark:text-slate-200 text-base">山田 太郎 (ヤマダ タロウ)</span>
            </div>
            <div>
              <span className="text-slate-450 dark:text-slate-500 block text-xs">患者ID</span>
              <span className="font-mono font-semibold text-slate-850 dark:text-slate-200 text-base">P-0001</span>
            </div>
            <div>
              <span className="text-slate-450 dark:text-slate-500 block text-xs">生年月日 / 年齢</span>
              <span className="font-semibold text-slate-850 dark:text-slate-200 text-base">1985-04-12 (41歳)</span>
            </div>
            <div>
              <span className="text-slate-450 dark:text-slate-500 block text-xs">性別</span>
              <span className="font-semibold text-slate-850 dark:text-slate-200 text-base">男性</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-100 bg-white dark:bg-slate-900 flex flex-col justify-center p-6 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <span className="font-bold text-lg">A</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">総合ステータス</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">注意が必要な項目があります (2026-05-26)</p>
            </div>
          </div>
        </Card>
      </div>

      {/* グリッドレイアウトでグラフとテーブルを並列配置 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-full">
          <ChartLineDots observations={observations} />
        </div>
        <div className="h-full">
          <LabResultTable
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            observations={observations}
            isLoading={isLoading}
            isUsingFallback={isUsingFallback}
            onRefresh={() => fetchObservations(true)}
          />
        </div>
      </div>
    </div>
  )
}
