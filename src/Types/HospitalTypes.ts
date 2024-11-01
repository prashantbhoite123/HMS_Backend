import mongoose from "mongoose"

export interface IAppointment extends Document {
  patientName: string
  hospitalId: string
  petientId: string
  doctorName: string
  appointmentDate: Date
  appTime: string
  reason: string
  status: string
}

export interface IHospital extends Document {
  hospitalName: string
  description?: string
  phoneNumber: string
  address: {
    city: string
    state: string
    country: string
  }[]

  hospitalType: string
  establishedDate?: Date
  totalBeds: number
  departments?: string[]
  services?: string[]
  doctors: {
    doctorName: string
    education: string
    experienceYears: number
    specialization: string
    workingHours: string
  }[]
  picture: string
  owner: mongoose.Types.ObjectId
  // New Fields
}
