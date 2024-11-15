import { NextFunction, Request, Response } from "express"
import { User } from "../../model/common_Model/user.model"
import { AuthenticatedRequest } from "../../Types/types"
import { sendMail } from "../../utils/mailer"

const logoutUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user?._id)
    res.clearCookie("token", { httpOnly: true, secure: true })
    if (user && user.admin) {
      user.admin.logedin = false
      await user?.save()
    }
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
    return res.status(200).json({ message: "Logout successful" })
  } catch (error) {
    console.log(`Error while logout user`)
    return next(error)
  }
}

export default {
  logoutUser,
}
