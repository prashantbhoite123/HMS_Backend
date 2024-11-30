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
    const { token } = req.cookies

    if (token === undefined || !token) {
      return next(errorHandler(400, "You have login first"))
    }

    const decode = jwt.verify(
      token,
      process.env.SECRETKEY as string
    ) as jwt.JwtPayload

    const user: Hospitaldocument | null = await User.findById(decode._id)
    const doctor: Doctordocument | null = await Doctors.findById(decode._id)

    if (!user && !doctor) {
      return next(errorHandler(400, "User or Doctor not found"))
    }

    if (user) {
      req.user = user
    } else if (doctor) {
      req.user = doctor
    }

    next()
  } catch (error) {
    console.log(`Error while isAuthentication: ${error}`)
    res.status(400).json({ message: "Error while isAuthentication" })
  }
}
