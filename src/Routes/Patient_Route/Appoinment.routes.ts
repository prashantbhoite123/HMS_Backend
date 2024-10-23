import express from "express"
import { isAuthentication } from "../../middleware/Auth.middleware"

import PatientAppoinment from "../../controllers/Patient/PatientAppoinment"
const router = express.Router()

router.post(
  "/appoinment",
  isAuthentication,
  PatientAppoinment.patientAppoinment
)

export default router
