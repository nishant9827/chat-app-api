const bcrypt = require('bcryptjs');
const User = require('../models/User');
exports.createUser = async(req,resp)=>{
    const {username,email,password} = req.body;
    if(!username || !email || !password){
        resp.json({msg:"All fields are required",status:false});
    }else{
        try{
        const usernameCheck = await User.findOne({username});
        if(usernameCheck){
          return resp.json({msg:'Username already used',status:false});
        }    
        const emailCheck = await User.findOne({email:email});
        
        if(emailCheck){
           return resp.json({msg:"This Email is already exists",status:false});
        }
            const finalUser = new User({
                username,email,password
            });
            const storeUser = await finalUser.save();
            const userWithoutPassword = { ...storeUser.toObject() };
            delete userWithoutPassword.password;
            resp.json({status:true,result:userWithoutPassword});
        }catch(error){
            resp.json({msg:error,status:false});
        }
    }
} 

exports.loginUser =async (req,resp)=>{
    const{username,password} = req.body;
    if(!username || !password){
        resp.json({msg:'All field are required',status:false});
    }else{
        try{
            const usernameCheck = await User.findOne({username});
            if(usernameCheck){
                const passwordCheck = await bcrypt.compare(password,usernameCheck.password);
                if(passwordCheck){
                    const token = await usernameCheck.generateAuthToken();
                    const result = {
                        token,usernameCheck
                    }
                    resp.cookie('userCookie',token,{
                        expires:new Date(Date.now()+900000),
                        httpOnly:true
                    })
                    resp.json({status:true,result});
                }else{
                    resp.json({msg:'Invalid Details',status:false})
                }
            }else{
                resp.json({msg:'User not found',status:false});
            }
        }catch(error){
            resp.json({msg:error,status:false});
        }
    }
}
exports.setAvatar = async(req,resp,next)=>{
    try{
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId,{
            isAvatarImageSet:true,
            avatarImage
        }, { new: true })
        console.log(userData)
        return resp.json({isSet:userData.isAvatarImageSet,image:userData.avatarImage})

    }catch(ex){
        next(ex);
    }
}

exports.getAllUsers = async(req,resp,next)=>{
    try{
        const userId = req.params.id;
        const users = await User.find({_id:{$ne:userId}}).select([
            "email","username","avatarImage","_id"
        ]);
        return resp.json(users);
    }catch(ex){
        next(ex);
    }
}

exports.logoutUser = async (req,resp)=>{
    try{
        req.rootUser.tokens = req.rootUser.tokens.filter((currEle)=>{
            return currEle!=req.token;
        })
        resp.clearCookie('userCookie',{path:'/'});
        req.rootUser.save();
        resp.status(200).json(req.rootUser.tokens);
    }catch(error){
        resp.status(500).json({status:500,error:"Server Error"});
    }

}