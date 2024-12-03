import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../../Types/types"
import { errorHandler } from "../../utils/error.handler"
import Hospital from "../../model/Hospital/hospitalcreate.model"
import { Appointment } from "../../model/Patient/Appointment"
import { User } from "../../model/common_Model/user.model"
import { Doctors } from "../../model/Hospital/doctors"
import { IAppointment } from "../../Types/HospitalTypes"
import { Patient } from "../../model/Patient/PatientProfile.model"

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

const hospitalDashData = async (req: AuthenticatedRequest) => {
  const hospital = await Hospital.findOne({ owner: req.user?._id })
  if (!hospital) throw errorHandler(404, "Hospital not found")

  const allAppointments = await Appointment.find({ hospitalId: hospital._id })

  const latesAppointments = await Appointment.find({
    hospitalId: hospital._id,
  })
    .sort({ createdAt: -1 })
    .limit(5)

  const totalDoctors = await Doctors.find({ hospitalId: hospital._id })

  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

  // Last month's appointments
  const lastMonthAppointments = await Appointment.find({
    hospitalId: hospital._id,
    createdAt: { $gte: oneMonthAgo },
  })

  const lastMonthPatientIds = lastMonthAppointments.map(
    (appointment) => appointment.petientId
  )
  const lastMonthPatients = new Set(lastMonthPatientIds).size

  const lastMonthDoctors = await Doctors.find({
    hospitalId: hospital._id,
    createdAt: { $gte: oneMonthAgo },
  })

  const chartData = await Appointment.aggregate([
    { $group: { _id: { $month: "$date" }, count: { $sum: 1 } } },
    { $project: { month: "$_id", count: 1, _id: 0 } },
    { $sort: { month: 1 } },
  ])

  return {
    CardData: {
      totalAppoinments: allAppointments.length,
      totalDoctors: totalDoctors.length,
      totalPatient: new Set(
        allAppointments.map((appointment) => appointment.petientId)
      ).size,
      lastMonthAppointments: lastMonthAppointments.length,
      lastMonthPatients,
      lastMonthDoctors: lastMonthDoctors.length,
    },
    latestAppointments: latesAppointments,
    chartData,
    todayAppointments: lastMonthAppointments.filter(
      (appointment) =>
        new Date(appointment.createdAt).toDateString() ===
        new Date().toDateString()
    ),
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
  }
}

export const doctorDashData = async (req: AuthenticatedRequest) => {
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

  const now = new Date()
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(now.getMonth() - 1)

  const lastMonthAppointments = await Appointment.find({
    doctorName: doctor?.doctorName,
    createdAt: { $gte: oneMonthAgo, $lte: now },
  })

  const lastMonthPending = filterAppointmentsByStatus(
    lastMonthAppointments,
    "Pending"
  )
  const lastMonthCancelled = filterAppointmentsByStatus(
    lastMonthAppointments,
    "Cancelled"
  )
  const lastMonthCompleted = filterAppointmentsByStatus(
    lastMonthAppointments,
    "Completed"
  )

  const latestAppointments = await Appointment.find({
    doctorName: doctor?.doctorName,
  })
    .sort({ createdAt: -1 })
    .limit(5)

  const todayAppointments = await Appointment.find({
    doctorName: doctor?.doctorName,
    createdAt: {
      $gte: new Date().setHours(0, 0, 0, 0),
      $lte: new Date().setHours(23, 59, 59, 999),
    },
  })

  const patientIds = allAppointments.map((appointment) => appointment.petientId)
  const uniquePatientIds = Array.from(new Set(patientIds))

  const allPatients = await Patient.find({
    userId: { $in: uniquePatientIds },
  })

  const chartData = await Appointment.aggregate([
    { $group: { _id: { $month: "$date" }, count: { $sum: 1 } } },
    { $project: { month: "$_id", count: 1, _id: 0 } },
    { $sort: { month: 1 } },
  ])

  return {
    dashData: {
      pendingAppointments: pendingAppointments.length,
      cancelledAppointments: cancelledAppointments.length,
      completedAppointments: completedAppointments.length,
      lastMonth: {
        pending: lastMonthPending.length,
        cancelled: lastMonthCancelled.length,
        completed: lastMonthCompleted.length,
      },
    },
    latestAppointments,
    todayAppointments,
    allAppointments: allAppointments,
    allPatients,
    chartData,
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
    if (req.user.role === "hospital") {
      data = await hospitalDashData(req)
    } else if (req.user.role === "Admin") {
      data = await adminDashData()
    } else if (req.user.role === "Doctor") {
      data = await doctorDashData(req)
    } else {
      throw errorHandler(403, "Unauthorized role")
    }

    return res.json(data)
  } catch (error: any) {
    return next(errorHandler(400, error.message || "Failed to fetch data"))
  }
}

export default { getAllDashData }
