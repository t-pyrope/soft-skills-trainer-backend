require('dotenv').config()

const uri = process.env.MONGO_URI;

module.exports = {
    mongodb: { uri },
    crypto: {
        iterations: 12000,
        length: 128,
        digest: 'sha512',
    }
}
