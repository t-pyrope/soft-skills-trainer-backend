const User = require('../../models/User');

module.exports = function authenticate(strategy, email, displayName, done) {
    if (!email) {
        return done(null, false, 'No email')
    }

    User.findOne({ email }, async (err, user) => {
        if (err) {
            done(err)
        }

        if (user) {
            return done(null, user);
        }

        try {
            const u = new User({
                email,
                displayName,
                doneTasks: [],
                preferences: {
                    showDone: true,
                },
            });

            await u.save();
            done(null, u);
        } catch (err) {
            done(err);
        }
    })
}
