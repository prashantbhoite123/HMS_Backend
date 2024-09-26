import { Request, Response } from "express"
import { Hospital } from "../model/hospital.user"
import bcryptjs from "bcryptjs"

type Props = {
  hosname: string
  email: string
  password: string
}
const hospitalAdminRegistration = async (req: Request, res: Response) => {
  try {
    const { hosname, email, password }: Props = req.body
    const existingAdmin = await Hospital.findOne({ email })
    if (existingAdmin) {
      return res.status(404).json({ message: "Hos User already exist" })
    }

    const dicreptedPassword = bcryptjs.hashSync(password, 10)

    const newAdmin = await Hospital.create({
      hosname,
      email,
      password: dicreptedPassword,
    })

    res
      .status(200)
      .json({ success: true, message: "Registration SuccessFully", newAdmin })
  } catch (error) {
    console.log(`Error while createHospital api : ${error}`)
    return res.status(500).json({ message: "Something went wrong" })
  }
}
