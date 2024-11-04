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

// const searchAppoinment = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const searchQuery = (req.query.searchQuery as string) || " "
//     const sortOption = (req.query.sortOption as string) || "createdAt" // Corrected to use sortOption
//     const page = parseInt(req.query.page as string) || 1

//     console.log("backend searchQuery ==>", searchQuery)
//     let query: any = {}

//     const appCheck = await Appointment.countDocuments(query)

//     if (appCheck === 0) {
//       return res.json({
//         data: [],
//         total: 0,
//         page: 1,
//         pages: 1,
//       })
//     }

//     if (searchQuery.trim()) {
//       const searchRegex = new RegExp(searchQuery, "i")
//       query["$or"] = [
//         { patientName: searchRegex },
//         { doctorName: searchRegex },
//         { reason: searchRegex },
//       ]
//     }

//     const pageSize = 5
//     const skip = (page - 1) * pageSize

//     // Fetch appointments based on the query

//     console.log("this is query", query)
//     const appointments = await Appointment.find(query)
//       .sort({ [sortOption]: -1 })
//       .limit(pageSize)
//       .skip(skip)
//       .lean()

//     console.log("appointments", appointments)
//     // Get the total count of documents matching the query
//     const total = await Appointment.countDocuments(query)
//     const response = {
//       data: appointments,
//       pagination: {
//         total,
//         page,
//         pages: Math.ceil(total / pageSize),
//       },
//     }
//     console.log("===========>?", response)
//     return res.json(response)
//   } catch (error: any) {
//     console.log("Something went wrong")
//     return next(error)
//   }
// }

const searchAppoinment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Change: Initialize with an empty string instead of space
    const searchQuery = (req.query.searchQuery as string) || ""
    const sortOption = (req.query.sortOption as string) || "createdAt"
    const page = parseInt(req.query.page as string) || 1

    console.log("backend searchQuery ==>", searchQuery)
    let query: any = {} // Default to an empty query

    // Check the number of appointments in the database
    const appCheck = await Appointment.countDocuments(query)

    if (appCheck === 0) {
      return res.json({
        data: [],
        total: 0,
        page: 1,
        pages: 1,
      })
    }

    // Change: Trim the search query and only create regex if it's not empty
    if (searchQuery.trim()) {
      const searchRegex = new RegExp(searchQuery, "i")
      query["$or"] = [
        { patientName: searchRegex },
        { doctorName: searchRegex },
        { reason: searchRegex },
      ]
    }

    const pageSize = 30 // Limit to 5 results
    const skip = (page - 1) * pageSize // Calculate the number of results to skip

    // Fetch appointments based on the query
    console.log("this is query", query)
    const appointments = await Appointment.find(query)
      .sort({ [sortOption]: -1 })
      .limit(pageSize)
      .skip(skip)
      .lean()

    console.log("appointments", appointments)
    const total = await Appointment.countDocuments(query)
    const response = {
      data: appointments,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    }
    console.log("===========>?", response)
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
