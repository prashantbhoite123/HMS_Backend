import { body, validationResult } from "express-validator"
import { Request, Response, NextFunction } from "express"

// Middleware to handle validation errors
const handleValidationError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

export const parseDoctors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const doctorsString = req.body.doctors

  if (typeof doctorsString === "string") {
    try {
      req.body.doctors = JSON.parse(doctorsString)
    } catch (err) {
      return res.status(400).json({ error: "Invalid doctors array format" })
    }
  }

  if (!Array.isArray(req.body.doctors)) {
    return res.status(400).json({ error: "Doctors must be an array" })
  }

  next()
}

// Validation rules for doctors array within hospital
export const validateHospital = [
  body("hospitalName")
    .isString()
    .notEmpty()
    .withMessage("Hospital name is required and must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("picture").optional().isURL().withMessage("Picture must be a valid URL"),
  body("phoneNumber")
    .isString()
    .notEmpty()
    .withMessage("Phone number is required and must be a string"),
  body("address.city")
    .isString()
    .notEmpty()
    .withMessage("City is required and must be a string"),
  body("address.state")
    .isString()
    .notEmpty()
    .withMessage("State is required and must be a string"),
  body("address.country")
    .isString()
    .notEmpty()
    .withMessage("Country is required and must be a string"),
  body("hospitalType")
    .isString()
    .notEmpty()
    .withMessage("Hospital type is required and must be a string"),
  body("establishedDate")
    .optional()
    .isDate()
    .withMessage("Established date must be a valid date"),
  body("totalBeds")
    .isInt({ min: 1 })
    .withMessage("Total beds must be a positive integer"),
  body("departments")
    .optional()
    .isArray()
    .withMessage("Departments must be an array"),
  body("services")
    .optional()
    .isArray()
    .withMessage("Services must be an array"),

  // Validate that doctors is an array
  body("doctors")
    .isArray({ min: 1 })
    .withMessage("Doctors must be an array with at least one doctor"),

  // Validate each doctor object in the doctors array
  body("doctors.*.doctorName")
    .isString()
    .notEmpty()
    .withMessage("Doctor name is required and must be a string"),
  body("doctors.*.education")
    .isString()
    .notEmpty()
    .withMessage("Doctor education is required and must be a string"),
  body("doctors.*.experienceYears")
    .isInt({ min: 0 })
    .withMessage("Doctor experience years must be a non-negative integer"),
  body("doctors.*.specialization")
    .isString()
    .notEmpty()
    .withMessage("Doctor specialization is required and must be a string"),
  body("doctors.*.workingHours")
    .isString()
    .notEmpty()
    .withMessage("Working hours are required and must be a string"),

  handleValidationError,
]
