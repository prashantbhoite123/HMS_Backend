import express from "express"
import { isAuthentication } from "../../middleware/Auth.middleware"
import adminRequestedhospital from "../../controllers/Admin/approvelHospital.controller"

const router = express.Router()

router.get(
  "/aprovelhos",
  isAuthentication,
  adminRequestedhospital.approvelHospitals
)
router.put(
  "/rejected/:hospitalId",
  isAuthentication,
  adminRequestedhospital.rejectHospitalApi
)

export default router
