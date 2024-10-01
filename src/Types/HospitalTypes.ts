import mongoose from "mongoose"

export interface IAppointment extends Document {
  patientName: string
  doctorName: string
  appointmentDate: Date
  reason: string
  status: string
}

export interface IHospital extends Document {
  hospitalName: string
  description?: string
  email: string
  phoneNumber: string
  website?: string
  address: {
    city: string
    state: string
    country: string
  }
  registrationNumber: string
  hospitalType: string
  establishedDate?: Date
  totalBeds: number
  departments?: string[]
  services?: string[]
  doctors?: mongoose.Types.ObjectId[]
  operatingHours?: {
    weekdays: string
    weekends: string
  }
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt?: Date
  // New Fields
  old?: {
    previousName?: string
    previousAddress?: string
    changeReason?: string
  }
}
