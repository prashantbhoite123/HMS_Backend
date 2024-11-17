import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../../Types/types"
import { errorHandler } from "../../utils/error.handler"
import { Doctors } from "../../model/Hospital/doctors"
import bcryptjs from "bcryptjs"
import cloudinary from "cloudinary"
const registerDoctor = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body)
    if (!req.body) {
      return next(errorHandler(404, "all fields are required"))
    }

    // const files = req.files as {
    //   [fieldname: string]: Express.Multer.File[]
    // }

    // const profilePic = files?.profilePic?.[0]
    // const degree = files?.degree?.[0]

    // console.log("profile===>", profilePic)
    // console.log("degree ==>", degree)
    if (!req.file) {
      return next(errorHandler(400, "file image are required"))
    }
    const doctor = await Doctors.findOne({ email: req.body.email })

    if (doctor) {
      return next(errorHandler(400, "doctor already exist"))
    }

    // const profilePicUrl = await uploadImage(profilePic)
    const degreeUrl = await uploadImage(req.file as Express.Multer.File)
    console.log("degree url===>", degreeUrl)
    const decriptedPass = bcryptjs.hashSync(req.body.password, 10)
    const newDoctor = await Doctors.create({
      ...req.body,
      password: decriptedPass,
      // profilePic: profilePicUrl,
      degree: degreeUrl,
    })
    return res
      .status(200)
      .json({ success: true, message: "Doctor register successful" })

    console.log("====>", newDoctor)
  } catch (error: any) {
    return next(error)
  }
}

const uploadImage = async (file: Express.Multer.File) => {
  try {
    const image = file
    const base64Image = Buffer.from(image.buffer).toString("base64")
    const dataURI = `data:${image.mimetype};base64,${base64Image}`
    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI)

    return uploadResponse.url
  } catch (error: any) {
    throw new Error("failed to upload image to cloudinary")
  }
}
export default {
  registerDoctor,
}
