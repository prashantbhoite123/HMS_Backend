import express from "express"
import PatientProfileController from "../../controllers/Patient/PatientProfile"
import { isAuthentication } from "../../middleware/Auth.middleware"

const router = express.Router()

router.post(
  "/patientPro",
  isAuthentication,
  PatientProfileController.patientProfile
)

export default router
