import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../../Types/types"
import { errorHandler } from "../../utils/error.handler"
import { User } from "../../model/common_Model/user.model"
import { sendMail } from "../../utils/mailer"

const adminSingin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { key, email, password } = req.body
    if (key !== process.env.ADMIN_KEY) {
      return next(errorHandler(404, "invalid admin key"))
    }
    if (!key || !email || !password) {
      return next(errorHandler(404, "All field are required"))
    }

    const adminUser = await User.findOne({ email })
    if (!adminUser) {
      return next(errorHandler(404, "admin not found"))
    }

    if (adminUser.admin.key !== key) {
      return next(errorHandler(404, "invalid admin key"))
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

    sendMail(
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

    if (!email || !otp || email === "" || otp === "") {
      return next(errorHandler(404, "Email or otp are required"))
    }

    const adminUser = await User.findOne({ email })
    if (!adminUser) {
      return next(errorHandler(404, "Admin not found"))
    }

    if (
      adminUser.admin.otp !== otp ||
      (adminUser.admin.otpExpiry && Date.now() > adminUser.admin.otpExpiry)
    ) {
      return next(errorHandler(403, "Invlaid or expired OTP"))
    }

    adminUser.admin.otp = undefined
    adminUser.admin.otpExpiry = undefined
    await adminUser.save()

    return res
      .status(200)
      .json({ message: "OTP verified, admin signed in successfully" })
  } catch (error: any) {
    return next(error)
  }
}

export default {
  adminSingin,
  varifyOTP,
}
