import { validationResult } from 'express-validator'
import { ApiError } from '../utils/ApiError.js'

// Runs after express-validator chains; aggregates and returns field errors.
export const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const details = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
      value: e.value,
    }))
    return next(new ApiError(400, 'Validation failed', details))
  }
  return next()
}