import express from "express"
import ManageHospital from "../../controllers/Hospital/ManageHospital"
import { isAuthentication } from "../../middleware/Auth.middleware"
import { param } from "express-validator"
const router = express.Router()

router.get("/gethospitals", isAuthentication, ManageHospital.getallHospital)
router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("city parameter must be a valid string"),
  ManageHospital.searchHospital
)

export default router
