import { NextFunction, Request, Response } from "express"
import { User } from "../../model/common_Model/user.model"
import { AuthenticatedRequest } from "../../Types/types"
import { sendMail } from "../../utils/mailer"
import { errorHandler } from "../../utils/error.handler"
import cloudinary from "cloudinary"
import bcryptjs from "bcryptjs"

const logoutUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user?._id)
    // console.log("",req.user)

    res.clearCookie("token", { httpOnly: true, secure: true })
    if (user && user.admin) {
      user.admin.logedin = false
      await user?.save()
      sendMail(
        //   hosEmail?.email,
        "pbhoite985@gmail.com",
        //   adminUser.email,
        "bhoitep326@gmail.com",
        "Your Accout has been logouted",
        `Admin has been logouted ${new Date().toLocaleDateString()} At ${new Date().toLocaleTimeString()}`,
        "",
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS
      )
    }
    return res.status(200).json({ message: "Logout successful" })
  } catch (error) {
    console.log(`Error while logout user`)
    return next(error)
  }
}

const updateUserProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body)
    const { userId } = req.params
    if (!req.body) {
      return next(errorHandler(404, "All fields are required"))
    }

    const user = await User.findById(userId)
    if (!user) {
      return next(errorHandler(404, "User not found"))
    }

    console.log(req.file)
    if (!req.file) {
      return res.status(400).json({ message: "Profile pic file is required" })
    }

    const pictureUrl = await uploadImage(req.file as Express.Multer.File)

    if (req.body.password !== "") {
      req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          ...req.body,
          profilepic: pictureUrl || user.profilepic,
        },
      },
      { new: true }
    )

    console.log("updated User", updatedUser)
    if (!updatedUser) {
      return next(errorHandler(400, "failed to update user"))
    }

    const { password, ...rest } = updatedUser.toObject()
    console.log("rest ====>", rest)
    return res
      .status(200)
      .json({ success: true, message: "user successfuly updated", rest })
  } catch (error: any) {
    return next(error)
  }
}

const uploadImage = async (file: Express.Multer.File) => {
  const image = file
  const base64Image = Buffer.from(image.buffer).toString("base64")
  const dataURI = `data:${image.mimetype};base64,${base64Image}`
  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI)

  return uploadResponse.url
}

const deleteUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params

    if (!userId) {
      return next(errorHandler(404, "userId is Required"))
    }

    const existedUser = await User.findById(userId)

    if (!existedUser) {
      return next(errorHandler(404, "User not found"))
    }
    const deletedUser = await User.findByIdAndDelete(existedUser._id)

    res.clearCookie("token", { httpOnly: true, secure: true })
    return res
      .status(200)
      .json({ success: true, message: "User successfuly deleted" })
  } catch (error: any) {
    return next(error)
  }
}

export default {
  logoutUser,
  updateUserProfile,
  deleteUser,
}
