import { Request } from "express"
import { Hospitaldocument } from "./model/hospital.user" // Assuming Hospital is a Mongoose model

export interface AuthenticatedRequest extends Request {
  hospital?: Hospitaldocument | null
}


export interface CustomError extends Error {
  statuscode?: number
}