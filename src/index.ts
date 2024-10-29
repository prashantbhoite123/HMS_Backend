import express, { Response, Request } from "express"
import "dotenv/config"
import mongoose from "mongoose"
import hospitalRoute from "./Routes/Common_Routes/Myhospital.route"
import userRoute from "./Routes/Common_Routes/userAuth.routes"
import hospitalcreate from "./Routes/Hospital_Routes/Hospital.routes"
import manageHospitalRoute from "./Routes/Hospital_Routes/ManageHospital.routes"
import appoinmentRoute from "./Routes/Patient_Route/Appoinment.routes"
import manAppoinmentRoute from "./Routes/Patient_Route/ManAppoinment.routes"
import { v2 as cloudinary } from "cloudinary"
import cors from "cors"
import cookieParser from "cookie-parser"
import { errorMiddleware } from "./middleware/error.middleware"
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true, // Allow credentials to be sent
  })
)
mongoose
  .connect(process.env.MONGODB_URL as string, {
    dbName: "HMS",
  })
  .then(() => console.log("Database connected successfully"))
  .catch((e) => console.log(`Error while database connection :${e}`))

console.log(process.env.MONGODB_URL)

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

app.get("/", (req: Request, res: Response) => {
  res.send("hello Prashant")
})

// Common Routes//
app.use("/api/hospital", hospitalRoute)
app.use("/api/auth", userRoute)

// Hospital Route//
app.use("/api/my/hospital", hospitalcreate)
app.use("/api/manage", manageHospitalRoute)
app.use("/api/appoinment", appoinmentRoute)
app.use("/api/manappoinemt", manAppoinmentRoute)

app.use(errorMiddleware)
app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`)
})
