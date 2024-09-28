import mongoose from "mongoose"

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
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)

export const Hospital = mongoose.model("Hosadmin", hospitalRegistation)
