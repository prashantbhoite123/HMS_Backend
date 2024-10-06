import express from "express"
import CreateHospital from "../../controllers/Hospital/CreateHospital.controller"
import { isAuthentication } from "../../middleware/Auth.middleware"

const router = express.Router()

router.post("/createhospital", isAuthentication, CreateHospital.createHospital)

export default router
