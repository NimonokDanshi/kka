"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LabResultTable } from "./lab-result-table"
import { ChartLineDots } from "./chart-line-dots"
import { LabResultTimelineTable } from "./lab-result-timeline-table"
import { useKentaiKekka } from "../hooks/use-kentai-kekka"

export function KentaiKekkaView() {
  const {
    selectedDate,
    setSelectedDate,
    observations,
    isLoading,
    isUsingFallback,
    handleRefresh,
    selectedCodes,
    setSelectedCodes,
  } = useKentaiKekka()

  const [activeTab, setActiveTab] = useState<"graph" | "table">("graph")

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
              <span className="text-slate-400 dark:text-slate-500 block text-xs">氏名</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-base">山田 太郎 (ヤマダ タロウ)</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-xs">患者ID</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 text-base">P-0001</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-xs">生年月日 / 年齢</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-base">1985-04-12 (41歳)</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-xs">性別</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-base">男性</span>
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
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* 左側：検査結果一覧（日付切り替えとチェックボックス） */}
        <div className="xl:col-span-5 h-full">
          <LabResultTable
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            observations={observations}
            isLoading={isLoading}
            isUsingFallback={isUsingFallback}
            onRefresh={handleRefresh}
            selectedCodes={selectedCodes}
            onSelectedCodesChange={setSelectedCodes}
          />
        </div>

        {/* 右側：時系列データ（グラフ / 表 のタブ切り替え） */}
        <div className="xl:col-span-7 space-y-6">
          {/* タブ切り替えボタン */}
          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 max-w-fit">
            <button
              onClick={() => setActiveTab("graph")}
              className={cn(
                "px-4 py-2 text-sm font-semibold rounded-md transition-all flex items-center gap-2 cursor-pointer",
                activeTab === "graph"
                  ? "bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm border border-slate-200/50 dark:border-slate-800"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              )}
            >
              時系列グラフ
            </button>
            <button
              onClick={() => setActiveTab("table")}
              className={cn(
                "px-4 py-2 text-sm font-semibold rounded-md transition-all flex items-center gap-2 cursor-pointer",
                activeTab === "table"
                  ? "bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm border border-slate-200/50 dark:border-slate-800"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              )}
            >
              時系列表
            </button>
          </div>

          <div>
            {activeTab === "graph" ? (
              <ChartLineDots observations={observations} selectedCodes={selectedCodes} />
            ) : (
              <LabResultTimelineTable observations={observations} selectedCodes={selectedCodes} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
