import { Response, Request } from "express"
import { CustomError } from "../types"

export const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response
) => {
  const statuscode = err.statuscode || 500
  const message = err.message || "Internale server error"
  return res.status(statuscode).json({ success: false, message })
}
