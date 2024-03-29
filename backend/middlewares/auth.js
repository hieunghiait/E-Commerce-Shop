import catchAsyncErrors from './catchAsyncErrors.js'
import ErrorHandler from '../utils/errorHandler.js'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'

// Checks if user is authenticated or not
export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  //Get token from cookies
  const { token } = req.cookies
  //Check if token is not available
  if (!token) {
    return next(new ErrorHandler('Login first to access this resource', 401))
  }
  //Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  req.user = await User.findById(decoded.id)
  //Call next middleware
  next()
})

// Authorize user roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    //Check if user role is not included in roles
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource`,
          403
        )
      )
    }
    next()
  }
}
