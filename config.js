require('dotenv').config()

const uri = process.env.MONGO_URI;

module.exports = {
    mongodb: { uri }
}
