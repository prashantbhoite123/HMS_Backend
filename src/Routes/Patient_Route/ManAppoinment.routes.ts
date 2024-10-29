import express from "express"
import ManageAppoinment from "../../controllers/Patient/ManageAppoinment"
import { isAuthentication } from "../../middleware/Auth.middleware"
const router = express.Router()

router.delete(
  "/delapp/:patientId",
  isAuthentication,
  ManageAppoinment.deleteAppoinment
)

export default router
