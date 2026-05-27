"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LabResultTable } from "./lab-result-table"
import { ChartLineDots } from "./chart-line-dots"
import { LabResultTimelineTable } from "./lab-result-timeline-table"
import { useKentaiKekka } from "../hooks/use-kentai-kekka"
import { Patient } from "../types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, Users } from "lucide-react"

// 年齢計算ヘルパー
const calculateAge = (birthDateString?: string) => {
  if (!birthDateString) return ""
  const birthDate = new Date(birthDateString)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return `${age}歳`
}

// 性別日本語表示ヘルパー
const getGenderText = (gender?: string) => {
  if (!gender) return ""
  switch (gender) {
    case "male": return "男性"
    case "female": return "女性"
    case "other": return "その他"
    default: return "不明"
  }
}

// 患者名フォーマットヘルパー
const getPatientName = (patient: Patient | null) => {
  if (!patient || !patient.name || patient.name.length === 0) return ""
  const official = patient.name.find(n => n.use === "official")
  const usual = patient.name.find(n => n.use === "usual")
  
  if (official && usual) {
    return `${official.text} (${usual.text})`
  }
  return patient.name[0].text
}

export function KentaiKekkaView() {
  const {
    selectedDate,
    setSelectedDate,
    patients,
    selectedPatient,
    setSelectedPatient,
    observations,
    isLoading,
    isUsingFallback,
    handleRefresh,
    selectedCodes,
    setSelectedCodes,
  } = useKentaiKekka()

  const [activeTab, setActiveTab] = useState<"graph" | "table">("graph")

  // 患者ステータス判定
  const getPatientStatus = (patientId?: string) => {
    if (!patientId) return { grade: "---", desc: "患者が選択されていません", color: "text-slate-500", bg: "bg-slate-50 dark:bg-slate-900/30" }
    switch (patientId) {
      case "1":
        return {
          grade: "B",
          desc: "注意が必要な項目があります (2026-05-26)",
          color: "text-amber-600 dark:text-amber-400",
          bg: "bg-amber-50 dark:bg-amber-950/20"
        }
      case "2":
        return {
          grade: "A",
          desc: "良好な状態です (2026-05-27)",
          color: "text-teal-600 dark:text-teal-400",
          bg: "bg-teal-50 dark:bg-teal-950/20"
        }
      case "3":
        return {
          grade: "D",
          desc: "警告：複数の異常値が検出されました (2026-05-27)",
          color: "text-rose-600 dark:text-rose-400",
          bg: "bg-rose-50 dark:bg-rose-950/20"
        }
      default:
        return {
          grade: "A",
          desc: "良好な状態です",
          color: "text-teal-600 dark:text-teal-400",
          bg: "bg-teal-50 dark:bg-teal-950/20"
        }
    }
  }

  const status = getPatientStatus(selectedPatient?.id)

  return (
    <div className="space-y-6">
      {/* ヘッダーセクション（患者概要） */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 shadow-sm border-slate-100 bg-white dark:bg-slate-900 transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">患者基本情報</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2 border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 cursor-pointer">
                  <Users className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <span>患者切替</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md rounded-md z-50">
                {patients.map((p) => (
                  <DropdownMenuItem
                    key={p.id}
                    onClick={() => setSelectedPatient(p)}
                    className={cn(
                      "cursor-pointer transition-colors duration-150 py-2 px-3",
                      selectedPatient?.id === p.id 
                        ? "bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 font-medium" 
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                  >
                    <span className="flex flex-col">
                      <span className="text-sm font-semibold">{p.name.find(n => n.use === "official")?.text || p.name[0].text}</span>
                      <span className="text-xs text-slate-400 font-mono">ID: P-{p.id.padStart(4, "0")}</span>
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-xs">氏名</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-base">
                {selectedPatient ? getPatientName(selectedPatient) : "---"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-xs">患者ID</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 text-base">
                {selectedPatient ? `P-${selectedPatient.id.padStart(4, "0")}` : "---"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-xs">生年月日 / 年齢</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-base">
                {selectedPatient 
                  ? `${selectedPatient.birthDate} (${calculateAge(selectedPatient.birthDate)})` 
                  : "---"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-xs">性別</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-base">
                {selectedPatient ? getGenderText(selectedPatient.gender) : "---"}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className={cn("shadow-sm border-slate-100 bg-white dark:bg-slate-900 flex flex-col justify-center p-6 transition-all duration-300 hover:shadow-md", status.bg)}>
          <div className="flex items-center gap-3">
            <div className={cn("h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg", status.color, "bg-white dark:bg-slate-950 shadow-sm border border-slate-200/50 dark:border-slate-800")}>
              <span>{status.grade}</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">総合ステータス</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{status.desc}</p>
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
