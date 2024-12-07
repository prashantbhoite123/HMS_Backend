import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../../Types/types"
import { errorHandler } from "../../utils/error.handler"
import { User } from "../../model/common_Model/user.model"
import { sendMail } from "../../utils/mailer"
import jwt from "jsonwebtoken"
import { error } from "console"

const adminSingin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { Akey, email, password } = req.body
    console.log(req.body)

    if (parseInt(Akey) !== 9021) {
      return next(errorHandler(404, "invalid admin key"))
    }
    if (!Akey || !email || !password) {
      return next(errorHandler(404, "All field are required"))
    }

    const adminUser = await User.findOne({ email })
    console.log(adminUser)
    if (!adminUser) {
      return next(errorHandler(404, "admin not found"))
    }

    if (parseInt(Akey) !== adminUser.admin.Akey) {
      return next(errorHandler(404, "invalid admin user key"))
    }
    function generateOTP() {
      const otp = Math.floor(1000 + Math.random() * 9000)
      return otp
    }
    const otp = generateOTP()
    const otpExpiry = Date.now() + 10 * 60 * 1000

    adminUser.admin.otp = otp
    adminUser.admin.otpExpiry = otpExpiry
    await adminUser.save()

    await sendMail(
      //   hosEmail?.email,
      "pbhoite985@gmail.com",
      //   adminUser.email,
      "bhoitep326@gmail.com",
      "Your OTP for 2-Step Verification",
      `Your OTP is ${otp}. It is valid for 10 minutes.`,
      "",
      process.env.EMAIL_USER,
      process.env.EMAIL_PASS
    )
    console.log(otpExpiry)
    return res
      .status(200)
      .json({ otpExpiry, success: true, message: "OTP send your email" })
  } catch (error: any) {
    return next(error)
  }
}

const varifyOTP = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body
    console.log(email)
    console.log(otp)

    if (!email || !otp || email === "" || otp === "") {
      return next(errorHandler(404, "Email or otp are required"))
    }

    const adminUser = await User.findOne({ email })
    if (!adminUser) {
      return next(errorHandler(404, "Admin not found"))
    }
    console.log(adminUser.admin.otp)
    if (
      adminUser.admin.otp !== otp ||
      (adminUser.admin.otpExpiry && Date.now() > adminUser.admin.otpExpiry)
    ) {
      return next(errorHandler(403, "Invlaid or expired OTP"))
    }

    const token = jwt.sign(
      { _id: adminUser._id },
      process.env.SECRETKEY as string
    )

    adminUser.admin.otp = undefined
    adminUser.admin.otpExpiry = undefined
    adminUser.admin.logedin = true
    await adminUser.save()

    const { password, ...rest } = adminUser.toObject()

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        // secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "OTP verified, admin signed in successfully",
        rest,
      })
  } catch (error: any) {
    return next(error)
  }
}

const resendOtp = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body

    if (!email) {
      return next(errorHandler(400, "Email is required"))
    }

    const adminUser = await User.findOne({ email })
    if (!adminUser) {
      return next(errorHandler(404, "Admin not found"))
    }

    if (adminUser.admin.otpExpiry && Date.now() < adminUser.admin.otpExpiry) {
      return next(
        errorHandler(
          403,
          "Current OTP is still valid. Please wait until it expires to request a new one."
        )
      )
    }

    const generateOTP = () => {
      const otp = Math.floor(1000 + Math.random() * 9000)
      return otp
    }

    const otp = generateOTP()
    const otpExpiry = Date.now() + 10 * 60 * 1000

    adminUser.admin.otp = otp
    adminUser.admin.otpExpiry = otpExpiry
    await adminUser.save()

    await sendMail(
      //   hosEmail?.email,
      "pbhoite985@gmail.com",
      //   adminUser.email,
      "bhoitep326@gmail.com",
      "Your New OTP for 2-Step Verification",
      `Your new OTP is ${otp}. It is valid for 10 minutes.`,
      "",
      process.env.EMAIL_USER,
      process.env.EMAIL_PASS
    )

    return res
      .status(200)
      .json({ otpExpiry, message: "New OTP has been sent to your email." })
  } catch (error: any) {
    return next(error)
  }
}

export default {
  adminSingin,
  varifyOTP,
  resendOtp,
}
