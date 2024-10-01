import express from "express"
import hospitalRegisterController from "../controllers/hospital.controller"
import { isAuthentication } from "../middleware/Auth.middleware"
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

router.post("/google", hospitalRegisterController.continueWithGoogle)
router.get("/getUser", isAuthentication, hospitalRegisterController.getUser)
export default router
