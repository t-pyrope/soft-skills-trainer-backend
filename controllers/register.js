const { v4: uuid } = require('uuid');
const pug = require('pug');
const path = require('path');

const User = require('../models/User');
const sendMail = require('../libs/sendMail');

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
        doneTasks: [],
        preferences: {
            showDone: true,
        },
    });

    await user.setPassword(password);
    await user.save();

    await sendMail({
        template: 'confirmation',
        locals: {
            href: `${process.env.URI}api/confirm/${verificationToken}`
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
        const html = pug.renderFile(
            path.join(__dirname, '../templates/outdatedLink.pug')
        )

        ctx.set('content-type', 'text/html');
        ctx.body = html;
    } else {
        const html = pug.renderFile(
            path.join(__dirname, '../templates/emailConfirmed.pug')
        )

        user.verificationToken = undefined;
        await user.save();

        ctx.set('content-type', 'text/html');
        ctx.body = html;
    }
}
