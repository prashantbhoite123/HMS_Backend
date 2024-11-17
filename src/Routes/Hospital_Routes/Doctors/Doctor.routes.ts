import express from "express"
import doctorController from "../../../controllers/Hospital/Doctor.controller"
import multer from "multer"
const router = express.Router()

const storage = multer.memoryStorage()

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5mb
  },
})

router.post(
  "/register",
  upload.single("degree"),
  doctorController.registerDoctor
)

export default router

// upload.fields([
//   { name: "profilePic", maxCount: 1 },
//   { name: "degree", maxCount: 1 },
// ]),
