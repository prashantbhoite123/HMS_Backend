import express from "express"
import userAuthController from "../controllers/Comman_Controller/userAuth.controller"
import { isAuthentication } from "../middleware/Auth.middleware"

const router = express.Router()

router.get("/logout", isAuthentication, userAuthController.logoutUser)

export default router
