import express from "express"
import CreateHospital from "../../controllers/Hospital/CreateHospital.controller"
import { isAuthentication } from "../../middleware/Auth.middleware"
import multer from "multer"
import {
  parseDoctors,
  validateHospital,
} from "../../middleware/HospitalMidd/Validation_Create"

const router = express.Router()

const storage = multer.memoryStorage()

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5mb
  },
})

router.post(
  "/createhospital/:ownerId",
  upload.single("picture"),
  isAuthentication,
  parseDoctors,
  validateHospital,
  CreateHospital.createHospital
)
router.put(
  "/updatehospital",
  upload.single("picture"),
  isAuthentication,
  parseDoctors,
  validateHospital,
  CreateHospital.updateHospital
)


export default router
