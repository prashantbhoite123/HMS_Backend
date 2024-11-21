import express from "express"
import PatientProfileController from "../../controllers/Patient/PatientProfile"

const router = express.Router()

router.post("/patientPro", PatientProfileController.patientProfile)

export default router
