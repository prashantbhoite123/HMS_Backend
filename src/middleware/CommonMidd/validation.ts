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
  body("username")
    .isString()
    .notEmpty()
    .withMessage("username name must be a string"),

  body("email").isString().notEmpty().withMessage("email must be a string"),

  body("password")
    .isString()
    .notEmpty()
    .withMessage("password  must be a string"),

  handelValidationError,
]

export const validationHospitalLogin = [
  body("email").isString().notEmpty().withMessage("email must be a string"),

  body("password")
    .isString()
    .notEmpty()
    .withMessage("password  must be a string"),

  handelValidationError,
]
