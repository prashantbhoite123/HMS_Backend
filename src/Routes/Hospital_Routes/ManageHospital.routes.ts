import express from "express"
import ManageHospital from "../../controllers/Hospital/ManageHospital"
import { isAuthentication } from "../../middleware/Auth.middleware"
import { param } from "express-validator"
const router = express.Router()

router.get("/gethospitals", isAuthentication, ManageHospital.getallHospital)
router.get("/search/", isAuthentication, ManageHospital.searchHospital)

export default router
