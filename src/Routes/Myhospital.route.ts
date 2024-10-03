import express from "express"
import { isAuthentication } from "../middleware/Auth.middleware"
import hospitalRegisterController from "../controllers/Comman_Controller/user.controller"
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
