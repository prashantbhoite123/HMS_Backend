import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../../Types/types"
import { errorHandler } from "../../utils/error.handler"
import Hospital from "../../model/Hospital/hospitalcreate.model"
import { Appointment } from "../../model/Patient/Appointment"

const getAllDashData = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?._id) {
      return next(errorHandler(401, "User id not found"))
    }

    const hospital = await Hospital.findOne({ owner: req.user?._id })

    if (!hospital) {
      return next(errorHandler(404, "Hopital not found"))
    }

    const totalDoctors = hospital.doctors.length
    const totalUser = await Hospital.countDocuments()

    const latesAppoinments = await Appointment.find({
      hospitalId: hospital._id,
    }).limit(5)

    if (!latesAppoinments) {
      return next(errorHandler(404, "Appoinment not found"))
    }

    const totalAppoinment = await Appointment.countDocuments()

    const totalData = {
      CardData: {
        totalDoctors,
        totalUser,
        totalAppoinment,
      },
      latesAppoinments,
    }
    console.log(totalData)
    return res.json(totalData)
  } catch (error: any) {
    return next(errorHandler(400, "Failed to get data"))
  }
}

export default {
  getAllDashData,
}
