const userMapper = require("../mappers/user");

module.exports.me = async function me (ctx, next) {
    ctx.body = userMapper(ctx.user);
}
