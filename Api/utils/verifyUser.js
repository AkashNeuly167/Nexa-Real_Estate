
import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken  = (req, res, next) => {
    const authHeader = req.headers.authorization;
    let token;
    if(authHeader && authHeader.startsWith("Bearer ")){
        token = authHeader.split(" ")[1];
    }else if(req.cookies.access_token){
        token = req.cookies.access_token;
    }

    if (!token) 
        return next(errorHandler(401, "You are not authenticated!"));

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return next(errorHandler(403, "Token is not valid!"));
            }
            req.user = user;
            next();
            
        });
}