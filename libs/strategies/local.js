const LocalStrategy = require('passport-local').Strategy;

const User = require('../../models/User');

module.exports = new LocalStrategy(
    { usernameField: 'email', session: false },
    async function (email, password, done) {
        const user = await User.findOne({ email });

        if (!user) {
            return done(null, false, 'No such user')
        }

        const isPasswordCorrect = await user.checkPassword(password);

        if (!isPasswordCorrect) {
            return done(null, false, 'Password is not correct')
        }

        done(null, user);
    }
)
