'use strict';

const express = require('express');

const { User, Post, Hashtag } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = req.user ? req.user.Followers.length : 0;
    res.locals.followingCount = req.user ? req.user.Followings.length : 0;
    res.locals.follwerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
    next();
});

router.get('/profile', isLoggedIn, (req, res, next) => {
    res.render('profile', {
         title: 'profile - nodebird', 
    });
});

router.get('/join', isNotLoggedIn, (req, res, next) => {
    res.render('join', { title: 'join - nodebird' });
});

router.get('/', async (req, res, next) => {
    try {
        let posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick']
            }
        });
        res.render('main', {
            title: 'main - nodebird',
            twits: posts
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/hashtag', async (req, res, next) => {
    const query = req.params.hashtag;
    if (!query) {
        res.redirect('/');
    }
    try {
        let hashtag = await Hashtag.findOne({ where: { title: query } });
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPosts({ include: { model: User } });
        }
        res.render('main', {
            title: 'main - nodebird',
            twits: posts
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;