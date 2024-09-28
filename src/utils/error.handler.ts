import { CustomError } from "../types"

export const errorHandler = (
  statuscode: number,
  message: string
): CustomError => {
  const error: CustomError = new Error()
  error.statuscode = statuscode
  error.message = message
  return error
}
