'use strict';

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, Hashtag } = require('../models');

const router = express.Router();

const upload = multer({
    storage: multer.diskStorage({
        filename(req, file, callback) {
            const ext = path.extname(file.originalname);
            callback(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
        },
        destination(req, file, callback) {
            callback(null, 'uploads/');
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
});

const upload2 = multer();

fs.readdir('uploads', (err) => {
    if (err) {
        console.log('uploads 파일이 없으므로 업로드 파일을 만듬');
        fs.mkdirSync('uploads');
    }
});

router.post('/img', isLoggedIn, upload.single('img'), async (req, res, next) => {
    try {
        res.json({ url: `/img/${req.file.filename}` });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {    // upload.none() 은 모든 정보를 req.body로
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        if (hashtags) {
            const result = await Promise.all(
                hashtags.map((tag) => {
                    return Hashtag.findOrCreate({
                        where: { title: tag.slice(1).toLowerCase() }
                    });
                })
            );
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
});


module.exports = router;