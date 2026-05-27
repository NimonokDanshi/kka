import { useState, useEffect } from "react"
import { Observation } from "../types"

export interface TestDefinition {
  code: string
  display: string
  japaneseName: string
  unit: string
  refMin?: number
  refMax?: number
}

export const TEST_DEFINITIONS: Record<string, TestDefinition> = {
  "6690-2": {
    code: "6690-2",
    display: "White blood cells",
    japaneseName: "WBC (白血球数)",
    unit: "x10³/µL",
    refMin: 3.3,
    refMax: 8.6
  },
  "718-7": {
    code: "718-7",
    display: "Hemoglobin",
    japaneseName: "Hb (ヘモグロビン)",
    unit: "g/dL",
    refMin: 13.7,
    refMax: 16.8
  },
  "777-3": {
    code: "777-3",
    display: "Platelets",
    japaneseName: "PLT (血小板数)",
    unit: "x10³/µL",
    refMin: 158,
    refMax: 348
  },
  "1920-8": {
    code: "1920-8",
    display: "Aspartate aminotransferase",
    japaneseName: "AST (GOT)",
    unit: "U/L",
    refMin: 10,
    refMax: 40
  },
  "1742-6": {
    code: "1742-6",
    display: "Alanine aminotransferase",
    japaneseName: "ALT (GPT)",
    unit: "U/L",
    refMin: 10,
    refMax: 40
  },
  "1988-5": {
    code: "1988-5",
    display: "C reactive protein",
    japaneseName: "CRP (C反応性蛋白)",
    unit: "mg/dL",
    refMin: 0.0,
    refMax: 0.3
  }
}

// 日本語の項目名を取得するヘルパー関数
export const getTestJapaneseName = (code: string, fallback: string): string => {
  return TEST_DEFINITIONS[code]?.japaneseName || fallback
}

// バックエンド未起動時のためのフォールバック用モックデータ (すべて検体検査項目)
export const FALLBACK_OBSERVATIONS: Observation[] = [
  // 2026-05-26 のデータ（異常値が多め）
  {
    resourceType: "Observation",
    id: "mock-wbc-26",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "6690-2", display: "White blood cells" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 9.8, unit: "x10³/µL" },
    effectiveDateTime: "2026-05-26T09:00:00Z",
    referenceRange: [{ low: { value: 3.3 }, high: { value: 8.6 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-hb-26",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "718-7", display: "Hemoglobin" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 13.2, unit: "g/dL" },
    effectiveDateTime: "2026-05-26T09:00:00Z",
    referenceRange: [{ low: { value: 13.7 }, high: { value: 16.8 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-plt-26",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "777-3", display: "Platelets" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 140, unit: "x10³/µL" },
    effectiveDateTime: "2026-05-26T09:00:00Z",
    referenceRange: [{ low: { value: 158 }, high: { value: 348 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-ast-26",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "1920-8", display: "Aspartate aminotransferase" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 45, unit: "U/L" },
    effectiveDateTime: "2026-05-26T09:00:00Z",
    referenceRange: [{ low: { value: 10 }, high: { value: 40 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-alt-26",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "1742-6", display: "Alanine aminotransferase" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 35, unit: "U/L" },
    effectiveDateTime: "2026-05-26T09:00:00Z",
    referenceRange: [{ low: { value: 10 }, high: { value: 40 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-crp-26",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "1988-5", display: "C reactive protein" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 1.2, unit: "mg/dL" },
    effectiveDateTime: "2026-05-26T09:00:00Z",
    referenceRange: [{ low: { value: 0.0 }, high: { value: 0.3 } }]
  },

  // 2026-05-27 のデータ（改善傾向）
  {
    resourceType: "Observation",
    id: "mock-wbc-27",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "6690-2", display: "White blood cells" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 8.2, unit: "x10³/µL" },
    effectiveDateTime: "2026-05-27T09:00:00Z",
    referenceRange: [{ low: { value: 3.3 }, high: { value: 8.6 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-hb-27",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "718-7", display: "Hemoglobin" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 13.8, unit: "g/dL" },
    effectiveDateTime: "2026-05-27T09:00:00Z",
    referenceRange: [{ low: { value: 13.7 }, high: { value: 16.8 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-plt-27",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "777-3", display: "Platelets" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 165, unit: "x10³/µL" },
    effectiveDateTime: "2026-05-27T09:00:00Z",
    referenceRange: [{ low: { value: 158 }, high: { value: 348 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-ast-27",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "1920-8", display: "Aspartate aminotransferase" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 38, unit: "U/L" },
    effectiveDateTime: "2026-05-27T09:00:00Z",
    referenceRange: [{ low: { value: 10 }, high: { value: 40 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-alt-27",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "1742-6", display: "Alanine aminotransferase" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 36, unit: "U/L" },
    effectiveDateTime: "2026-05-27T09:00:00Z",
    referenceRange: [{ low: { value: 10 }, high: { value: 40 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-crp-27",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "1988-5", display: "C reactive protein" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 0.4, unit: "mg/dL" },
    effectiveDateTime: "2026-05-27T09:00:00Z",
    referenceRange: [{ low: { value: 0.0 }, high: { value: 0.3 } }]
  }
]

export function useKentaiKekka() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date("2026-05-27"))
  const [observations, setObservations] = useState<Observation[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false)
  const [selectedCodes, setSelectedCodes] = useState<string[]>([])

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
      
      // ユニークなコードを抽出して初期選択状態を設定
      const uniqueCodes = Array.from(
        new Set(data.map((obs: Observation) => obs.code.coding[0]?.code).filter(Boolean))
      ) as string[]
      setSelectedCodes(prev => prev.length === 0 ? uniqueCodes : prev)
    } catch (error) {
      console.warn("Backend API not reachable, using fallback mockup data.", error)
      setObservations(FALLBACK_OBSERVATIONS)
      setIsUsingFallback(true)

      const uniqueCodes = Array.from(
        new Set(FALLBACK_OBSERVATIONS.map((obs: Observation) => obs.code.coding[0]?.code).filter(Boolean))
      ) as string[]
      setSelectedCodes(prev => prev.length === 0 ? uniqueCodes : prev)
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

  const handleRefresh = () => {
    fetchObservations(true)
  }

  return {
    selectedDate,
    setSelectedDate,
    observations,
    isLoading,
    isUsingFallback,
    handleRefresh,
    selectedCodes,
    setSelectedCodes
  }
}
