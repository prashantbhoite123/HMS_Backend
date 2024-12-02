import express from "express"
import userAuthController from "../../controllers/Comman_Controller/userAuth.controller"
import { isAuthentication } from "../../middleware/Auth.middleware"
import { sendDynamicEmail } from "../../controllers/Comman_Controller/mailer.controller"
import multer from "multer"

const router = express.Router()

const storage = multer.memoryStorage()

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5mb
  },
})

router.get("/logout", isAuthentication, userAuthController.logoutUser)
router.post("/send-email", isAuthentication, sendDynamicEmail)
router.put(
  "/updateprofile/:userId",
  upload.single("profilepic"),
  isAuthentication,
  userAuthController.updateUserProfile
)

export default router
