import mongoose from "mongoose"

export interface IAppointment extends Document {
  patientName: string
  hospitalId: string
  petientId: string
  doctorName: string
  appointmentDate: Date
  apptNumber: string
  appTime: string
  reason: string
  status: string
  createdAt: Date
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
  status: string
  picture: string
  owner: mongoose.Types.ObjectId
  createdAt: Date
}

import { Document, ObjectId } from "mongoose"

export interface Idoctors extends Document {
  doctorName: string
  profilePic?: string
  degree: string
  email: string
  ownerId?: ObjectId
  hospitalId?: ObjectId
  role: string
  password: string
  education: string
  experienceYears: number
  specialization: string
  workingHours: string
}
