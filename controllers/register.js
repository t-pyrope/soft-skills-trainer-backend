const User = require('../models/User');

module.exports.registerTest = async function registerTest(ctx, next) {
    const testUsers = await User.find({ displayName: { $regex: /^testUser\d+$/ } });
    console.log('testUsers', testUsers)

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
