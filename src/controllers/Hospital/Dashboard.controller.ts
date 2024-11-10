import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../../Types/types"
import { errorHandler } from "../../utils/error.handler"
import Hospital from "../../model/Hospital/hospitalcreate.model"
import { Appointment } from "../../model/Patient/Appointment"
import { User } from "../../model/common_Model/user.model"
import { count } from "console"

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
    const totalDoctors = hospital.doctors.length
    const totalUser = await User.countDocuments()

    const latesAppoinments = await Appointment.find({
      hospitalId: hospital._id,
    })
      .sort({ createdAt: -1 })
      .limit(5)

    const allAppoinment = await Appointment.find({ hospitalId: hospital._id })
    if (!latesAppoinments) {
      return next(errorHandler(404, "Appoinment not found"))
    }

    const totalAppoinment = await Appointment.countDocuments()

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
    startOfToday.setHours(0, 0, 0, 0) // Set time to 00:00:00.000

    const endOfToday = new Date()
    endOfToday.setHours(23, 59, 59, 999) // Set time to 23:59:59.999

    const todayAppointments = await Appointment.find({
      appointmentDate: { $gte: startOfToday, $lt: endOfToday },
    })

    console.log(todayAppointments)
    const totalData = {
      CardData: {
        totalDoctors,
        totalUser,
        totalAppoinment,
        lastMonthAppoinment,
      },
      latesAppoinments,
      chartData: result,
      todayAppointments,
      doctors,
      allAppoinment,
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
