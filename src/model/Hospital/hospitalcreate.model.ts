import mongoose, { Schema } from "mongoose"
import { IHospital } from "../../Types/HospitalTypes"

// Define the doctor schema
const doctorSchema: Schema = new Schema({
  doctorName: {
    type: String,
    required: true,
    trim: true,
  },
  doctorType: {
    type: String,
    required: true,
    trim: true, // Added trim to remove unwanted spaces
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
    weekdays: { type: String, required: true, trim: true },
    weekends: { type: String, trim: true },
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
 
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
  },
  hospitalType: {
    type: String,
    required: true,
    trim: true,
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

  doctors: [doctorSchema],
  operatingHours: {
    weekdays: { type: String, trim: true },
    weekends: { type: String, trim: true },
  },
  owner: {
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
})

// Export the model
const Hospital = mongoose.model<IHospital>("Hospital", HospitalSchema)
export default Hospital
