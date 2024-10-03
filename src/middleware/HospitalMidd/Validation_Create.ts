import { NextFunction, Request, Response } from "express"
import { body, validationResult } from "express-validator"

const handleCreateHospitalError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() })
  }
  next()
}

export const validateCreateHospital = [
  body("hospitalName")
    .trim()
    .notEmpty()
    .withMessage("Hospital name must be a string"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("description must be a string"),

  body("phoneNumber")
    .trim()
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digits long")
    .isMobilePhone("en-IN")
    .withMessage("Please provide a valid Indian phone number"),
  body("address.city")
    .trim()
    .notEmpty()
    .withMessage("City is required")
    .isLength({ min: 2 })
    .withMessage("City must be at least 2 charactor long"),
  body("address.state")
    .trim()
    .notEmpty()
    .withMessage("State is required")
    .isLength({ min: 2 })
    .withMessage("State must be at least 2 charactor long"),
  body("address.country")
    .trim()
    .notEmpty()
    .withMessage("country is required")
    .isLength({ min: 2 })
    .withMessage("country must be at least 2 charactor long"),
  body("hospitalType")
    .trim()
    .notEmpty()
    .withMessage("hospital type must be a string"),
  body("establishedDate")
    .trim()
    .isDate({ format: "YYYY-MM-DD" }) // Validate format as YYYY-MM-DD
    .withMessage("Please provide a valid date in YYYY-MM-DD format")
    .custom((value) => {
      const currentDate = new Date()
      const inputDate = new Date(value)
      if (inputDate > currentDate) {
        throw new Error("Established date must be in the past")
      }
      return true
    }),
  body("totalBeds")
    .trim()
    .isInt({ min: 10 })
    .notEmpty()
    .withMessage("Total beds be a number and at least 10"),
  body("departments")
    .trim()
    .notEmpty()
    .isArray()
    .withMessage("departments must be a string"),
  body("services")
    .trim()
    .notEmpty()
    .isArray()
    .withMessage("services must be a string"),
  body("doctors.doctorName")
    .trim()
    .notEmpty()
    .withMessage("Doctorname must be string"),
  body("doctors.education")
    .trim()
    .notEmpty()
    .withMessage("education must be string"),

  body("doctors.experienceYears")
    .trim()
    .isNumeric()
    .notEmpty()
    .withMessage("experienceYears must be number"),
  body("doctors.specialization")
    .trim()
    .isString()
    .notEmpty()
    .withMessage("specialization must be string"),
  body("doctors.workingHours")
    .trim()
    .isString()
    .notEmpty()
    .withMessage("workingHours must be string"),
  body("picture")
    .isURL()
    .trim()
    .notEmpty()
    .withMessage("Picture must be valid url"),
  handleCreateHospitalError,
]
