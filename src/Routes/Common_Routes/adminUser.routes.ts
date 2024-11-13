import express from "express"
import adminController from "../../controllers/Comman_Controller/admin.controller"

const router = express.Router()

router.post("/adminsign", adminController.adminSingin)
router.post("/varifyotp", adminController.varifyOTP)

export default router
