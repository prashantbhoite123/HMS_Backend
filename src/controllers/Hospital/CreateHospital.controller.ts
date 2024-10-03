import { NextFunction, Request, Response } from "express"
import Hospital from "../../model/Hospital/hospitalcreate.model"
import { AuthenticatedRequest } from "../../Types/types"
import { errorHandler } from "../../utils/error.handler"
const createHospital = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.user?._id
    const existHospital = await Hospital.findById({ owner: _id })

    if (!existHospital) {
      return next(errorHandler(400, "Hospital not found"))
    }

    const newHospital = await Hospital.create(req.body)
    res.status(200).json(newHospital)
  } catch (error) {
    console.log(`Error while createhospital${error}`)
    next(error)
  }
}

export default {
  createHospital,
}
