'use strict';

const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            content: {
                type: Sequelize.STRING(140),
                allowNull: false
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            charset: 'utf8mb4',         // 이모티콘을 저장하려면 utf8mb4 를 사용해야함
            collate: 'utf8mb4_general_ci'
        });
    }

    static associate(db) {
        db.Post.belongsTo(db.User);
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
    }
};