import express from "express"

import hospitalRegisterController from "../../controllers/Comman_Controller/user.controller"
import {
  validationHospitalLogin,
  validationHospitalRequest,
} from "../../middleware/CommonMidd/validation"
import { isAuthentication } from "../../middleware/Auth.middleware"


const router = express.Router()

router.post(
  "/signup",
  validationHospitalRequest,
  hospitalRegisterController.userRegistration
)

router.post(
  "/signin",
  validationHospitalLogin,
  hospitalRegisterController.userLogin
)

router.post("/google", hospitalRegisterController.continueWithGoogle)
router.get("/getUser", isAuthentication, hospitalRegisterController.getUser)
export default router
