module.exports = function mustBeAuthenticated(ctx, next) {
    if (!ctx.user) {
        ctx.throw(401, 'User must be logged in')
    }

    return next();
}
