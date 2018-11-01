const User = require('../models/user.model');
const passport = require('passport');
const createError = require('http-errors');

module.exports.create = (req, res, next) => {
    passport.authenticate('local-auth', (error, user) => {
        if(error){
            next(error);
        } else {
            req.login(user, (error) => {
                if(error) {
                    next(error);
                } else {
                    res.status(201).json(user);
                }
            })
        }
    })(req, res, next);
}

module.exports.delete = (req, res, next) => {
    req.logout();
    res.status(204).json();
  }