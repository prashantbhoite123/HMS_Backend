import { Request, Response, NextFunction } from "express"
import Hospital from "../../model/Hospital/hospitalcreate.model"
import { AuthenticatedRequest } from "../../Types/types"
import { errorHandler } from "../../utils/error.handler"

const getallHospital = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const getallHospital = await Hospital.find()

    if (!getallHospital) {
      return next(errorHandler(500, "Hospital not found"))
    }

    res.status(200).json(getallHospital)
  } catch (error) {
    next(error)
  }
}

const searchHospital = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const searchQuery = (req.query.searchQuery as string) || " "
    const departments = (req.query.departments as string) || ""
    const sortOption = (req.query.sortOption as string) || "lastUpdated"
    const totalBeds = parseInt(req.query.totalBeds as string) || 1
    const hospitaltype = (req.query.hospitaltype as string) || ""
    const page = parseInt(req.query.page as string) || 1

    let query: any = {}

    const cityCheck = await Hospital.countDocuments(query)

    if (cityCheck === 0) {
      return res.status(404).json({
        data: [],
        total: 0,
        page: 1,
        pages: 1,
      })
    }
    if (departments) {
      const departmentArray = departments
        .split(",")
        .map((department) => new RegExp(department, "i"))

      query["departments"] = { $all: departmentArray }
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i")
      query["$or"] = [
        { hospitalName: searchRegex },
        { hospitaltype: searchRegex },
        { departments: { $in: [searchRegex] } },
        { address: { $in: [searchRegex] } },
      ]
    }

    if (totalBeds) {
      query["totalBeds"] = { $gte: totalBeds }
    }

    if (hospitaltype) {
      query["hospitalType"] = new RegExp(hospitaltype, "i")
    }

    const pageSize = 5
    const skip = (page - 1) * pageSize
    const hospitals = await Hospital.find(query)
      .sort({ [sortOption]: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean()

    const total = await Hospital.countDocuments(query)

    const response = {
      data: hospitals,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    }

    res.json(response)
  } catch (error) {
    return next(errorHandler(400, "faild to search"))
  }
}

const getHospital = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { hospitalid } = req.params

    if (!hospitalid) {
      return next(errorHandler(404, "hospital id not found"))
    }

    const hospital = await Hospital.findById(hospitalid)

    if (!hospital) {
      return next(errorHandler(404, "Hospital not found"))
    }

    return res.status(200).json(hospital)
  } catch (error) {
    console.log(`Error while getRestaurant  :${error}`)
    return next(error)
  }
}

export default {
  getallHospital,
  searchHospital,
  getHospital,
}
