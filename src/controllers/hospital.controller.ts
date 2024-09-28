import { Request, Response } from "express"
import { Hospital } from "../model/hospital.user"
import bcryptjs from "bcryptjs"
import { watch } from "fs"

type Props = {
  hosname: string
  email: string
  password: string
  contact: number
}
const hospitalAdminRegistration = async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const { hosname, email, password, contact }: Props = req.body

    if (!password || !hosname || !email || !contact) {
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
    })

    res
      .status(200)
      .json({ success: true, message: "Registration SuccessFully" })
  } catch (error) {
    console.log(`Error while createHospital api : ${error}`)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

export default {
  hospitalAdminRegistration,
}
