'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const { User } = require('../models');
const { isNotLoggedIn, isLoggedIn } = require('./middlewares');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        let exUser = await User.findOne({ where: { email } });
        if (exUser) {
            req.flash('joinError', '아이디가 존재합니다.');
            res.redirect('/join');
        }
        let hashed_password = await bcrypt.hash(password, 10);
        User.create({
            email,
            nick,
            password: hashed_password
        });
        return res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/login', isNotLoggedIn, async (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            next(authError);
            return next(authError);
        }
        if (!user) {
            req.flash('loginError', info.message);
            return res.redirect('/');
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/');
});

module.exports = router;