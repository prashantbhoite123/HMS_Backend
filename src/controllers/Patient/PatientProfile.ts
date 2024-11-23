import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../../Types/types"
import { errorHandler } from "../../utils/error.handler"
import { Patient } from "../../model/Patient/PatientProfile.model"

const patientProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("======>", req.body)
    if (!req.body) {
      return next(errorHandler(404, "All fields are required"))
    }

    const newPatient = await Patient.create({
      ...req.body,
      userId: req.user?._id,
    })

    if (!newPatient) {
      return next(errorHandler(500, "Error While create patient informtion"))
    }

    return res
      .status(200)
      .json({ success: true, message: "patient information submit successful" })
  } catch (error: any) {
    return next(error)
  }
}

export default {
  patientProfile,
}
