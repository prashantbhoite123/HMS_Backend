import express from "express"
import doctorController from "../../../controllers/Hospital/Doctor.controller"
import multer from "multer"
import { isAuthentication } from "../../../middleware/Auth.middleware"
const router = express.Router()

const storage = multer.memoryStorage()

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5mb
  },
})

router.post(
  "/register/:hospitalId",
  upload.single("degree"),
  isAuthentication,
  doctorController.registerDoctor
)

router.post("/login", doctorController.registerDoctor)

export default router
