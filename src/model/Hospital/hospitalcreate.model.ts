import mongoose, { Schema } from "mongoose"
import { IHospital } from "../../Types/HospitalTypes"

const HospitalSchema: Schema = new Schema<IHospital>(
  {
    hospitalName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    picture: {
      type: String,
      default:
        "https://media.licdn.com/dms/image/D4E12AQG0hyhZmq0AyQ/article-cover_image-shrink_600_2000/0/1700488940348?e=2147483647&v=beta&t=eZtDe_xSbm65L-mR1tnM8vnfMpM3aWcSe8rw8o7sjSs",
      required: false,
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
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
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

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
)

const Hospital = mongoose.model<IHospital>("Hospital", HospitalSchema)
export default Hospital
