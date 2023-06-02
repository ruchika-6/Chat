import jwt from "jsonwebtoken";

export const verifyToken = (req,res,next) => {
    const token = req.cookies.access_token;
    if(!token)
        res.status(401).send("You are not authenticated");

    jwt.verify(token,"secret", (err, user)=>{
        if(err)
            res.status(403).send("Token is not valid"); 
        req.user = user;
        next();
    })
}