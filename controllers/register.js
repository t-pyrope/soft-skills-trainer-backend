const { v4: uuid } = require('uuid');

const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.registerTest = async function registerTest(ctx, next) {
    const testUsers = await User.find({ displayName: { $regex: /^testUser\d+$/ } });

    const nextName = `testUser${testUsers.length + 1}`;

    const user = new User({
        email: `${nextName}@mail.com`,
        displayName: nextName,
        password: nextName,
    });

    await user.setPassword(nextName);
    await user.save();

    ctx.body = { user: { email: user.email, displayName: user.displayName } }
}

module.exports.register = async function register(ctx, next) {
    const verificationToken = uuid();

    const { email, displayName, password } = ctx.request.body;

    const userWithEmail = await User.findOne({ email });

    if (userWithEmail) {
        ctx.status = 400;
        ctx.body = {
            errors: {
                email: 'Such email already exists'
            }
        };

        return;
    }

    const user = new User({
        email,
        displayName,
        verificationToken,
    });

    await user.setPassword(password);
    await user.save();

    await sendMail({
        template: 'confirmation',
        locals: {
            href: `${process.env.URI}confirm/${verificationToken}`
        },
        to: email,
        subject: 'Confirm the email'
    })

    ctx.body = { status: 'ok' }
}

module.exports.confirm = async function (ctx, next) {
    const { verificationToken } = ctx.params;

    const user = await User.findOne({ verificationToken });

    if (!user) {
        ctx.status = 400;
        ctx.body = {
            error: 'The link is not correct or outdated'
        }
    } else {
        user.verificationToken = undefined;
        await user.save();
        const token = await ctx.login(user);

        ctx.body = { token };
    }
}
