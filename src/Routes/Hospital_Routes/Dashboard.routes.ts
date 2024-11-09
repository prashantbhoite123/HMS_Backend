import Dashcontroller from "../../controllers/Hospital/Dashboard.controller"
import express from "express"
import { isAuthentication } from "../../middleware/Auth.middleware"

const router = express.Router()

router.get("/dashdata", isAuthentication, Dashcontroller.getAllDashData)

export default router
