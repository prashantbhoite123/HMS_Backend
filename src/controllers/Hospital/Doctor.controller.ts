import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../../Types/types"
import { errorHandler } from "../../utils/error.handler"
import { Doctors } from "../../model/Hospital/doctors"
import bcryptjs from "bcryptjs"
import cloudinary from "cloudinary"
import jwt from "jsonwebtoken"

const SECRETKEY = process.env.SECRETKEY
const registerDoctor = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { hospitalId } = req.params

    if (!hospitalId) {
      return next(errorHandler(404, "Hospital Id required"))
    }

    if (!req.body) {
      return next(errorHandler(404, "all fields are required"))
    }

    if (!req.file) {
      return next(errorHandler(400, "file image are required"))
    }
    const doctor = await Doctors.findOne({ email: req.body.email })

    if (doctor) {
      return next(errorHandler(400, "doctor already exist"))
    }

    const profilePic = await uploadBsase64(req.body.profilePic)

    if (!profilePic) {
      return next(errorHandler(400, "Profile Url not found"))
    }

    console.log("this is profile pic Url", profilePic)

    // const profilePicUrl = await uploadImage(profilePic)
    const degreeUrl = await uploadImage(req.file as Express.Multer.File)
    console.log("degree url===>", degreeUrl)
    const decriptedPass = bcryptjs.hashSync(req.body.password, 10)
    const newDoctor = await Doctors.create({
      ...req.body,
      password: decriptedPass,
      ownerId: req.user?._id,
      profilePic: profilePic,
      degree: degreeUrl,
      hospitalId: hospitalId,
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
const uploadBsase64 = async (url: string) => {
  try {
    const image = url
    // const base64Image = Buffer.from(image.buffer).toString("base64")
    // const dataURI = `data:${image.mimetype};base64,${base64Image}`
    const uploadResponse = await cloudinary.v2.uploader.upload(image)

    return uploadResponse.url
  } catch (error: any) {
    throw new Error("failed to upload image to cloudinary")
  }
}

const doctorLogin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body
    console.log(req.body)
    if (!email || !password || email === "" || password === "") {
      next(errorHandler(400, "All field are required"))
    }
    const existDoctor = await Doctors.findOne({ email })
    if (!existDoctor) {
      return errorHandler(400, "Doctor not found")
    }

    const ismatchPassword = bcryptjs.compareSync(password, existDoctor.password)

    if (!ismatchPassword) {
      return errorHandler(400, "Invalid email or password")
    }

    const { password: abc, ...rest } = existDoctor.toObject()
    const token = jwt.sign({ _id: existDoctor._id }, SECRETKEY as string)

    res
      .cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
      .status(200)
      .json(rest)
  } catch (error) {
    console.log(`Error while login Doctor :${error}`)
    res.status(500).json({ message: "something went wrong" })
  }
}
export default {
  doctorLogin,
  registerDoctor,
}