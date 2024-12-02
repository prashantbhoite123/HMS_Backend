import { NextFunction, Request, Response } from "express"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { User } from "../../model/common_Model/user.model"
import { errorHandler } from "../../utils/error.handler"
import { AuthenticatedRequest } from "../../Types/types"
import { Patient } from "../../model/Patient/PatientProfile.model"

const SECRETKEY = process.env.SECRETKEY
type Props = {
  username: string
  email: string
  password: string
  role: string
}

const getUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.user?._id
    console.log(req.user)
    const existuser = await User.findById(_id)

    if (!existuser) {
      return next(errorHandler(400, "User does no exist"))
    }

    const { password, ...rest } = existuser.toObject()
    res.status(200).json({ success: true, rest })
  } catch (error: any) {
    next(error.message)
    console.log(`Error while getUser :${error}`)
  }
}

const userRegistration = async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const { username, email, password, role }: Props = req.body

    if (!password || !username || !email || !role) {
      return res.status(400).json({ message: "All field are required" })
    }
    const existingAdmin = await User.findOne({ email })

    if (existingAdmin) {
      return res.status(404).json({ message: "Hos User already exist" })
    }

    const dicreptedPassword = bcryptjs.hashSync(password, 10)

    const newAdmin = await User.create({
      username,
      email,
      password: dicreptedPassword,
      role,
    })
    res
      .status(200)
      .json({ success: true, message: "Registration SuccessFully" })
  } catch (error) {
    console.log(`Error while createHospital api : ${error}`)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

const userLogin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body)
    const { email, password } = req.body
    if (!email || !password || email === "" || password === "") {
      next(errorHandler(400, "All field are required"))
    }
    const existedUser = await User.findOne({ email })

    console.log(existedUser)
    if (!existedUser) {
      return errorHandler(400, "User not found")
    }

    const ismatchPassword = bcryptjs.compareSync(password, existedUser.password)
    console.log(ismatchPassword, password)

    if (!ismatchPassword) {
      return errorHandler(400, "Invalid email or password")
    }

    const { password: abc, ...rest } = existedUser.toObject()
    const token = jwt.sign({ _id: existedUser._id }, SECRETKEY as string)

    const decode = jwt.verify(
      token,
      process.env.SECRETKEY as string
    ) as jwt.JwtPayload

    console.log(decode?._id)

    const existedpatientProfile = await Patient.findOne({
      userId: decode?._id,
    })

    let patientproStatus = false
    if (existedUser.role === "patient" && !existedpatientProfile) {
      patientproStatus = true
    }

    res
      .cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
      .status(200)
      .json({ patientproStatus, rest })
  } catch (error) {
    console.log(`Error while login hospital :${error}`)
    res.status(500).json({ message: "something went wrong" })
  }
}

const continueWithGoogle = async (req: Request, res: Response) => {
  try {
    const { username, email, role, profilepic } = req.body

    const existHospital = await User.findOne({ email })

    if (existHospital) {
      const token = jwt.sign(
        { _id: existHospital._id },
        process.env.SECRETKEY as string,
        {
          expiresIn: "1d",
        }
      )

      const { password, ...rest } = existHospital.toObject()

      return res
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json(rest)
    }

    const newPassword = Math.floor(
      Math.random() * 8000000000 + 8000000000
    ).toString()

    const bcryptjsPassword = bcryptjs.hashSync(newPassword, 10)

    const newHospital = await User.create({
      username,
      email,
      password: bcryptjsPassword,
      profilepic,
      role,
    })

    if (!newHospital) {
      return errorHandler(400, "hospital not found")
    }
    const token = jwt.sign(
      { _id: newHospital._id },
      process.env.SECRETKEY as string,
      {
        expiresIn: "1d",
      }
    )

    const { password: abc, ...rest } = newHospital.toObject()

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json(rest)
  } catch (error) {
    console.log(`Error while continiue with google api :${error}`)
    return errorHandler(400, "Error while continueWithGoogle")
  }
}

export default {
  userRegistration,
  userLogin,
  continueWithGoogle,
  getUser,
}
