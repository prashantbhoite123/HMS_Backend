import { NextFunction, Request, Response } from "express"
import { errorHandler } from "../utils/error.handler"
import jwt from "jsonwebtoken"
import { Hospital, Hospitaldocument } from "../model/hospital.user"
import { AuthenticatedRequest } from "../types"

export const isAuthentication = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.cookies

    if (!token) {
      return errorHandler(400, "You have login first")
    }

    const decode = jwt.verify(
      token,
      process.env.SECRETKEY as string
    ) as jwt.JwtPayload

    const user: Hospitaldocument | null = await Hospital.findById(decode._id)

    if (!user) {
      return errorHandler(400, "Hospital not found")
    }
    req.user = user
    next()
  } catch (error) {
    console.log(`Error while isAuthentication :${error}`)
    res.status(400).json({ message: "Error while isAuthentication" })
  }
}
