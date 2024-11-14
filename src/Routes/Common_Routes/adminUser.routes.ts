import express from "express"
import adminController from "../../controllers/Comman_Controller/admin.controller"
import { isAuthentication } from "../../middleware/Auth.middleware"

const router = express.Router()

router.post("/adminsign", adminController.adminSingin)
router.post("/varifyotp", adminController.varifyOTP)
router.get("/alogout", isAuthentication, adminController.adminLogout)

export default router
