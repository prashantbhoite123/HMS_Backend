import mongoose, { Schema } from "mongoose"
import { Idoctors } from "../../Types/HospitalTypes"

const doctorSchema: Schema = new Schema({
  doctorName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
  },
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

const doctors = mongoose.model<Idoctors>("doctors", doctorSchema)
