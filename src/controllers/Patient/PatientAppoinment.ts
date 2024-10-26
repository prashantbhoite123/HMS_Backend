import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../../Types/types"
import { Appointment } from "../../model/Patient/Appointment"
import { errorHandler } from "../../utils/error.handler"
import { sendMail } from "../../utils/mailer"

const patientAppoinment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      return next(errorHandler(404, "all field are required"))
    }

    console.log("this is patient id==>", req.user?._id)
    const patientId = req.user?._id
    const appoinment = await Appointment.findOne({
      patientId: patientId as string,
    })
    console.log(appoinment)
    if (appoinment?.status === "Pending") {
      return next(errorHandler(500, "Your appoinment alreday pending"))
    }

    const newAppoinment = await Appointment.create(req.body)

    return res
      .status(200)
      .json({ message: "Appoinment book successFully", newAppoinment })
  } catch (error: any) {
    console.log(`Error while patient appoinment :${error}`)
    return next(error)
  }
}

export default {
  patientAppoinment,
}
