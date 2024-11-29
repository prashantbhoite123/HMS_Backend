import { NextFunction, Request, Response } from "express"
import { errorHandler } from "../utils/error.handler"
import jwt from "jsonwebtoken"
import { User, Hospitaldocument } from "../model/common_Model/user.model"

import { AuthenticatedRequest } from "../Types/types"
import { Doctordocument, Doctors } from "../model/Hospital/doctors"

export const isAuthentication = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("come here")
    const { token } = req.cookies

    console.log(token)
    if (token === undefined || !token) {
      return next(errorHandler(400, "You have login first"))
    }

    const decode = jwt.verify(
      token,
      process.env.SECRETKEY as string
    ) as jwt.JwtPayload

    // Check if the user is a hospital user or a doctor
    const user: Hospitaldocument | null = await User.findById(decode._id)
    const doctor: Doctordocument | null = await Doctors.findById(decode._id)
    console.log(doctor)
    if (!user && !doctor) {
      return next(errorHandler(400, "User or Doctor not found"))
    }

    // If the user is a hospital user
    if (user) {
      console.log("Hospital user found:", user)
      req.user = user
    }
    // If the user is a doctor
    else if (doctor) {
      console.log("Doctor found:", doctor)
      req.user = doctor
    }

    next()
  } catch (error) {
    console.log(`Error while isAuthentication: ${error}`)
    res.status(400).json({ message: "Error while isAuthentication" })
  }
}
