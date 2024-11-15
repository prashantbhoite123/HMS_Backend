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


  handleValidationError,
]
