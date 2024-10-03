import { Request } from "express"
import { Hospitaldocument } from "../model/common_Model/user.model"
// Assuming Hospital is a Mongoose model

export interface AuthenticatedRequest extends Request {
  user?: Hospitaldocument | null
}

export interface CustomError {
  statuscode?: number
  message?: string
}
