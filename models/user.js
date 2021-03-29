'use strict';

const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {        // prototype 이 아닌 클래스 함수 자체에 메서드를 설정. 이를 정적(static) 메서드라고 함.
        return super.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true
            },
            provider: {
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'local'
            }
        }, {
            sequelize,
            timestamps: true,
            paranoid: true,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }

    static assoicate(db) {
        db.User.hasMany(db.Post);
        db.User.belongsToMany(db.User, {
            foreignKey: 'followingId',
            as: 'Followers',
            through: 'Follow'
        });
        db.User.belongsToMany(db.User, {
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow'
        });
    }
};