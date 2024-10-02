import express, { Response, Request } from "express"
import "dotenv/config"
import mongoose from "mongoose"
import hospitalRoute from "./Routes/Myhospital.route"
import userRoute from "./Routes/userAuth.routes"

import cors from "cors"
import cookieParser from "cookie-parser"
import { errorMiddleware } from "./middleware/error.middleware"
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

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

app.get("/", (req: Request, res: Response) => {
  res.send("hello Prashant")
})

app.use("/api/hospital", hospitalRoute)
app.use("/api/auth", userRoute)

app.use(errorMiddleware)
app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`)
})
