// import { NextFunction, Response } from "express"
// import { AuthenticatedRequest } from "../../Types/types"
// import { errorHandler } from "../../utils/error.handler"
// import { Patient } from "../../model/Patient/PatientProfile.model"

// const patientProfile = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     console.log("======>", req.body)
//     if (!req.body) {
//       return next(errorHandler(404, "All fields are required"))
//     }

//     const newPatient = await Patient.create({
//       ...req.body,
//       userId: req.user?._id,
//     })

//     if (!newPatient) {
//       return next(errorHandler(500, "Error While create patient informtion"))
//     }

//     return res
//       .status(200)
//       .json({ success: true, message: "patient information submit successful" })
//   } catch (error: any) {
//     return next(error)
//   }
// }

// export default {
//   patientProfile,
// }

import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../../Types/types"
import { errorHandler } from "../../utils/error.handler"
import { Patient } from "../../model/Patient/PatientProfile.model"

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

export default {
  patientProfile,
}
