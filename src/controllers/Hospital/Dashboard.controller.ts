import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../../Types/types"
import { errorHandler } from "../../utils/error.handler"
import Hospital from "../../model/Hospital/hospitalcreate.model"
import { Appointment } from "../../model/Patient/Appointment"
import { User } from "../../model/common_Model/user.model"
import { IAppointment } from "../../Types/HospitalTypes"

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
    const doctors = hospital.doctors

    const latesAppoinments = await Appointment.find({
      hospitalId: hospital._id,
    })
      .sort({ createdAt: -1 })
      .limit(5)

    const allAppoinment = await Appointment.find({ hospitalId: hospital._id })
    if (!latesAppoinments) {
      return next(errorHandler(404, "Appoinment not found"))
    }

    const pendingAppoinments = allAppoinment.filter(
      (app: IAppointment) => app.status === "Pending"
    )
    const cancelAppoinments = allAppoinment.filter(
      (app: IAppointment) => app.status === "Cancelled"
    )
    const completeAppoinments = allAppoinment.filter(
      (app: IAppointment) => app.status === "Completed"
    )

    const now = new Date()

    const oneMonthago = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    )

    const lastMonthAppoinment = await Appointment.countDocuments({
      createdAt: { $gte: oneMonthago },
    })

    const result = await Appointment.aggregate([
      {
        $group: {
          _id: { $month: "$date" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          month: "$_id",
          count: 1,
          _id: 0,
        },
      },
      { $sort: { month: 1 } },
    ])

    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const endOfToday = new Date()
    endOfToday.setHours(23, 59, 59, 999)

    const todayAppointments = await Appointment.find({
      appointmentDate: { $gte: startOfToday, $lte: endOfToday },
    })
      .sort({ createdAt: -1 })
      .limit(5)

    const totalData = {
      CardData: {
        completeAppoinments: completeAppoinments.length,
        cancelAppoinments: cancelAppoinments.length,
        pendingAppoinments: pendingAppoinments.length,
        lastMonthAppoinment,
      },
      latesAppoinments,
      chartData: result,
      todayAppointments,
      doctors,
      allAppoinment,
    }
    return res.json(totalData)
  } catch (error: any) {
    return next(errorHandler(400, "Failed to get data"))
  }
}

export default {
  getAllDashData,
}
