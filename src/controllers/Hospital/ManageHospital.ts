import { Request, Response, NextFunction } from "express"
import Hospital from "../../model/Hospital/hospitalcreate.model"
import { AuthenticatedRequest } from "../../Types/types"
import { errorHandler } from "../../utils/error.handler"

const getallHospital = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const getallHospital = await Hospital.find()

    if (!getallHospital) {
      return next(errorHandler(500, "Hospital not found"))
    }

    res.status(200).json(getallHospital)
  } catch (error) {
    next(error)
  }
}

export default {
  getallHospital,
}
