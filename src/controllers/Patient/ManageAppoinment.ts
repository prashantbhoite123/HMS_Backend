import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../../Types/types"
import { errorHandler } from "../../utils/error.handler"
import { Appointment } from "../../model/Patient/Appointment"

const updateAppoinment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { updatedAppId } = req.params
    if (!updatedAppId) {
      return next(errorHandler(404, "updatedappId not found"))
    }

    const updatedAppoinment = await Appointment.findByIdAndUpdate(
      updatedAppId,
      {
        $set: {
          ...req.body,
        },
      }
    )

    if (!updatedAppoinment) {
      return next(errorHandler(404, "appoinment not found"))
    }

    return res.status(200).json({ message: "appoinment updated successfull" })
  } catch (error) {
    console.log("Something went wrong")
    return next(error)
  }
}

const deleteAppoinment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { appId } = req.params
    console.log("this appId:", appId)

    if (!appId) {
      return next(errorHandler(500, "Patient id not found"))
    }

    const deletedAppoinment = await Appointment.findByIdAndDelete(appId)

    if (!deletedAppoinment) {
      return next(errorHandler(404, "Appointment not found"))
    }

    return res
      .status(200)
      .json({ success: true, message: "Appointment deleted successfully" })
  } catch (error: any) {
    console.error("An error occurred:", error)
    return next(errorHandler(500, "Something went wrong"))
  }
}

export default {
  deleteAppoinment,
  updateAppoinment,
}
