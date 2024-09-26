import express, { Response, Request } from "express"
import "dotenv/config"
import mongoose from "mongoose"
import hospitalRoute from "./Routes/Myhospital.route"

import cors from "cors"
const app = express()

app.use(express.json())
app.use(cors())

mongoose
  .connect(process.env.MONGODB_URL as string, {
    dbName: "HMS",
  })
  .then(() => console.log("Database connected successfully"))
  .catch((e) => console.log(`Error while database connection :${e}`))

app.get("/", (req: Request, res: Response) => {
  res.send("hello Prashant")
})

app.use("/api/hospital/", hospitalRoute)

app.listen(process.env.PORT, () => {
  console.log(`express is working on http://localhost:${process.env.PORT}`)
})
