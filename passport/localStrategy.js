'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            let exUser = await User.findOne({ where: { email }});
            if (exUser) {
                let result = bcrypt.compare(password, exUser.password);
                if (result) {
                    done(null, exUser);
                } else {
                    done(null, false, { message: '비밀번호 불일치' });
                }
            } else {
                done(null, false, { message: '존재하지 않는 아이디' });
            }
        } catch (err) {
            console.error(err);
            done(err);
        }
    }));
}