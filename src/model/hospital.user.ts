import mongoose from "mongoose"

const hospitalAdminRegistation = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    default: false,
  },
})

export const Hosadmin = mongoose.model("Hosadmin", hospitalAdminRegistation)
