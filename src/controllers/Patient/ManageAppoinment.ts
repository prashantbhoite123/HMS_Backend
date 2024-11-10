import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../../Types/types"
import { errorHandler } from "../../utils/error.handler"
import { Appointment } from "../../model/Patient/Appointment"

const updateAppoinment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { updatedAppId } = req.params

    if (!updatedAppId) {
      return next(errorHandler(404, "updatedappId not found"))
    }

    const updatedAppoinment = await Appointment.findByIdAndUpdate(
      updatedAppId,
      {
        $set: {
          ...req.body,
        },
      }
    )

    if (!updatedAppoinment) {
      return next(errorHandler(404, "appoinment not found"))
    }

    return res
      .status(200)
      .json({ message: "appoinment updated successfull", updatedAppoinment })
  } catch (error) {
    console.log("Something went wrong")
    return next(error)
  }
}

const deleteAppoinment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { appId } = req.params
    console.log("this appId:", appId)

    if (!appId) {
      return next(errorHandler(500, "Patient id not found"))
    }

    const deletedAppoinment = await Appointment.findByIdAndDelete(appId)

    if (!deletedAppoinment) {
      return next(errorHandler(404, "Appointment not found"))
    }

    return res
      .status(200)
      .json({ success: true, message: "Appointment deleted successfully" })
  } catch (error: any) {
    console.error("An error occurred:", error)
    return next(errorHandler(500, "Something went wrong"))
  }
}

const searchAppoinment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const searchQuery = (req.query.searchQuery as string) || ""
    const sortOption = (req.query.sortOption as string) || "createdAt"
    const page = parseInt(req.query.page as string) || 1

    let query: any = {}

    const appCheck = await Appointment.countDocuments(query)

    if (appCheck === 0) {
      return res.json({
        data: [],
        total: 0,
        page: 1,
        pages: 1,
      })
    }

    if (searchQuery.trim()) {
      const searchRegex = new RegExp(searchQuery, "i")
      query["$or"] = [
        { patientName: searchRegex },
        { doctorName: searchRegex },
        { reason: searchRegex },
      ]
    }

    const pageSize = 5
    const skip = (page - 1) * pageSize

    const appointments = await Appointment.find(query)
      .populate("hospitalId", "hospitalName")
      .sort({ [sortOption]: -1 })
      .limit(pageSize)
      .skip(skip)
      .lean()

    const total = await Appointment.countDocuments(query)
    const response = {
      data: appointments,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    }

    return res.json(response)
  } catch (error: any) {
    console.log("Something went wrong")
    return next(error)
  }
}
export default {
  deleteAppoinment,
  updateAppoinment,
  searchAppoinment,
}
