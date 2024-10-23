import express from "express"
import userAuthController from "../../controllers/Comman_Controller/userAuth.controller"
import { isAuthentication } from "../../middleware/Auth.middleware"
import { sendDynamicEmail } from "../../controllers/Comman_Controller/mailer.controller"

const router = express.Router()

router.get("/logout", isAuthentication, userAuthController.logoutUser)
router.post("/send-email", sendDynamicEmail)

export default router
