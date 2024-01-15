const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
const User = require('../models/User');
const authenticate = async (req,resp,next)=>{
    try{
        const token = req.cookies.userCookie;
        const verifyToken = jwt.verify(token,secretKey);
        if(!verifyToken){throw new Error('User Not Found')}
        const rootUser = await User.findOne({_id:verifyToken._id})
        req.rootUser = rootUser;
        req.token = token;
        next();
    }catch(error){
        resp.status(401).json({status:500,error:"Unauthorized no token provide"});
    }
}
module.exports = authenticate;