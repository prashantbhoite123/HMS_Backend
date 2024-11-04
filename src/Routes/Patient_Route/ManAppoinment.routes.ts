import express from "express"
import ManageAppoinment from "../../controllers/Patient/ManageAppoinment"
import { isAuthentication } from "../../middleware/Auth.middleware"
const router = express.Router()

router.delete(
  "/delapp/:appId",
  isAuthentication,
  ManageAppoinment.deleteAppoinment
)

router.put(
  "/update/:updatedAppId",
  isAuthentication,
  ManageAppoinment.updateAppoinment
)

router.get(
  "/search",
  // isAuthentication,
  ManageAppoinment.searchAppoinment
)

export default router
