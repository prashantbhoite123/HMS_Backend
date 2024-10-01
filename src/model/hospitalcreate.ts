import mongoose, { Schema } from "mongoose"
import { IHospital } from "../Types/HospitalTypes"

const AppointmentSchema: Schema = new Schema({
  patientName: {
    type: String,
    required: true,
  },
  doctorName: {
    type: String,
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Pending", "Completed", "Cancelled"],
    default: "Pending",
  },
})

export const DoctorSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
})

const HospitalSchema: Schema = new Schema({
  hospitalName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  address: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
  },
  hospitalType: {
    type: String,
    required: true,
  },
  establishedDate: {
    type: Date,
  },
  totalBeds: {
    type: Number,
    required: true,
  },
  departments: {
    type: [String],
  },
  services: {
    type: [String],
  },
  doctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
  ],
  operatingHours: {
    weekdays: { type: String },
    weekends: { type: String },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },

  old: {
    previousName: { type: String },
    previousAddress: { type: String },
    changeReason: { type: String },
  },
})

const Hospital = mongoose.model<IHospital>("Hospital", HospitalSchema)
export default Hospital
