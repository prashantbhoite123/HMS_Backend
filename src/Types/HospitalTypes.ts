import mongoose from "mongoose"

export interface IAppointment extends Document {
  patientName: string
  hospitalId: string
  petientId: string
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

  address: {
    city: string
    state: string
    country: string
  }

  hospitalType: string
  establishedDate?: Date
  totalBeds: number
  departments?: string[]
  services?: string[]
  doctors?: string[]
  operatingHours?: {
    weekdays: string
    weekends: string
  }
  owner: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt?: Date
  // New Fields
}
