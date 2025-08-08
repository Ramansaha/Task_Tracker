import { generateToken, verifyToken } from './jwt.js';
import dotenv from 'dotenv';
import * as apiResponse from '../../helper/apiResponse.js';
import User from '../../models/user/user.js';
import { create , getOne} from '../../helper/mongo.js';
dotenv.config()

// Authenticate valid user from token 
export const isAuth = (request, response, next) => {
    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return response.status(404).json({ message: "Unauthorized" })
    // request.body.token = token
    verifyToken(token, process.env.AUTHTOKEN_SECRETKEY).then(res => {
        if (!res.exp) throw {}
        if (request.method === 'GET') {
            request.token = token;
            request.auth = res;
        } else {
            request.body = request.body || {};
            request.body.token = token;
            request.body.auth = res;
        }
        return next()
    }).catch(err => {
        return response.status(401).json({ message: "Unauthorized" })
    })
}

// Generate auth token
export const generateAuthToken = async (request, response, next) => {
    try {
        const minutes = 100000
        const expirationTime = Math.floor(Date.now() / 1000) + minutes * 60
        const payload = { userId: request.body.authUser._id }
        const token = generateToken(payload, process.env.AUTHTOKEN_SECRETKEY, expirationTime)

        request.body.token = token
        return next()
    } catch (error) {
        return response.status(404).json({ message: error.message })
    }
}

// Login users
export const login = async (request, response) => {
    try {
        const { token , password, authUser} = request.body;
        if(!password) {
            return apiResponse.validationErrorWithData(response, "Password is required");
        }
        if (!token) {
            return apiResponse.unAuthorizedResponse(response,
                'Authentication token required');
        }
        if (password !== authUser.password) {
            return apiResponse.notFoundResponse(response, "Invalid password!");
        }
        return apiResponse.successResponseWithData(response, "Login Successful!", token);

    } catch (err) {
        console.error('Login Error:', err);
        return apiResponse.errorResponse(response,
            'Internal server error');
    }
}

// Register user
export const register = async (request, response, next) => {
    try {
        const { name, email, mobile, password } = request.body;
        if (!name || !email || !mobile || !password) {  
            return apiResponse.validationError(response, "All fields are required");
        }

        const res = await create(User, request.body);

        if (!res.status) {
            return apiResponse.notFoundResponse(response, "Unable to register user");
        }

        let authUser = {
            _id : res.data._id,
         }
        request.body.authUser = authUser
        return next();
    } catch (err) {
        console.error("Registration Error:", err);
        return apiResponse.errorResponse(response, "An error occurred while registering user.");
    }
}

// // Check if users exists
export const getAuthUser = async (request, response, next) => {
    try {
        let body = request.body
        if(!body?.mobile) return apiResponse.notFoundResponse(response, "Please provide a mobile number")
        const query = body.mobile ? { mobile: body.mobile } : body.email ? { email: body.email } : null
        const authUser = await getOne(User,query)
        if (!authUser.status) return next()
        request.body.authUser = authUser.data
        return next();
    } catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}