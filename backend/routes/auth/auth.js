import express from 'express';
import * as auth from '../../controllers/auth/auth.js';
import * as apiResponse from '../../helper/apiResponse.js';
// import user from './user/user.js';
const router = express.Router();

// User Login
router.use('/login', 
    auth.getAuthUser,
    (request, response, next) => {
        if(!request.body.authUser) return apiResponse.notFoundResponse(response, "User not found!")
        return next();
    },
    auth.generateAuthToken,
    auth.login);

// User Registration
router.use('/register', 
    auth.getAuthUser,
    (request, response, next) => {
        if (request.body.authUser) return apiResponse.duplicateResponse(response, "User already exists!")
        return next();
    },
    auth.register,
    auth.generateAuthToken,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "Registration successful!", request.body.token)
    }
);

export default router;