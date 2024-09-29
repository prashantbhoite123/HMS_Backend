import { Request, Response } from "express"
import { Hospital } from "../model/hospital.user"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { errorHandler } from "../utils/error.handler"

const SECRETKEY = process.env.SECRETKEY
type Props = {
  hosname: string
  email: string
  password: string
  contact: number
  role: string
}
const hospitalAdminRegistration = async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const { hosname, email, password, contact, role }: Props = req.body

    if (!password || !hosname || !email || !contact || !role) {
      return res.status(400).json({ message: "Password is missing" })
    }
    const existingAdmin = await Hospital.findOne({ email })

    if (existingAdmin) {
      return res.status(404).json({ message: "Hos User already exist" })
    }

    const dicreptedPassword = bcryptjs.hashSync(password, 10)

    const newAdmin = await Hospital.create({
      hosname,
      email,
      password: dicreptedPassword,
      contact,
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

const hospitalAdminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const existHospital = await Hospital.findOne({ email })
    if (!existHospital) {
      return errorHandler(400, "Hospital does not exist Registar first")
    }

    const ismatchPassword = bcryptjs.compareSync(
      password,
      existHospital.password
    )

    if (!ismatchPassword) {
      return errorHandler(400, "Invalid email or password")
    }

    const { password: abc, ...rest } = existHospital.toObject()
    const token = jwt.sign({ _id: existHospital._id }, SECRETKEY as string)

    res
      .cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
      .status(200)
      .json({ message: "Hospital login successfully", rest })
  } catch (error) {
    console.log(`Error while login hospital :${error}`)
    res.status(500).json({ message: "something went wrong" })
  }
}

const continueWithGoogle = async (req: Request, res: Response) => {
  try {
    const { hosname, email, profilepic } = req.body

    const existHospital = await Hospital.findOne({ email })

    if (existHospital) {
      const token = jwt.sign(
        { _id: existHospital._id },
        process.env.SECRETKEY as string,
        {
          expiresIn: "1d",
        }
      )

      const { password, ...rest } = existHospital.toObject()

      res
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

    const newHospital = await Hospital.create({
      hosname,
      email,
      password: bcryptjsPassword,
      profilepic,
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
  hospitalAdminRegistration,
  hospitalAdminLogin,
  continueWithGoogle,
}
