import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../../Types/types"
import { errorHandler } from "../../utils/error.handler"
import { Appointment } from "../../model/Patient/Appointment"
import { sendMail } from "../../utils/mailer"
import { Patient } from "../../model/Patient/PatientProfile.model"
import Hospital from "../../model/Hospital/hospitalcreate.model"

const cancelAppoinment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { appId } = req.params
    const { reson } = req.body
    if (!appId) {
      return next(errorHandler(404, "Appoinment Id not found"))
    }
    if (!reson) {
      return next(errorHandler(404, "Reson is required"))
    }

    const appoinment = await Appointment.findById(appId)
    if (!appoinment) {
      return next(errorHandler(404, "Appoinemmt not found"))
    }

    const patient = await Patient.findOne({ userId: appoinment.petientId })
    const hospital = await Hospital.findById(appoinment.hospitalId)
    const updateApp = await Appointment.findByIdAndUpdate(
      appoinment._id,
      {
        $set: {
          status: "Cancelled",
        },
      },
      { new: true }
    )

    if (!updateApp) {
      return next(errorHandler(404, "Failed to cancel appoinment"))
    }

    sendMail(
      // hospitalOwner?.email,
      "pbhoite985@gmail.com",
      // hospitalOwner?.email,
      "bhoitep326@gmail.com",
      "Important Update: Your Appointment Has Been Canceled",
      `Dear ${patient?.name}, \n\n
       e regret to inform you that your appointment scheduled for **${appoinment?.appointmentDate.toLocaleDateString()} at ${
        appoinment?.appTime
      }** with **${appoinment?.doctorName || "the concerned doctor"}** at **${
        hospital?.hospitalName || "our hospital"
      }** has been canceled due to the following reason: **${
        reson || "unforeseen circumstances."
      }**

  We understand that this may cause inconvenience, and we sincerely apologize for the disruption.

  ### What You Can Do Next:
  - **Reschedule Your Appointment**: [Insert rescheduling link or instructions, if applicable]
  - **Contact Us**: If you have any questions or need assistance, please reach out to us at **${
    process.env.HOSPITAL_SUPPORT_EMAIL || "pbhoite985@gmail.com"
  }**.

  Thank you for your understanding, and we hope to assist you with rescheduling soon.

  **Best regards,**  
  The ${hospital?.hospitalName || "Hospital"} Team
  `,

      "",
      process.env.EMAIL_USER,
      process.env.EMAIL_PASS
    )

    return res.status(200).json({ message: "Appoinment has been cancelled" })
  } catch (error: any) {
    return next(error)
  }
}

const scheduleAppoinment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { appId } = req.params
    if (!appId) {
      return next(errorHandler(404, "appoinment id not found"))
    }

    const appoinment = await Appointment.findById(appId)

    if (!appoinment) {
      return next(errorHandler(404, "Appoinment not found"))
    }

    const scheduleApp = await Appointment.findByIdAndUpdate(
      appoinment?._id,
      {
        $set: {
          status: "Completed",
        },
      },
      { new: true }
    )

    if (!scheduleApp) {
      return next(errorHandler(400, "Failed to Schedule appoinment"))
    }

    return res.status(200).json({ message: "Appoinment Schedule successFull" })
  } catch (error: any) {
    return next(error)
  }
}
export default {
  cancelAppoinment,
  scheduleAppoinment,
}
