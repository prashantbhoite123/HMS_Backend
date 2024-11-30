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
    if (hospitalData?.status === "Approved") {
      return res.status(200).json(hospitalData)
    } else {
      return res.status(200).json(hospitalData?.status)
    }
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
    const _id = req.user?._id
    
    const existHospital = await Hospital.findOne({ owner: _id })

    if (existHospital) {
      return next(errorHandler(400, "Hospital already exist"))
    }

    if (!req.file) {
      return res.status(400).json({ message: "picture file is required" })
    }

    const pictureUrl = await uploadImage(req.file as Express.Multer.File)

    const hospital = await Hospital.create({
      ...req.body,
      owner: req.user?._id,
      picture: pictureUrl,
    })

    
    return res
      .status(200)
      .json({ success: true, message: "Hospital create successfull", hospital })
  } catch (error: any) {
    console.log(`Error while createhospital${error.message}`)
    next(error)
  }
}

const updateHospital = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const hospital = await Hospital.findOne({ owner: req.user?._id })

    if (!hospital) {
      return next(errorHandler(400, "Hospital not found"))
    }
    if (req.file) {
      const picture = await uploadImage(req.file as Express.Multer.File)
      req.body.picture = picture
    }

    
    const updatedHospital = await Hospital.findByIdAndUpdate(
      hospital.id,
      {
        $set: { ...req.body },
      },
      { new: true }
    )

    res.status(200).send(updatedHospital)
  } catch (error) {
    next(error)
    console.log(`Error while update Hospital :${error}`)
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
  createHospital,
  getMyhospital,
  updateHospital,
}
