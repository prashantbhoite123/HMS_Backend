import express from "express"
import hospitalRegisterController from "../controllers/hospital.controller"
import {
  validationHospitalLogin,
  validationHospitalRequest,
} from "../middleware/validation"

const router = express.Router()

router.post(
  "/signup",
  validationHospitalRequest,
  hospitalRegisterController.hospitalAdminRegistration
)

router.post(
  "/signin",
  validationHospitalLogin,
  hospitalRegisterController.hospitalAdminLogin
)
export default router
