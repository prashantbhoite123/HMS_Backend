import Dashcontroller from "../../controllers/Dashboard/Dashboard.controller"
import express from "express"
import { isAuthentication } from "../../middleware/Auth.middleware"
import ManageDashboard from "../../controllers/Dashboard/ManageDashboard.controller"
const router = express.Router()

router.get("/dashdata", isAuthentication, Dashcontroller.getAllDashData)
router.put("/cancel/:appId", isAuthentication, ManageDashboard.cancelAppoinment)

export default router
