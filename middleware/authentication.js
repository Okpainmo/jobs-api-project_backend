// this error for general write-code method
// const CustomAPIError = require('../errors/custom-error');

// this method for using https-status-codes method
const { UnauthenticatedError } = require('../errors');

const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticationMiddleware = async (req, res, next) => {
  // validate JWT token
  const authHeaders = req.headers.authorization;

  if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
    // this error for general write-code method
    //   throw new CustomAPIError('Incorrect login token', 401);

    // this method for using https-status-codes method
    throw new UnauthenticatedError('Authentication rejected');
  }

  const token = authHeaders.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // const { id, username } = payload;
    console.log(payload);

    // attach the user to the job routes
    req.user = { userId: payload.userId, name: payload.name };

    /*  use the below syntax instead of setting req.user as done above - REMEBER TO IMPORT SCHEMA. Also do well to verify, 
    the code seems incorrect - play aroynd with it if you wish or if need be.
     const user = user.findById(payload.id).select('-password');
     req.user=user */

    // pass to next(middleware)
    next();
  } catch (error) {
    // this error for general write-code method
    // throw new CustomAPIError('Not authorized to access this route', 401);

    // this method for using https-status-codes method
    throw new UnauthenticatedError('Authentication rejected');
  }
};

module.exports = authenticationMiddleware;
