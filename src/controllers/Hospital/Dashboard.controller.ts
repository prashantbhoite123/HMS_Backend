import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../../Types/types"
import { errorHandler } from "../../utils/error.handler"
import Hospital from "../../model/Hospital/hospitalcreate.model"
import { Appointment } from "../../model/Patient/Appointment"

import { IAppointment } from "../../Types/HospitalTypes"
import { User } from "../../model/common_Model/user.model"
import { Doctors } from "../../model/Hospital/doctors"

const getAllDashData = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?._id) {
      return next(errorHandler(401, "User id not found"))
    }

    if (req.user?.role === "Hospital") {
      return res.json(hospitalDashData)
    } else if (req.user?.role === "Admin") {
      return res.json(adminDashData)
    } else {
      return res.json(doctorDashData)
    }
  } catch (error: any) {
    return next(errorHandler(400, "Failed to get data"))
  }
}

const hospitalDashData = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const hospital = await Hospital.findOne({ owner: req.user?._id })
    const hosManager = await User.findById(req.user?._id)
    if (!hospital) {
      return next(errorHandler(404, "Hopital not found"))
    }

    const latesAppoinments = await Appointment.find({
      hospitalId: hospital._id,
    })
      .sort({ createdAt: -1 })
      .limit(5)

    const allAppoinment = await Appointment.find({ hospitalId: hospital._id })
    if (!latesAppoinments) {
      return next(errorHandler(404, "Appoinment not found"))
    }

    const totalDoctors = await Doctors.find({ hospitalId: hospital._id })
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
      allAppoinment,
      totalDoctors,
      hosManager,
    }

    return totalData
  } catch (error: any) {
    return next(error)
  }
}

const adminDashData = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const Hospitals = await Hospital.find()
    const totalApprovedHospital = Hospitals.filter(
      (hospital) => hospital.status === "Approved"
    )
    const totalPendingHospital = Hospitals.filter(
      (hospital) => hospital.status === "Pending"
    )

    const totalUsers = await User.find()
    const totalPatient = totalUsers.filter((user) => user.role === "Patient")
    const adminProfileData = await User.findOne({ role: "Admin" })

    const totalData = {
      totalApprovedHospital,
      totalPendingHospital,
      totalUsers: totalUsers.length,
      totalPatient,
      adminProfileData,
    }

    return totalData
  } catch (error: any) {
    return next(error)
  }
}

const doctorDashData = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const doctor = await Doctors.findById(req.user?._id)
    const appoinments = await Appointment.find({
      doctorName: doctor?.doctorName,
    })

    const pendingAppoinments = appoinments.filter(
      (app) => app.status === "Pending"
    )
    const cancelledAppoinments = appoinments.filter(
      (app) => app.status === "Cancelled"
    )
    const completedAppoinments = appoinments.filter(
      (app) => app.status === "Completed"
    )
    const latesAppoinments = await Appointment.find({
      doctorName: doctor?.doctorName,
    })
      .sort({ createdAt: -1 })
      .limit(5)

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
      dashData: {
        latesAppoinments,
        todayAppointments,
        pendingAppoinments,
        cancelledAppoinments,
        completedAppoinments,
      },
      appoinments,
      doctor,
    }

    return totalData
  } catch (error: any) {
    return next(error)
  }
}
export default {
  getAllDashData,
}
