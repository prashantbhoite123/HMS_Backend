import { Request } from "express"
import { Hospitaldocument } from "./model/hospital.user" // Assuming Hospital is a Mongoose model

export interface AuthenticatedRequest extends Request {
  user?: Hospitaldocument | null
}

export interface CustomError {
  statuscode?: number
  message?: string
}
