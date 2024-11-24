import mongoose, { Schema, Document } from "mongoose"
import { IPatient } from "../../Types/PatientType"

const visitHistorySchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },
  lastVisitDate: { type: Date, required: true },
  assignedDoctor: { type: String, required: true },
  lastVisitReason: { type: String, required: true },
})

const PatientSchema: Schema = new Schema({
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },

  phone: { type: String, required: true },
  address: {
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
  },

  emergencyContact: {
    name: { type: String, required: true },
    relation: { type: String, required: true },
    phone: { type: String, required: true },
  },
  medicalHistory: {
    allergies: { type: String, default: "" },
    chronicConditions: { type: String, default: "" },
    pastSurgeries: { type: String, default: "" },
    currentMedications: { type: String, default: "" },
  },
  currentMedicalInfo: {
    reasonForVisit: { type: String, required: true },
    symptoms: { type: String, required: true },
    vitalSigns: {
      bloodPressure: { type: String },
      heartRate: { type: Number },
      temperature: { type: Number },
      weight: { type: Number },
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  visitHistory: [visitHistorySchema],
  insurance: {
    provider: { type: String },
    policyNumber: { type: String },
  },
})

export const Patient = mongoose.model<IPatient>("Patient", PatientSchema)
