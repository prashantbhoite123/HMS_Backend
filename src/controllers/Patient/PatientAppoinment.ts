import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../../Types/types"
import { Appointment } from "../../model/Patient/Appointment"
import { errorHandler } from "../../utils/error.handler"
import { sendMail } from "../../utils/mailer"
import { param } from "express-validator"

const patientAppoinment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { hospitalId } = req.params
    console.log("hospital id", hospitalId)
    if (!req.body) {
      return next(errorHandler(404, "all field are required"))
    }

    const petientId = req.user?._id

    const appoinment = await Appointment.findOne({ petientId: petientId })
    console.log(appoinment)
    if (appoinment) {
      return next(errorHandler(500, "Your appoinment alreday pending"))
    }

    const newAppoinment = await Appointment.create({
      ...req.body,
      petientId: petientId,
      hospitalId,
    })
    console.log("this new app->", newAppoinment)
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
