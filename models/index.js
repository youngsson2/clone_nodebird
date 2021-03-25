'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user');
db.Post = require('./post');
db.Hashtag = require('./hashtag');

db.User.init(sequelize);
db.Post.init(sequelize);
db.Hashtag.init(sequelize);

db.User.assoicate(db);
db.Post.associate(db);
db.Hashtag.associate(db);

module.exports = db;