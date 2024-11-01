import mongoose, { Schema } from "mongoose"
import { IAppointment } from "../../Types/HospitalTypes"

const AppointmentSchema: Schema = new Schema({
  patientName: {
    type: String,
    required: true,
  },
  petientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
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
  appTime: {
    type: String,
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

export const Appointment = mongoose.model<IAppointment>(
  "Appointment",
  AppointmentSchema
)
