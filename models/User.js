const mongoose = require('mongoose');
const validator = require('validator'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        trim:true,
        required:true,
        min:3,
        max:20,
        unique:true
    },
    email:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email Format');
            }
        },
    },    
    password:{
        type:String,
        required:true,
    },
    isAvatarImageSet:{
        type:Boolean,
        default:false
    },
    avatarImage:{
        type:String,
        default:"",
    },
    tokens:[
        {token:{
            type:String,

        }}
    ],
    dateCreated:{
        type:Date,
        default:Date.now
    },
    dateUpdated:{
        type:Date,
        default:Date.now
    }
})

userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,12);
    }
    next();
})
userSchema.methods.generateAuthToken = async function(){
    try{
        let token_gen = await jwt.sign({_id:this._id},secretKey,{expiresIn:'2d'});
        this.tokens = this.tokens.concat({token:token_gen});
        await this.save();
        return token_gen;
    }catch(error){
         return error;
    }
    

}
module.exports = mongoose.model('user',userSchema);