const JWT = require('jsonwebtoken');
const secret = "secret123";

function createtokenforUser(user)
{
    const payload = {
        _id: user._id,
        email: user.email,
        profileimgUrl: user.profileImageUrl,
        role: user.role,
    };
    const token = JWT.sign(payload, secret);
    return token;
}

function validateToken(token){

    const payload = JWT.verify(token, secret)
    return payload;
}

module.exports = {
    createtokenforUser,
    validateToken,
};