import express from "express"
import userController from "../controllers/user.controller"
import { validationHospitalRequest } from "../middleware/validation"

const router = express.Router()

router.post(
  "/sign/up",
  validationHospitalRequest,
  userController.userRegistgration
)

export default router
