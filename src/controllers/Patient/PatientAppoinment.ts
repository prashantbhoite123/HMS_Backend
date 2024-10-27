import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../../Types/types"
import { Appointment } from "../../model/Patient/Appointment"
import { errorHandler } from "../../utils/error.handler"
import { sendMail } from "../../utils/mailer"
import { param } from "express-validator"
import Hospital from "../../model/Hospital/hospitalcreate.model"
import { User } from "../../model/common_Model/user.model"

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

    const newAppoinment = await Appointment.create({
      ...req.body,
      petientId: petientId,
      hospitalId,
    })

    console.log(newAppoinment)

    const hospitalemail = await Hospital.findById(newAppoinment.hospitalId)
    console.log(hospitalemail)
    const hosEmail = await User.findById(hospitalemail?.owner)
    const patientEmail = await User.findById(newAppoinment.petientId)

    console.log("this is a patient user", patientEmail)
    sendMail(
      hosEmail?.email,
      patientEmail?.email,
      "Appoinement",
      "Appinment book successfull",
      process.env.EMAIL_USER,
      process.env.EMAIL_PASS
    )
    return res.status(200).json({
      success: true,
      message: "Appoinment book successFully",
      newAppoinment,
    })
  } catch (error: any) {
    console.log(`Error while patient appoinment :${error}`)
    return next(error)
  }
}

export default {
  patientAppoinment,
}
