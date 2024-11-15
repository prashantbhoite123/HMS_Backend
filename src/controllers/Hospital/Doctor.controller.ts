import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../../Types/types"
import { errorHandler } from "../../utils/error.handler"
import { Doctors } from "../../model/Hospital/doctors"
import bcryptjs from "bcryptjs"

const registerDoctor = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      return next(errorHandler(404, "all fields are required"))
    }

    const doctor = await Doctors.findOne({ ownerId: req.user?._id })
    if (doctor) {
      return next(errorHandler(400, "doctor already exist"))
    }
    const decriptedPass = bcryptjs.hashSync(req.body.password, 10)
    const newDoctor = await Doctors.create({
      ...req.body,
      password: decriptedPass,
    })
    return res
      .status(200)
      .json({ success: true, message: "Doctor register successful" })
  } catch (error: any) {
    return next(error)
  }
}

export default {
  registerDoctor,
}
