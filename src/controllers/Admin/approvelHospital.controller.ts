import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../../Types/types"
import Hospital from "../../model/Hospital/hospitalcreate.model"
import { errorHandler } from "../../utils/error.handler"
import { send } from "process"
import { sendMail } from "../../utils/mailer"
import { User } from "../../model/common_Model/user.model"

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

const rejectHospitalApi = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { hospitalId } = req.params
    const { reson } = req.body
    if (!hospitalId) {
      return next(errorHandler(404, "HospitalId is required"))
    }
    if (!reson) {
      return next(errorHandler(404, "reson is required"))
    }

    const updatedhos = await Hospital.findByIdAndUpdate(hospitalId, {
      $set: {
        status: "Rejected",
      },
    })

    // const hospitalOwner = await User.findOne({ owner: updatedhos?.owner })
    // if (!hospitalOwner) {
    //   return next(errorHandler(404, "Hospital owner not found"))
    // }
    sendMail(
      // hospitalOwner?.email,
      "pbhoite985@gmail.com",
      // hospitalOwner?.email,
      "bhoitep326@gmail.com",
      "",
      "Hospital Registration Application Status",
      // `Dear ${hospitalOwner?.username}, \n\n
      `Dear Prashant, \n\n
       Thank you for your interest in registering with us !! \n\n
       ${reson} \n\n
       ${updatedhos?.hospitalName}
      `,
      process.env.EMAIL_USER,
      process.env.EMAIL_PASS
    )
    console.log("hospital updated==>", updatedhos)
    return res
      .status(200)
      .json({ success: true, message: "Hospital rejected !" })
  } catch (error) {
    return next(error)
  }
}

export default {
  approvelHospitals,
  rejectHospitalApi,
}
