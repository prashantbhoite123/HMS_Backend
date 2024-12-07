import express, { Response, Request } from "express"
import "dotenv/config"
import mongoose from "mongoose"
import hospitalRoute from "./Routes/Common_Routes/Myhospital.route"
import userRoute from "./Routes/Common_Routes/userAuth.routes"
import hospitalcreate from "./Routes/Hospital_Routes/Hospital.routes"
import manageHospitalRoute from "./Routes/Hospital_Routes/ManageHospital.routes"
import appoinmentRoute from "./Routes/Patient_Route/Appoinment.routes"
import manAppoinmentRoute from "./Routes/Patient_Route/ManAppoinment.routes"
import dashboardRoute from "./Routes/Dashboard/Dashboard.routes"
import doctorsRoute from "./Routes/Hospital_Routes/Doctors/Doctor.routes"
import adminRoute from "./Routes/Admin_Routes/adminUser.routes"
import adminApprovelRoutes from "./Routes/Admin_Routes/adminApprovel.routes"
import PatientProfileRoutes from "./Routes/Patient_Route/PatientProfile.routes"
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
    origin: "https://hms-frontend-2f89.onrender.com",
    // origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
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

app.get("/health", async (req: Request, res: Response) => {
  res.send({
    message: "health ok",
  })
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

// patient or appoinemt Route
app.use("/api/appoinment", appoinmentRoute)
app.use("/api/manappoinemt", manAppoinmentRoute)
app.use("/api/patient", PatientProfileRoutes)
// Doctors route
app.use("/api/doctor", doctorsRoute)
// Dashboard route
app.use("/api/dash", dashboardRoute)
// Admin route
app.use("/api/admin", adminRoute)
app.use("/api/approvel", adminApprovelRoutes)

// middleware
app.use(errorMiddleware)

// sarver
app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`)
})
