import express, { Response, Request } from "express"
import "dotenv/config"
import mongoose from "mongoose"

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

app.listen(process.env.PORT, () => {
  console.log(`server is working on http://localhost:${process.env.PORT}`)
})
