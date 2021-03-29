'use strict';

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const path = require('path');
const dotenv = require('dotenv');

const pageRouter = require('./routes/page');
const postRouter = require('./routes/post');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

dotenv.config();
const app = express();
sequelize.sync({force: false});
passportConfig();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8001);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false
    }
}));
app.use(passport.initialize());     // 요청 객체(req 객체)에 passport 설정들을 저장
app.use(passport.session());        // req.session에 passport에 대한 정보들을 저장
app.use(flash());

app.use('/', pageRouter);
app.use('/post', postRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
    const err = new Error('404 not found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번에서 대기중인 웹서버');
});