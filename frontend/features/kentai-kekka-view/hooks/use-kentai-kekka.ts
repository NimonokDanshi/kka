import { useState, useEffect } from "react"
import { Observation, Patient } from "../types"

export const FALLBACK_PATIENTS: Patient[] = [
  {
    resourceType: "Patient",
    id: "1",
    name: [{ use: "official", text: "山田 太郎" }, { use: "usual", text: "ヤマダ タロウ" }],
    gender: "male",
    birthDate: "1985-04-12"
  },
  {
    resourceType: "Patient",
    id: "2",
    name: [{ use: "official", text: "佐藤 花子" }, { use: "usual", text: "サトウ ハナコ" }],
    gender: "female",
    birthDate: "1990-08-25"
  },
  {
    resourceType: "Patient",
    id: "3",
    name: [{ use: "official", text: "鈴木 一郎" }, { use: "usual", text: "スズキ イチロウ" }],
    gender: "male",
    birthDate: "1960-11-03"
  }
]


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
  // Patient/1
  {
    resourceType: "Observation",
    id: "mock-wbc-1-26",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "6690-2", display: "White blood cells" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 9.8, unit: "x10³/µL" },
    effectiveDateTime: "2026-05-26T09:00:00Z",
    referenceRange: [{ low: { value: 3.3 }, high: { value: 8.6 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-hb-1-26",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "718-7", display: "Hemoglobin" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 13.2, unit: "g/dL" },
    effectiveDateTime: "2026-05-26T09:00:00Z",
    referenceRange: [{ low: { value: 13.7 }, high: { value: 16.8 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-plt-1-26",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "777-3", display: "Platelets" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 140, unit: "x10³/µL" },
    effectiveDateTime: "2026-05-26T09:00:00Z",
    referenceRange: [{ low: { value: 158 }, high: { value: 348 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-ast-1-26",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "1920-8", display: "Aspartate aminotransferase" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 45, unit: "U/L" },
    effectiveDateTime: "2026-05-26T09:00:00Z",
    referenceRange: [{ low: { value: 10 }, high: { value: 40 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-alt-1-26",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "1742-6", display: "Alanine aminotransferase" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 35, unit: "U/L" },
    effectiveDateTime: "2026-05-26T09:00:00Z",
    referenceRange: [{ low: { value: 10 }, high: { value: 40 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-crp-1-26",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "1988-5", display: "C reactive protein" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 1.2, unit: "mg/dL" },
    effectiveDateTime: "2026-05-26T09:00:00Z",
    referenceRange: [{ low: { value: 0.0 }, high: { value: 0.3 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-wbc-1-27",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "6690-2", display: "White blood cells" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 8.2, unit: "x10³/µL" },
    effectiveDateTime: "2026-05-27T09:00:00Z",
    referenceRange: [{ low: { value: 3.3 }, high: { value: 8.6 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-hb-1-27",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "718-7", display: "Hemoglobin" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 13.8, unit: "g/dL" },
    effectiveDateTime: "2026-05-27T09:00:00Z",
    referenceRange: [{ low: { value: 13.7 }, high: { value: 16.8 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-plt-1-27",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "777-3", display: "Platelets" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 165, unit: "x10³/µL" },
    effectiveDateTime: "2026-05-27T09:00:00Z",
    referenceRange: [{ low: { value: 158 }, high: { value: 348 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-ast-1-27",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "1920-8", display: "Aspartate aminotransferase" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 38, unit: "U/L" },
    effectiveDateTime: "2026-05-27T09:00:00Z",
    referenceRange: [{ low: { value: 10 }, high: { value: 40 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-alt-1-27",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "1742-6", display: "Alanine aminotransferase" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 36, unit: "U/L" },
    effectiveDateTime: "2026-05-27T09:00:00Z",
    referenceRange: [{ low: { value: 10 }, high: { value: 40 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-crp-1-27",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "1988-5", display: "C reactive protein" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 0.4, unit: "mg/dL" },
    effectiveDateTime: "2026-05-27T09:00:00Z",
    referenceRange: [{ low: { value: 0.0 }, high: { value: 0.3 } }]
  },
  // Patient/2
  {
    resourceType: "Observation",
    id: "mock-wbc-2-26",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "6690-2", display: "White blood cells" }] },
    subject: { reference: "Patient/2" },
    valueQuantity: { value: 5.5, unit: "x10³/µL" },
    effectiveDateTime: "2026-05-26T09:00:00Z",
    referenceRange: [{ low: { value: 3.3 }, high: { value: 8.6 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-hb-2-26",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "718-7", display: "Hemoglobin" }] },
    subject: { reference: "Patient/2" },
    valueQuantity: { value: 12.8, unit: "g/dL" },
    effectiveDateTime: "2026-05-26T09:00:00Z",
    referenceRange: [{ low: { value: 11.5 }, high: { value: 15.0 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-plt-2-26",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "777-3", display: "Platelets" }] },
    subject: { reference: "Patient/2" },
    valueQuantity: { value: 210, unit: "x10³/µL" },
    effectiveDateTime: "2026-05-26T09:00:00Z",
    referenceRange: [{ low: { value: 158 }, high: { value: 348 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-ast-2-26",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "1920-8", display: "Aspartate aminotransferase" }] },
    subject: { reference: "Patient/2" },
    valueQuantity: { value: 20, unit: "U/L" },
    effectiveDateTime: "2026-05-26T09:00:00Z",
    referenceRange: [{ low: { value: 10 }, high: { value: 40 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-alt-2-26",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "1742-6", display: "Alanine aminotransferase" }] },
    subject: { reference: "Patient/2" },
    valueQuantity: { value: 15, unit: "U/L" },
    effectiveDateTime: "2026-05-26T09:00:00Z",
    referenceRange: [{ low: { value: 10 }, high: { value: 40 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-crp-2-26",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "1988-5", display: "C reactive protein" }] },
    subject: { reference: "Patient/2" },
    valueQuantity: { value: 0.05, unit: "mg/dL" },
    effectiveDateTime: "2026-05-26T09:00:00Z",
    referenceRange: [{ low: { value: 0.0 }, high: { value: 0.3 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-wbc-2-27",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "6690-2", display: "White blood cells" }] },
    subject: { reference: "Patient/2" },
    valueQuantity: { value: 5.2, unit: "x10³/µL" },
    effectiveDateTime: "2026-05-27T09:00:00Z",
    referenceRange: [{ low: { value: 3.3 }, high: { value: 8.6 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-hb-2-27",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "718-7", display: "Hemoglobin" }] },
    subject: { reference: "Patient/2" },
    valueQuantity: { value: 12.9, unit: "g/dL" },
    effectiveDateTime: "2026-05-27T09:00:00Z",
    referenceRange: [{ low: { value: 11.5 }, high: { value: 15.0 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-plt-2-27",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "777-3", display: "Platelets" }] },
    subject: { reference: "Patient/2" },
    valueQuantity: { value: 225, unit: "x10³/µL" },
    effectiveDateTime: "2026-05-27T09:00:00Z",
    referenceRange: [{ low: { value: 158 }, high: { value: 348 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-ast-2-27",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "1920-8", display: "Aspartate aminotransferase" }] },
    subject: { reference: "Patient/2" },
    valueQuantity: { value: 18, unit: "U/L" },
    effectiveDateTime: "2026-05-27T09:00:00Z",
    referenceRange: [{ low: { value: 10 }, high: { value: 40 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-alt-2-27",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "1742-6", display: "Alanine aminotransferase" }] },
    subject: { reference: "Patient/2" },
    valueQuantity: { value: 14, unit: "U/L" },
    effectiveDateTime: "2026-05-27T09:00:00Z",
    referenceRange: [{ low: { value: 10 }, high: { value: 40 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-crp-2-27",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "1988-5", display: "C reactive protein" }] },
    subject: { reference: "Patient/2" },
    valueQuantity: { value: 0.04, unit: "mg/dL" },
    effectiveDateTime: "2026-05-27T09:00:00Z",
    referenceRange: [{ low: { value: 0.0 }, high: { value: 0.3 } }]
  },
  // Patient/3
  {
    resourceType: "Observation",
    id: "mock-wbc-3-26",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "6690-2", display: "White blood cells" }] },
    subject: { reference: "Patient/3" },
    valueQuantity: { value: 12.1, unit: "x10³/µL" },
    effectiveDateTime: "2026-05-26T09:00:00Z",
    referenceRange: [{ low: { value: 3.3 }, high: { value: 8.6 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-hb-3-26",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "718-7", display: "Hemoglobin" }] },
    subject: { reference: "Patient/3" },
    valueQuantity: { value: 14.6, unit: "g/dL" },
    effectiveDateTime: "2026-05-26T09:00:00Z",
    referenceRange: [{ low: { value: 13.7 }, high: { value: 16.8 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-plt-3-26",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "777-3", display: "Platelets" }] },
    subject: { reference: "Patient/3" },
    valueQuantity: { value: 285, unit: "x10³/µL" },
    effectiveDateTime: "2026-05-26T09:00:00Z",
    referenceRange: [{ low: { value: 158 }, high: { value: 348 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-ast-3-26",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "1920-8", display: "Aspartate aminotransferase" }] },
    subject: { reference: "Patient/3" },
    valueQuantity: { value: 58, unit: "U/L" },
    effectiveDateTime: "2026-05-26T09:00:00Z",
    referenceRange: [{ low: { value: 10 }, high: { value: 40 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-alt-3-26",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "1742-6", display: "Alanine aminotransferase" }] },
    subject: { reference: "Patient/3" },
    valueQuantity: { value: 52, unit: "U/L" },
    effectiveDateTime: "2026-05-26T09:00:00Z",
    referenceRange: [{ low: { value: 10 }, high: { value: 40 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-crp-3-26",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "1988-5", display: "C reactive protein" }] },
    subject: { reference: "Patient/3" },
    valueQuantity: { value: 3.2, unit: "mg/dL" },
    effectiveDateTime: "2026-05-26T09:00:00Z",
    referenceRange: [{ low: { value: 0.0 }, high: { value: 0.3 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-wbc-3-27",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "6690-2", display: "White blood cells" }] },
    subject: { reference: "Patient/3" },
    valueQuantity: { value: 11.2, unit: "x10³/µL" },
    effectiveDateTime: "2026-05-27T09:00:00Z",
    referenceRange: [{ low: { value: 3.3 }, high: { value: 8.6 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-hb-3-27",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "718-7", display: "Hemoglobin" }] },
    subject: { reference: "Patient/3" },
    valueQuantity: { value: 14.5, unit: "g/dL" },
    effectiveDateTime: "2026-05-27T09:00:00Z",
    referenceRange: [{ low: { value: 13.7 }, high: { value: 16.8 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-plt-3-27",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "777-3", display: "Platelets" }] },
    subject: { reference: "Patient/3" },
    valueQuantity: { value: 290, unit: "x10³/µL" },
    effectiveDateTime: "2026-05-27T09:00:00Z",
    referenceRange: [{ low: { value: 158 }, high: { value: 348 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-ast-3-27",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "1920-8", display: "Aspartate aminotransferase" }] },
    subject: { reference: "Patient/3" },
    valueQuantity: { value: 55, unit: "U/L" },
    effectiveDateTime: "2026-05-27T09:00:00Z",
    referenceRange: [{ low: { value: 10 }, high: { value: 40 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-alt-3-27",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "1742-6", display: "Alanine aminotransferase" }] },
    subject: { reference: "Patient/3" },
    valueQuantity: { value: 48, unit: "U/L" },
    effectiveDateTime: "2026-05-27T09:00:00Z",
    referenceRange: [{ low: { value: 10 }, high: { value: 40 } }]
  },
  {
    resourceType: "Observation",
    id: "mock-crp-3-27",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "1988-5", display: "C reactive protein" }] },
    subject: { reference: "Patient/3" },
    valueQuantity: { value: 2.8, unit: "mg/dL" },
    effectiveDateTime: "2026-05-27T09:00:00Z",
    referenceRange: [{ low: { value: 0.0 }, high: { value: 0.3 } }]
  }
]


export function useKentaiKekka() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date("2026-05-27"))
  const [patients, setPatients] = useState<Patient[]>(FALLBACK_PATIENTS)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [observations, setObservations] = useState<Observation[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false)
  const [selectedCodes, setSelectedCodes] = useState<string[]>([])

  // 患者リストの取得
  const fetchPatients = async () => {
    try {
      const response = await fetch("http://localhost:8000/patients")
      if (!response.ok) {
        throw new Error("Failed to fetch patients")
      }
      const data = await response.json()
      setPatients(data)
      if (data.length > 0 && !selectedPatient) {
        setSelectedPatient(data[0])
      }
    } catch (error) {
      console.warn("Backend API not reachable for patients, using fallback mockup data.", error)
      setPatients(FALLBACK_PATIENTS)
      if (!selectedPatient) {
        setSelectedPatient(FALLBACK_PATIENTS[0])
      }
    }
  }

  // 検査結果（Observation）の取得
  const fetchObservations = async (patientId: string, showLoading = false) => {
    if (showLoading) setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/observations?patient_id=${patientId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch observations")
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
      console.warn("Backend API not reachable for observations, using fallback mockup data.", error)
      
      // フォールバック時は指定された患者IDでフィルタリングする
      const filtered = FALLBACK_OBSERVATIONS.filter(
        obs => obs.subject.reference === `Patient/${patientId}` || obs.subject.reference === patientId
      )
      setObservations(filtered)
      setIsUsingFallback(true)

      const uniqueCodes = Array.from(
        new Set(filtered.map((obs: Observation) => obs.code.coding[0]?.code).filter(Boolean))
      ) as string[]
      setSelectedCodes(prev => prev.length === 0 ? uniqueCodes : prev)
    } finally {
      setIsLoading(false)
    }
  }

  // 初回ロードで患者リストを取得
  useEffect(() => {
    fetchPatients()
  }, [])

  // 選択された患者が変更されたら、該当患者の検査結果を取得する
  useEffect(() => {
    if (selectedPatient) {
      fetchObservations(selectedPatient.id, true)
    }
  }, [selectedPatient])

  const handleRefresh = () => {
    if (selectedPatient) {
      fetchObservations(selectedPatient.id, true)
    }
  }

  return {
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
    setSelectedCodes
  }
}

