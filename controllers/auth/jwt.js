import jsonwebtoken from 'jsonwebtoken';

// Generate a new JWT token
export const generateToken = function(payload, secretKey, expiresIn) {
    return jsonwebtoken.sign(payload, secretKey, { expiresIn });
};

// Verify and decode JWT token
export const verifyToken = async function(token, secretKey) {
    try {
        return jsonwebtoken.verify(token, secretKey);
    } catch (error) {
        return error;
    }
};
