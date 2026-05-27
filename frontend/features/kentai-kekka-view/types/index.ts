export interface Coding {
  system: string
  code: string
  display: string
}

export interface Code {
  coding: Coding[]
}

export interface ValueQuantity {
  value: number
  unit: string
}

export interface ReferenceRange {
  low?: { value: number; unit?: string }
  high?: { value: number; unit?: string }
}

export interface Observation {
  resourceType: "Observation"
  id: string
  status: string
  code: Code
  subject: { reference: string }
  valueQuantity: ValueQuantity
  effectiveDateTime: string // ISO 8601 string
  referenceRange?: ReferenceRange[]
}

export interface PatientName {
  use?: string
  text: string
  family?: string
  given?: string[]
}

export interface Patient {
  resourceType: "Patient"
  id: string
  name: PatientName[]
  gender: "male" | "female" | "other" | "unknown"
  birthDate: string // YYYY-MM-DD
}

