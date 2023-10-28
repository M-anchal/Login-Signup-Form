// const mongoose=require("mongoose")
const mongoose = require('mongoose');

const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs")
const path = require("path")
mongoose.connect("mongodb://127.0.0.1:27017/Registration")
.then(()=>console.log("connection successful"))
.catch((err)=>console.log(err));

const logInSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

})

// console.log(process.env.SECRET_KEY);
// middleware before sign up if you use instance then call methods
logInSchema.methods.generateAuthToken=async function(){
    try {
        
        const token=jwt.sign({_id:this._id.toString()},"mynameisanchalmishralookingforjob");
        this.tokens=this.tokens.concat({token:token})
       await this.save();
        return token;
    } catch (error) {
        res.send("the error part"+error);
        console.log("the error part"+error);
    }
}





// before save your password we need to hash or run a middleware pre
logInSchema.pre("save", async function(next){
    if(this.isModified("password")){
         console.log(`the current password is ${this.password}`);
        this.password=await bcrypt.hash(this.password,10);
       console.log(`the current password is ${this.password}`);
        // next means after running middleware next function run if you are not called hash it will loading again and again

    }
    next();
})




// create collection
const LogInCollection=new mongoose.model('LogInCollection',logInSchema)

module.exports=LogInCollection