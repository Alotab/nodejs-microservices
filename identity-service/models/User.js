const mongoose = require('mongoose');
const argon2 = require('argon2');
const { required } = require('joi');
const { unique } = require('underscore');


// Create the user model
const userSchema = new mongoose.Schema({
    username: {
        type : String,
        required :  true,
        unique : true,
        trim : true
    },
    email : {
        type : String,
        required :  true,
        unique : true,
        trim : true,
        lowercaser : true
    },
    password : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
},
{
    timestamps: true
}
);


// hash the password
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        try{
            this.password = await argon2.hash(this.password)
        }catch(error){
            return next(error)
        }
        
    }
});


// compare the password
userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        return await argon2.verify(this.password, candidatePassword)
    }catch(error){
        throw error
    }
};


// Indexings
userSchema.index({username : 'text'});

// saving the user model
const User = mongoose.model('User', userSchema);

// export
module.exports = User