import { useState, useEffect } from "react"
import { Observation } from "../types"

// バックエンド未起動時のためのフォールバック用モックデータ
export const FALLBACK_OBSERVATIONS: Observation[] = [
  {
    resourceType: "Observation",
    id: "mock-1",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "8302-2", display: "Body Height" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 170.5, unit: "cm" },
    effectiveDateTime: "2026-05-27T09:00:00Z"
  },
  {
    resourceType: "Observation",
    id: "mock-2",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "29463-7", display: "Body Weight" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 68.2, unit: "kg" },
    effectiveDateTime: "2026-05-27T09:00:00Z"
  },
  {
    resourceType: "Observation",
    id: "mock-3",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "8867-4", display: "Heart rate" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 75, unit: "/min" },
    effectiveDateTime: "2026-05-27T09:10:00Z",
    referenceRange: [{ low: { value: 60, unit: "/min" }, high: { value: 100, unit: "/min" } }]
  },
  {
    resourceType: "Observation",
    id: "mock-4",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "8480-6", display: "Systolic blood pressure" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 135, unit: "mmHg" },
    effectiveDateTime: "2026-05-27T09:15:00Z",
    referenceRange: [{ low: { value: 90, unit: "mmHg" }, high: { value: 129, unit: "mmHg" } }]
  },
  {
    resourceType: "Observation",
    id: "mock-5",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "8462-4", display: "Diastolic blood pressure" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 85, unit: "mmHg" },
    effectiveDateTime: "2026-05-27T09:15:00Z",
    referenceRange: [{ low: { value: 60, unit: "mmHg" }, high: { value: 84, unit: "mmHg" } }]
  },
  {
    resourceType: "Observation",
    id: "mock-6",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "15074-8", display: "Glucose" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 125, unit: "mg/dL" },
    effectiveDateTime: "2026-05-27T09:30:00Z",
    referenceRange: [{ low: { value: 70, unit: "mg/dL" }, high: { value: 109, unit: "mg/dL" } }]
  },
  {
    resourceType: "Observation",
    id: "mock-7",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "29463-7", display: "Body Weight" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 67.8, unit: "kg" },
    effectiveDateTime: "2026-05-26T08:45:00Z"
  },
  {
    resourceType: "Observation",
    id: "mock-8",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "8867-4", display: "Heart rate" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 105, unit: "/min" },
    effectiveDateTime: "2026-05-26T09:00:00Z",
    referenceRange: [{ low: { value: 60, unit: "/min" }, high: { value: 100, unit: "/min" } }]
  },
  {
    resourceType: "Observation",
    id: "mock-9",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "8480-6", display: "Systolic blood pressure" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 142, unit: "mmHg" },
    effectiveDateTime: "2026-05-26T09:05:00Z",
    referenceRange: [{ low: { value: 90, unit: "mmHg" }, high: { value: 129, unit: "mmHg" } }]
  },
  {
    resourceType: "Observation",
    id: "mock-10",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "8462-4", display: "Diastolic blood pressure" }] },
    subject: { reference: "Patient/1" },
    valueQuantity: { value: 92, unit: "mmHg" },
    effectiveDateTime: "2026-05-26T09:05:00Z",
    referenceRange: [{ low: { value: 60, unit: "mmHg" }, high: { value: 84, unit: "mmHg" } }]
  }
]

export function useKentaiKekka() {
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
  }
}
