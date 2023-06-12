import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';

function isTokenExpired(token, secret) {
  try {
    const decoded = jwt.verify(token, secret);
    const currentTimestamp = Math.floor(Date.now() / 1000); // Get the current time in seconds

    if (decoded.exp < currentTimestamp) {
      // Token has expired
      return true;
    }

    // Token is valid and not expired
    return false;
  } catch (error) {
    // Token verification failed
    return true;
  }
}

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.get('Authorization') &&
    req.get('Authorization').startsWith('Bearer')
  ) {
    try {
      token = req.get('Authorization').split(' ')[1];
      const secret = process.env.JWT_SECRET;
      if (isTokenExpired(token, secret)) {
        console.log('Token has expired');
        // Perform actions for an expired token
      } else {
        console.log('Token is valid and not expired');
        // Perform actions for a valid token
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});
