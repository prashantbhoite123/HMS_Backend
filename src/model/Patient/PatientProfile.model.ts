import mongoose, { Schema, Document } from "mongoose"
import { IPatient } from "../../Types/PatientType"

const PatientSchema: Schema = new Schema({
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },

  contact: {
    phone: { type: String, required: true },
    address: { type: String },
  },
  emergencyContact: {
    name: { type: String, required: true },
    relation: { type: String, required: true },
    phone: { type: String, required: true },
  },
  medicalHistory: {
    allergies: { type: [String], default: [] },
    chronicConditions: { type: [String], default: [] },
    pastSurgeries: { type: [String], default: [] },
    currentMedications: { type: [String], default: [] },
  },
  currentMedicalInfo: {
    reasonForVisit: { type: String, required: true },
    symptoms: { type: [String], required: true },
    vitalSigns: {
      bloodPressure: { type: String },
      heartRate: { type: Number },
      temperature: { type: Number },
      weight: { type: Number },
    },
  },
  visitHistory: [
    {
      lastVisitDate: { type: Date, required: true },
      assignedDoctor: { type: String, required: true },
      lastVisitReason: { type: [String], required: true },
    },
  ],
  insurance: {
    provider: { type: String },
    policyNumber: { type: String },
  },
  documents: { type: [String], default: [] },
})

export default mongoose.model<IPatient>("Patient", PatientSchema)
