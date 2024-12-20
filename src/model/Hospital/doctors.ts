import mongoose, { Schema } from "mongoose"
import { Idoctors } from "../../Types/HospitalTypes"

export interface Doctordocument extends Document {
  _id: any

  doctorName: string
  email: string
  password: string
  role: string
  profilepic: string
  degree: string
  ownerId: string
  hospitalId: string
  education: string
  specialization: string
  workingHours: string
}

const doctorSchema: Schema = new Schema({
  doctorName: {
    type: String,
    required: true,
    trim: true,
  },
  profilepic: {
    type: String,
    default:
      "https://www.shutterstock.com/image-vector/doctor-icon-260nw-224509450.jpg",
  },
  degree: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "Doctor",
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  address: {
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
  },
  age: { type: Number, required: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  education: {
    type: String,
    required: true,
    trim: true,
  },
  experienceYears: {
    type: Number,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
    trim: true,
  },
  workingHours: {
    type: String,
    required: true,
    trim: true,
  },
})

export const Doctors = mongoose.model<Idoctors>("Doctors", doctorSchema)
