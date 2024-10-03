import express from "express"
import CreateHospital from "../../controllers/Hospital/CreateHospital.controller"

const router = express.Router()

router.post("/createhospital", CreateHospital.createHospital)

export default router
