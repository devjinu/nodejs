const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // 띄어쓰기 제거
        unique: 1 // 중복 방지
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number, // 관리자 -> 1
        default: 0 // 일반 회원 기본값
    },
    image: String,
    token: { // 유효성 관리
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function(next) {
    var user = this;
    if(user.isModified('password')) {

        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})
userSchema.method.comparePassword = function (plainPassword, cb){
    // plainPassword 1234567 암호화된 비밀번호
    bcrypt.compare(plainPassword,this.password,function (err, isMatch){
        if(err) return cb(crr);
        cb(null, isMatch);
    })
}
userSchema.methods.generateToken = function (cb){
    var user = this;

    // jsonwebToken을 이용해서 token생성
    var token = jwt.sign(user._id.toHexString(),'secretToken')
    // 'secretToken -> user._id

    user.token = token
    user.save(function (err,user){
        if(err) return cb(crr)
        cb(null, user)
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }