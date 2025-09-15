import jwt from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
    const {token} = req.cookies;
    if(!token) {
        console.log("token not found");
        return res.status(401).json({message: "Unauthorized"});
    }
    try { 
        const decodedtoken = jwt.verify(token, process.env.JWT_SECRET);
        if(decodedtoken.id){
            
            req.user = { id: decodedtoken.id };
            console.log(req.user);
        }
        else{
            console.log("token id not found");
            return res.status(401).json({message: "Unauthorized"});
        }
        next();
    } catch (error) {
        console.log(jwt.verify(req.cookies.token, process.env.JWT_SECRET));
        console.log("JWT verification error:", error.message);
        return res.status(401).json({message: "Unauthorized"});
    }
}