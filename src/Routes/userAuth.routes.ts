import express from "express"
import userAuthController from "../controllers/userAuth.controller"

const router = express.Router()

router.get("/logout", userAuthController.logoutUser)

export default router
