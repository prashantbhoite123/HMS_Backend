import { body, validationResult } from "express-validator"
import { Request, Response, NextFunction } from "express"

const handelValidationError = (
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

export const validationHospitalRequest = [
  body("hosname")
    .isString()
    .notEmpty()
    .withMessage("hospital name must be a string"),

  body("email").isString().notEmpty().withMessage("email must be a string"),

  body("password")
    .isString()
    .notEmpty()
    .withMessage("password  must be a string"),
  body("contact")
    .isString()
    .notEmpty()
    .withMessage("Contact must be provided")
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage("Contact must be a valid phone number"),

  body("logo")
    .isString()
    .notEmpty()
    .withMessage("Logo must be provided")
    .isURL()
    .withMessage("Logo must be a valid URL"),
  handelValidationError,
]
