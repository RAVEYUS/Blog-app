const {Schema, model} = require('mongoose');
const { createHmac, randomBytes } = require('crypto');
const { createtokenforUser } = require('../services/auth');
const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: "/images/default.png",
    },
    role: {
        type: String,
        enum: ["USER","ADMIN"],
        default: "USER"
    },
},{ timestamps: true });

userSchema.pre('save',function (next) {
    const user = this;
    if(!user.isModified("password"))
    return; 

    const salt = randomBytes(16).toString();
    const hash = createHmac('sha256', salt).update(user.password).digest('hex');

    this.salt = salt;
    this.password = hash;

    next();
});

userSchema.static('matchPasswordandCreateToken', async function (email, password){
    const user = await this.findOne({email});
    if(!user) throw new Error('User Not Found!') ;

    const salt = user.salt;
    const hash = user.password;

    const userprovidedhash = createHmac('sha256', salt).update(password).digest('hex');
    if(hash!==userprovidedhash) throw new Error('Incorrect Password')

    const token = createtokenforUser(user);
    return token;
})

const User = model('user', userSchema);
module.exports = User;