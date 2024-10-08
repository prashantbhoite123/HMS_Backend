import { NextFunction, Response } from "express"
import Hospital from "../../model/Hospital/hospitalcreate.model"
import { AuthenticatedRequest } from "../../Types/types"
import { errorHandler } from "../../utils/error.handler"
import cloudinary from "cloudinary"

import mongoose from "mongoose"

const getMyhospital = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const hospitalData = await Hospital.findOne({ owner: req.user?._id })

    if (!hospitalData) {
      return next(errorHandler(400, "hospital not found"))
    }

    res.status(200).json({ success: true, hospitalData })
  } catch (error) {
    console.log(`Error while get hospital ${error}`)
    return res
      .status(400)
      .json({ messgae: "Something went wrong in getHospital api" })
  }
}

const createHospital = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("=====", req.body)
    const _id = req.user?._id
    const existHospital = await Hospital.findOne({ owner: _id })

    if (existHospital) {
      return next(errorHandler(400, "Hospital already exist"))
    }

    if (!req.file) {
      return res.status(400).json({ message: "picture file is required" })
    }
    // const doctors = JSON.parse(req.body.doctors)

    // console.log("doctors ======", doctors)
    const pictureUrl = await uploadImage(req.file as Express.Multer.File)

    const hospital = new Hospital({
      ...req.body,
      // doctors: doctors,
    })

    hospital.picture = pictureUrl
    hospital.owner = new mongoose.Types.ObjectId(req.user?._id)

    console.log("This is an hospital : ", hospital)
    await hospital.save()

    res
      .status(200)
      .json({ success: true, message: "Hospital create successfull", hospital })
  } catch (error) {
    console.log(`Error while createhospital${error}`)
    next(error)
  }
}

const uploadImage = async (file: Express.Multer.File) => {
  const image = file
  const base64Image = Buffer.from(image.buffer).toString("base64")
  const dataURI = `data:${image.mimetype};base64,${base64Image}`
  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI)

  return uploadResponse.url
}

export default {
  getMyhospital,
  createHospital,
}
