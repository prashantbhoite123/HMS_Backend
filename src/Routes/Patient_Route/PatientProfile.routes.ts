import express from "express"
import PatientProfileController from "../../controllers/Patient/PatientProfile"
import { isAuthentication } from "../../middleware/Auth.middleware"

const router = express.Router()

router.post(
  "/patientPro",
  isAuthentication,
  PatientProfileController.patientProfile
)

router.get(
  "/getpatient",
  isAuthentication,
  PatientProfileController.getPatientProfile
)

router.put(
  "/update",
  isAuthentication,
  PatientProfileController.updatePatientProfile
)
router.get(
  "/getinfo/:patientId",
  isAuthentication,
  PatientProfileController.updatePatientProfile
)

export default router
