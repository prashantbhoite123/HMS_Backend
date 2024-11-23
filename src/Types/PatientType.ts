import { Document, ObjectId } from "mongoose"

export interface IPatient extends Document {
  name: string
  dateOfBirth: Date
  gender: string
  age: number

  phone: string
  address: {
    city: string
    state: string
    country: string
  }
  emergencyContact: {
    name: string
    relation: string
    phone: string
  }
  userId: ObjectId
  medicalHistory: {
    allergies: string[]
    chronicConditions: string[]
    pastSurgeries?: string[]
    currentMedications?: string[]
  }
  currentMedicalInfo: {
    reasonForVisit: string
    symptoms: string[]
    vitalSigns?: {
      bloodPressure: string
      heartRate: number
      temperature: number
      weight?: number
    }
  }
  visitHistory: {
    lastVisitDate: Date
    assignedDoctor: string
    lastVisitReason: string
  }[]
  insurance?: {
    provider: string
    policyNumber: string
  }
}
