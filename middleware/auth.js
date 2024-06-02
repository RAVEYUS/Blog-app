const { validateToken } = require("../services/auth");

function checkforAuthcookie(cookieName){
    return (req, res, next) =>{
        const tokencookievalue = req.cookies[cookieName];

        if(!tokencookievalue)
        {
           return next();
        }
        
        try {
            const userPayload = validateToken(tokencookievalue);
            req.user = userPayload;
        } catch (error) {
            
        }
        return next();
    }
}

module.exports = {
    checkforAuthcookie,
}