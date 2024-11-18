import express from "express"
import adminController from "../../controllers/Admin/admin.controller"
import { isAuthentication } from "../../middleware/Auth.middleware"

const router = express.Router()

router.post("/adminsign", adminController.adminSingin)
router.post("/varifyotp", adminController.varifyOTP)
router.post("/resendotp", adminController.resendOtp)

export default router
