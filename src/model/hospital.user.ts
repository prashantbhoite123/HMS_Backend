import mongoose from "mongoose"

export interface Hospitaldocument extends Document {
  hosname: string
  email: string
  password: string
  contact: string
}

const hospitalRegistation = new mongoose.Schema(
  {
    hosname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export const Hospital = mongoose.model<Hospitaldocument>(
  "Hosadmin",
  hospitalRegistation
)
