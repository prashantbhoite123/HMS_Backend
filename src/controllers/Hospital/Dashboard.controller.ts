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

  // User profile data
  const ProfileData = await User.findById(req.user?._id)

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
    ProfileData,
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

  const ProfileData = await User.findOne({ role: "Admin" })

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
    ProfileData,
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
