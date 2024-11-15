import express from "express"
import doctorController from "../../../controllers/Hospital/Doctor.controller"
const router = express.Router()

router.post("/register", doctorController.registerDoctor)

export default router
