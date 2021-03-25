'use strict';

const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const { User } = require('../models');

module.exports = () => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_RESTAPI_KEY,
        callbackURL: '/auth/kakao/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let exUser = await User.findOne({ where: { snsId: profile.id, provider: 'kakao' } });
            if (exUser) {
                done(null, exUser);
            } else {
                const newUser = await User.create({
                    email: profile._json && profile._json.kakao_account_email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao'
                });
                done(null, newUser);
            }
        } catch (err) {
            console.error(err);
            done(err);
        }
    }));
};