const passport = require('../libs/passport');

const Session = require('../models/Session');

module.exports.login = async function login (ctx, next){
    await passport.authenticate('local', async (err, user, info) => {
        if (err) throw err;

        if (!user) {
            ctx.status = 400;
            ctx.body = { error: info };
            return;
        }

        const token = await ctx.login(user)

        ctx.body = { token, user: { email: user.email, displayName: user.displayName } };
    })(ctx, next);
}

module.exports.logout = async function logout (ctx, next) {
    const header = ctx.request.get('Authorization');
    const token = header.split(' ')[1];

    await Session.findOneAndDelete({ token });

    ctx.body = { status: 'ok' }
}
