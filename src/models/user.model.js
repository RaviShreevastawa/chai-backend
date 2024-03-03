import mongoose, {Schema} from "mongoose";
import Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, //cloudnary url
            required: true,
        },
        coverImage: {
            type: String
        },
        watchHistory: {
            type: Schema.Types.ObjectId,
            ref : "Video"
        },
        Password: {
            type : String,
            required : [true, 'password is required']
        },
        refresToken: {
            type: String
        }
},
{
    timestamps: true
}
)


userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    this.Password = bcrypt.hash(this.Password, 10)
    next()
}) 

userSchema.methods.isPaswordCorrext = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return Jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }

    )
}
userSchema.methods.generateRefreshToken = function(){
    return Jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }

    )
}
export const User = mongoose.model("User", userSchema)
