import { Request, Response } from "express"
import { Hosadmin } from "../model/hospital.user"
import bcryptjs from "bcryptjs"

type Props = {
  username: string
  email: string
  password: string
}
const hospitalAdminRegistration = async (req: Request, res: Response) => {
  try {
    const { username, email, password }: Props = req.body
    const existingAdmin = await Hosadmin.findOne({ email })
    if (existingAdmin) {
      return res.status(404).json({ message: "Hos User already exist" })
    }

    const dicreptedPassword = bcryptjs.hashSync(password, 10)

    const newAdmin = await Hosadmin.create({
      username,
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
