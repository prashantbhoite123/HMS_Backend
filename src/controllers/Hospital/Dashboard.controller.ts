// import { NextFunction, Response } from "express"
// import { AuthenticatedRequest } from "../../Types/types"
// import { errorHandler } from "../../utils/error.handler"
// import Hospital from "../../model/Hospital/hospitalcreate.model"
// import { Appointment } from "../../model/Patient/Appointment"

// import { IAppointment } from "../../Types/HospitalTypes"
// import { User } from "../../model/common_Model/user.model"
// import { Doctors } from "../../model/Hospital/doctors"

// const getAllDashData = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     if (!req.user?._id) {
//       return next(errorHandler(401, "User id not found"))
//     }

//     if (req.user?.role === "Hospital") {
//       return res.json(hospitalDashData)
//     } else if (req.user?.role === "Admin") {
//       return res.json(adminDashData)
//     } else {
//       return res.json(doctorDashData)
//     }
//   } catch (error: any) {
//     return next(errorHandler(400, "Failed to get data"))
//   }
// }

// const hospitalDashData = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const hospital = await Hospital.findOne({ owner: req.user?._id })
//     const hosManager = await User.findById(req.user?._id)
//     if (!hospital) {
//       return next(errorHandler(404, "Hopital not found"))
//     }

//     const latesAppoinments = await Appointment.find({
//       hospitalId: hospital._id,
//     })
//       .sort({ createdAt: -1 })
//       .limit(5)

//     const allAppoinment = await Appointment.find({ hospitalId: hospital._id })
//     if (!latesAppoinments) {
//       return next(errorHandler(404, "Appoinment not found"))
//     }

//     const totalDoctors = await Doctors.find({ hospitalId: hospital._id })
//     const pendingAppoinments = allAppoinment.filter(
//       (app: IAppointment) => app.status === "Pending"
//     )
//     const cancelAppoinments = allAppoinment.filter(
//       (app: IAppointment) => app.status === "Cancelled"
//     )
//     const completeAppoinments = allAppoinment.filter(
//       (app: IAppointment) => app.status === "Completed"
//     )

//     const now = new Date()

//     const oneMonthago = new Date(
//       now.getFullYear(),
//       now.getMonth() - 1,
//       now.getDate()
//     )

//     const lastMonthAppoinment = await Appointment.countDocuments({
//       createdAt: { $gte: oneMonthago },
//     })

//     const result = await Appointment.aggregate([
//       {
//         $group: {
//           _id: { $month: "$date" },
//           count: { $sum: 1 },
//         },
//       },
//       {
//         $project: {
//           month: "$_id",
//           count: 1,
//           _id: 0,
//         },
//       },
//       { $sort: { month: 1 } },
//     ])

//     const startOfToday = new Date()
//     startOfToday.setHours(0, 0, 0, 0)

//     const endOfToday = new Date()
//     endOfToday.setHours(23, 59, 59, 999)

//     const todayAppointments = await Appointment.find({
//       appointmentDate: { $gte: startOfToday, $lte: endOfToday },
//     })
//       .sort({ createdAt: -1 })
//       .limit(5)

//     const totalData = {
//       CardData: {
//         completeAppoinments: completeAppoinments.length,
//         cancelAppoinments: cancelAppoinments.length,
//         pendingAppoinments: pendingAppoinments.length,
//         lastMonthAppoinment,
//       },
//       latesAppoinments,
//       chartData: result,
//       todayAppointments,
//       allAppoinment,
//       totalDoctors,
//       hosManager,
//     }

//     return totalData
//   } catch (error: any) {
//     return next(error)
//   }
// }

// const adminDashData = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const Hospitals = await Hospital.find()
//     const totalApprovedHospital = Hospitals.filter(
//       (hospital) => hospital.status === "Approved"
//     )
//     const totalPendingHospital = Hospitals.filter(
//       (hospital) => hospital.status === "Pending"
//     )

//     const totalUsers = await User.find()
//     const totalPatient = totalUsers.filter((user) => user.role === "Patient")
//     const adminProfileData = await User.findOne({ role: "Admin" })

//     const totalData = {
//       totalApprovedHospital,
//       totalPendingHospital,
//       totalUsers: totalUsers.length,
//       totalPatient,
//       adminProfileData,
//     }

//     return totalData
//   } catch (error: any) {
//     return next(error)
//   }
// }

// const doctorDashData = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const doctor = await Doctors.findById(req.user?._id)
//     const appoinments = await Appointment.find({
//       doctorName: doctor?.doctorName,
//     })

//     const pendingAppoinments = appoinments.filter(
//       (app) => app.status === "Pending"
//     )
//     const cancelledAppoinments = appoinments.filter(
//       (app) => app.status === "Cancelled"
//     )
//     const completedAppoinments = appoinments.filter(
//       (app) => app.status === "Completed"
//     )
//     const latesAppoinments = await Appointment.find({
//       doctorName: doctor?.doctorName,
//     })
//       .sort({ createdAt: -1 })
//       .limit(5)

//     const startOfToday = new Date()
//     startOfToday.setHours(0, 0, 0, 0)

//     const endOfToday = new Date()
//     endOfToday.setHours(23, 59, 59, 999)

//     const todayAppointments = await Appointment.find({
//       appointmentDate: { $gte: startOfToday, $lte: endOfToday },
//     })
//       .sort({ createdAt: -1 })
//       .limit(5)

//     const totalData = {
//       dashData: {
//         latesAppoinments,
//         todayAppointments,
//         pendingAppoinments,
//         cancelledAppoinments,
//         completedAppoinments,
//       },
//       appoinments,
//       doctor,
//     }

//     return totalData
//   } catch (error: any) {
//     return next(error)
//   }
// }
// export default {
//   getAllDashData,
// }

import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../../Types/types"
import { errorHandler } from "../../utils/error.handler"
import Hospital from "../../model/Hospital/hospitalcreate.model"
import { Appointment } from "../../model/Patient/Appointment"
import { User } from "../../model/common_Model/user.model"
import { Doctors } from "../../model/Hospital/doctors"
import { IAppointment } from "../../Types/HospitalTypes"

const filterAppointmentsByStatus = (
  appointments: IAppointment[],
  status: string
) => appointments.filter((app) => app.status === status)

const getTodayAppointments = async (filter: object = {}) => {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const endOfToday = new Date()
  endOfToday.setHours(23, 59, 59, 999)

  return await Appointment.find({
    appointmentDate: { $gte: startOfToday, $lte: endOfToday },
    ...filter,
  })
    .sort({ createdAt: -1 })
    .limit(5)
}

// Role-Specific Dashboards
const hospitalDashData = async (req: AuthenticatedRequest) => {
  const hospital = await Hospital.findOne({ owner: req.user?._id })
  if (!hospital) throw errorHandler(404, "Hospital not found")

  const allAppointments = await Appointment.find({ hospitalId: hospital._id })
  const latesAppointments = await Appointment.find({ hospitalId: hospital._id })
    .sort({ createdAt: -1 })
    .limit(5)

  const totalDoctors = await Doctors.find({ hospitalId: hospital._id })
  const pendingAppointments = filterAppointmentsByStatus(
    allAppointments,
    "Pending"
  )
  const cancelAppointments = filterAppointmentsByStatus(
    allAppointments,
    "Cancelled"
  )
  const completeAppointments = filterAppointmentsByStatus(
    allAppointments,
    "Completed"
  )

  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

  const lastMonthAppointments = await Appointment.countDocuments({
    createdAt: { $gte: oneMonthAgo },
    hospitalId: hospital._id,
  })

  const todayAppointments = await getTodayAppointments({
    hospitalId: hospital._id,
  })

  const chartData = await Appointment.aggregate([
    { $group: { _id: { $month: "$date" }, count: { $sum: 1 } } },
    { $project: { month: "$_id", count: 1, _id: 0 } },
    { $sort: { month: 1 } },
  ])

  return {
    CardData: {
      completeAppointments: completeAppointments.length,
      cancelAppointments: cancelAppointments.length,
      pendingAppointments: pendingAppointments.length,
      totalDoctors: totalDoctors.length,
      lastMonthAppointments,
    },
    latestAppointments: latesAppointments,
    chartData,
    todayAppointments,
    allAppointments,
    totalDoctors,
  }
}

const adminDashData = async () => {
  const Hospitals = await Hospital.find()
  const totalApprovedHospital = Hospitals.filter(
    (hospital) => hospital.status === "Approved"
  )
  const totalPendingHospital = Hospitals.filter(
    (hospital) => hospital.status === "Pending"
  )

  
  const today = new Date()
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  )

  
  const firstDayOfLastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  )
  const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)

  
  const lastMonthApprovedHospital = totalApprovedHospital.filter(
    (hospital) =>
      new Date(hospital.createdAt) >= firstDayOfLastMonth &&
      new Date(hospital.createdAt) <= lastDayOfLastMonth
  )

  
  const lastMonthPendingHospital = totalPendingHospital.filter(
    (hospital) =>
      new Date(hospital.createdAt) >= firstDayOfLastMonth &&
      new Date(hospital.createdAt) <= lastDayOfLastMonth
  )

  
  const lastMonthPatients = await User.find({
    role: "Patient",
    createdAt: { $gte: firstDayOfLastMonth, $lte: lastDayOfLastMonth },
  })

  
  const lastMonthUsers = await User.find({
    createdAt: { $gte: firstDayOfLastMonth, $lte: lastDayOfLastMonth },
  })

  
  const todaysPendingHospitals = totalPendingHospital.filter(
    (hospital) =>
      new Date(hospital.createdAt) >= startOfDay &&
      new Date(hospital.createdAt) < endOfDay
  )

  
  const latestPendingHospitals = totalPendingHospital
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5) 

  const totalUsers = await User.find()
  const totalPatient = await User.countDocuments({ role: "Patient" })

  const chartData = await Hospital.aggregate([
    { $group: { _id: { $month: "$date" }, count: { $sum: 1 } } },
    { $project: { month: "$_id", count: 1, _id: 0 } },
    { $sort: { month: 1 } },
  ])

  const adminProfileData = await User.findOne({ role: "Admin" })

  return {
    dashCard: {
      totalApprovedHospital: totalApprovedHospital.length,
      totalPatient,
      totalPendingHospital: totalPendingHospital.length,
      totalUsers: totalUsers.length,
      lastMonthData: {
        approvedHospital: lastMonthApprovedHospital.length,
        pendingHospital: lastMonthPendingHospital.length,
        users: lastMonthUsers.length,
        patients: lastMonthPatients.length,
      },
    },
    latestPendingHospitals,
    todaysPendingHospitals,
    chartData,
    PendingHospital: totalPendingHospital,
    ApprovedHospital: totalApprovedHospital,
    adminProfileData,
  }
}

const doctorDashData = async (req: AuthenticatedRequest) => {
  const doctor = await Doctors.findById(req.user?._id)
  if (!doctor) throw errorHandler(404, "Doctor not found")

  const allAppointments = await Appointment.find({
    doctorName: doctor?.doctorName,
  })

  const pendingAppointments = filterAppointmentsByStatus(
    allAppointments,
    "Pending"
  )
  const cancelledAppointments = filterAppointmentsByStatus(
    allAppointments,
    "Cancelled"
  )
  const completedAppointments = filterAppointmentsByStatus(
    allAppointments,
    "Completed"
  )

  const latestAppointments = await Appointment.find({
    doctorName: doctor?.doctorName,
  })
    .sort({ createdAt: -1 })
    .limit(5)

  const todayAppointments = await getTodayAppointments({
    doctorName: doctor?.doctorName,
  })

  return {
    dashData: {
      latestAppointments,
      todayAppointments,
      pendingAppointments,
      cancelledAppointments,
      completedAppointments,
    },
    allAppointments,
    doctor,
  }
}

const getAllDashData = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?._id) {
      return next(errorHandler(401, "User ID not found"))
    }

    let data
    switch (req.user.role) {
      case "hospital":
        data = await hospitalDashData(req)
        break
      case "Admin":
        data = await adminDashData()
        break
      case "Doctor":
        data = await doctorDashData(req)
        break
      default:
        throw errorHandler(403, "Unauthorized role")
    }

    return res.json(data)
  } catch (error: any) {
    return next(errorHandler(400, error.message || "Failed to fetch data"))
  }
}

export default { getAllDashData }
