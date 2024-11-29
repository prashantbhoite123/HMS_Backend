import { Request } from "express"
import { Hospitaldocument } from "../model/common_Model/user.model"
import { Doctordocument } from "../model/Hospital/doctors"
// Assuming Hospital is a Mongoose model

export interface AuthenticatedRequest extends Request {
  user?: Hospitaldocument | Doctordocument | null
  hUser?: Hospitaldocument | null
}

export interface CustomError {
  statuscode?: number
  message?: string
}
