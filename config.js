require('dotenv').config()

const uri = process.env.MONGO_URI;

module.exports = {
    mongodb: { uri },
    crypto: {
        iterations: 12000,
        length: 128,
        digest: 'sha512',
    },
    providers: {
        facebook: {
            app_id: process.env.FACEBOOK_APP_ID || 'facebook_app_id',
            app_secret: process.env.FACEBOOK_APP_SECRET || 'facebook_app_secret',
            callback_uri: `${process.env.URI || 'http://localhost:3000/'}oauth/facebook`
        }
    },
    mailer: {
        user: process.env.MAILER_USER || '',
        password: process.env.MAILER_PASSWORD || '',
    },
}
