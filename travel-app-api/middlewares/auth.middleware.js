const createError = require('http-errors');

module.exports.isAuthenticated = (req, res, next) => {
    if(!req.isAuthenticated()) {
        throw createError(403);
    } else {
        next();
    }
}

module.exports.isMe = (req, res, next) => {
    if(req.isAuthenticated() && req.user._id == req.params.id) {
        next();
    } else {
        throw createError(403, 'Insufficient privileges');
    }
}

module.exports.isOwner = (post) => {
    return (req, res, next) => {
    post.findById(req.params.id)
    .populate('user')
        .then(result => {
            if(!result) {
                throw createError(404, 'Element not found')
            } else {
                if(req.isAuthenticated() && req.user._id == result.user.id) {
                    next();
                } else {
                    throw createError(403, 'Insufficient privileges');
                }
            }
        })
        .catch(error => next(error));
    } 
}

