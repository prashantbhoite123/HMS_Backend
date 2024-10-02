import { NextFunction, Request, Response } from "express"

const logoutUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("token", { httpOnly: true, secure: true })

    res.status(200).json({ message: "Logout successful" })
  } catch (error) {
    console.log(`Error while logout user`)
    return next(error)
  }
}

export default {
  logoutUser,
}
