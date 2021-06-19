const express = require('express') // express 모듈을 가져옴.
const app = express() // 새로운 express 앱을 만듦.
const port = 5000 // 포트 번호.
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key'); // MongoDB key value binding
const axios = require("axios");
axios.default.timeout = 5 * 1000;
const {User} = require("./models/User");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
// MongooseDB connection and exception git upload
mongoose.connect(config.mongoURI, {
    // mongoDB 기본 환경설정(안하면 에러발생)
    userNewUrlParser: true, useUnifiedToology: true, useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('mongoDB Connected...'))
    .catch(err => console.log(err))
app.get('/', (req, res) => res.send('Hello nodejs!'))
app.post('/register', (req, res) => {
    // 회원가입 할 떄 필요한 정보들을 client에서 가져오면 그것들을 DB에 넣어준다
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if (err) return status(200).json({success: true})
    })
})

app.post('/login', (req, res) => {
    console.log('ping')
    // 요청된 이메일 주소를 DB에서 검색
    User.findOne({email: req.body.email}, (err, user) => {
        console.log('user', user)
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "존재하지 않는 이메일 입니다."
            })
        }
        // 요청된 이메일이 DB에 존재하는 경우 비밀번호도 동일한지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({loginSuccess: false, message: "입력한 비밀번호가 다릅니다"})
            // 비밀번호가 일치하면 토큰생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                // token -> cookie&local storage stock
                res.cookie("X-auth", user.token)
                    .status(200)
                    .json({loginSuccess: true, userID: user._id})
            })
        })
    })
})

mongoose.connect('mongodb+srv://jason:12345@sample.9oiwe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('mongoDB Connected...'))
    .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello nodejs! heroku setting complete!'))

app.post('/register', (req, res) => {

    // 회원가입 할 때 필요한 정보들을 client에서 가져오면 그것들을 DB에 넣어준다.
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if (err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})
process.on("uncaughtException", function (err) {
    console.error("uncaughtException (Node is alive)", err);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))