import { body, validationResult } from "express-validator"
import { Request, Response, NextFunction } from "express"

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

export const validateDoctor = [
  body("doctors")
    .isArray({ min: 1 })
    .withMessage("Doctors must be an array with at least one doctor"),

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
