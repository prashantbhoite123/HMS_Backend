import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../../Types/types"
import Hospital from "../../model/Hospital/hospitalcreate.model"
import { errorHandler } from "../../utils/error.handler"

const approvelHospitals = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const hospitals = await Hospital.find()
    if (!hospitals) {
      return next(errorHandler(404, " Hospitals not found"))
    }

    const pendingHospital = hospitals.filter(
      (hospital) => hospital.status === "Pending"
    )

    if (!pendingHospital) {
      return next(errorHandler(404, "pending hospitals not found"))
    }

    return res.status(200).json(pendingHospital)
  } catch (error: any) {
    return next(error)
  }
}

export default {
  approvelHospitals,
}
