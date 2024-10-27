import mongoose from "mongoose"

export interface Hospitaldocument extends Document {
  _id: any
  username: string
  email: string
  password: string
  role: string
  profilepic: string
}

const hospitalRegistation = new mongoose.Schema(
  {
    username: {
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
    role: {
      type: String,
      default: "",
    },
    profilepic: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLr3E1_fYG3nqJDD6c13tNJJJ4i8GHLNU7mDLmEjogbLWjjOGDSntFWLgnkAwzR_3UCI8&usqp=CAU",
    },
  },
  { timestamps: true }
)

export const User = mongoose.model<Hospitaldocument>("User", hospitalRegistation)
