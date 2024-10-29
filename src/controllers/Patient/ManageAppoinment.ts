import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../../Types/types"
import { errorHandler } from "../../utils/error.handler"
import { Appointment } from "../../model/Patient/Appointment"

const deleteAppoinment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { patientId } = req.params
    if (!patientId) {
      return next(errorHandler(500, "Patient id not found"))
    }

    const patientApp = Appointment.findByIdAndDelete(patientId)

    return res
      .status(200)
      .json({ success: true, message: "Appoinment Delete successfull" })
  } catch (error: any) {
    console.log("something went wrong")
  }
}

export default {
  deleteAppoinment,
}
