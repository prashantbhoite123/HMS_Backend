import express from "express"
import hospitalRegisterController from "../controllers/hospital.controller"
import { validationHospitalRequest } from "../middleware/validation"

const router = express.Router()

router.post(
  "/signup",
  validationHospitalRequest,
  hospitalRegisterController.hospitalAdminRegistration
)

export default router
