import mongoose from "mongoose"

interface Iadmin {
  isAdmin: boolean
  Akey: number
  logedin: boolean
  otp?: number
  otpExpiry?: number
}

export interface Hospitaldocument extends Document {
  _id: any
  username: string
  email: string
  password: string
  role: string
  admin: Iadmin
  profilepic: string
}

const adminSchema = new mongoose.Schema({
  isAdmin: {
    type: Boolean,
    default: false,
  },
  Akey: {
    type: Number,
    default: 9021,
  },
  logedin: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: Number,
    default: undefined,
  },
  otpExpiry: {
    type: Number,
    default: undefined,
  },
})

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
    admin: {
      type: adminSchema,
      required: false,
    },
    profilepic: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLr3E1_fYG3nqJDD6c13tNJJJ4i8GHLNU7mDLmEjogbLWjjOGDSntFWLgnkAwzR_3UCI8&usqp=CAU",
    },
  },
  { timestamps: true }
)

export const User = mongoose.model<Hospitaldocument>(
  "User",
  hospitalRegistation
)
