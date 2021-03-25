'use strict';

const passport = require('passport');

const localStrategy = require('./localStrategy');
const kakaoStrategy = require('./kakaoStrategy');
const { User } = require('../models');

module.exports = () => {
    passport.serializeUser((user, done) => {        // 매개변수를 user로 받아 req.session 에 user.id를 저장
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {        // 매 요청시 실행됨. passport.session() 미들웨어가 이 메서드를 호출. 조회한 정보를 req.user에 저장하므로 req.user를 통해 로그인한 사용자의 정보를 가져올 수 있음.
        User.findOne({
             where: { id },
             include: [{
                 model: User,
                 attributes: ['id', 'nick'],
                 as: 'Followers'
             }, {
                 model: User,
                 attributes: ['id', 'nick'],
                 as: 'Followings'
             }]
        })
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    localStrategy();
    kakaoStrategy();
}