import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../../Types/types"
import { errorHandler } from "../../utils/error.handler"
import { Patient } from "../../model/Patient/PatientProfile.model"

export const getPatientProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const existedPatientInfo = await Patient.findOne({ userId: req.user?._id })
    if (!existedPatientInfo) {
      return next(errorHandler(404, "patient info not found"))
    }

    return res.status(200).json(existedPatientInfo)
  } catch (error: any) {
    return next(error)
  }
}

export const patientProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Request Body:", req.body)

    if (req.body.visitHistory && !Array.isArray(req.body.visitHistory)) {
      req.body.visitHistory = Object.values(req.body.visitHistory)
    }

    const { name, age, visitHistory } = req.body
    if (!name || !age || !visitHistory?.length) {
      return next(
        errorHandler(400, "Name, age, and visit history are required")
      )
    }

    const newPatient = await Patient.create({
      ...req.body,
      userId: req.user?._id,
    })

    return res.status(201).json({
      success: true,
      message: "Patient information submitted successfully",
      patient: newPatient,
    })
  } catch (error: any) {
    console.error("Error creating patient profile:", error.message)
    return next(errorHandler(500, error.message || "Internal server error"))
  }
}

export const updatePatientProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      return next(errorHandler(404, "User data is required"))
    }
    const patient = await Patient.findOne({ userId: req.user?._id })

    if (!patient) {
      return next(errorHandler(404, "Patient not found"))
    }
    if (req.body.visitHistory && !Array.isArray(req.body.visitHistory)) {
      req.body.visitHistory = Object.values(req.body.visitHistory)
    }
    const { name, age, visitHistory } = req.body
    if (!name || !age || !visitHistory?.length) {
      return next(
        errorHandler(400, "Name, age, and visit history are required")
      )
    }
    const updatedProfile = await Patient.findByIdAndUpdate(
      patient._id,
      {
        $set: {
          ...req.body,
        },
      },
      { new: true }
    )

    res
      .status(200)
      .json({ message: "Profile updated successfull", updatedProfile })
  } catch (error: any) {
    return next(error)
  }
}

export const detailPatientProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { patientId } = req.params
    if (!patientId) {
      return next(errorHandler(404, "Patient id not found"))
    }

    const patientinfo = await Patient.findOne({ userId: patientId })

    if (!patientId) {
      return next(errorHandler(404, "patient not found"))
    }

    return res.status(200).json(patientinfo)
  } catch (error: any) {
    return next(error)
  }
}
export default {
  detailPatientProfile,
  updatePatientProfile,
  patientProfile,
  getPatientProfile,
}
