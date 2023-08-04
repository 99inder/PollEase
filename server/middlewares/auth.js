// IMPORTS
const jwt = require("jsonwebtoken");

// auth
exports.auth = async (req, res, next) => {

    try {
        //extract token
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

        //if token missing, return response
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing."
            });
        }

        //verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid."
            })
        }

        next();

    } catch (error) {
        console.log("Error Occured While Authenticating the token.");
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while validating token."
        })
    }
}