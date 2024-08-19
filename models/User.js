const mongoose = require('mongoose');
const crypto = require('crypto');
const connection = require('../libs/connection');
const config = require('../config');

const doneTaskSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    }
}, {_id : false});

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [
            {
                validator(value) {
                    return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
                },
                message: 'Email is not correct',
            },
        ]
    },
    displayName: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
    },
    salt: {
        type: String,
    },
    verificationToken: {
        type: String,
        index: true,
    },
    doneTasks: [doneTaskSchema],
    preferences: {
        showDone: {
            type: Boolean,
            required: true,
        },
    },
}, {
    timestamps: true,
})

function generatePassword (salt, password) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(
            password, salt,
            config.crypto.iterations,
            config.crypto.length,
            config.crypto.digest,
            (err, key) => {
                if (err) return reject(err);
                resolve(key.toString('hex'));
            }
        )
    })
}

function generateSalt() {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(config.crypto.length, (err, buffer) => {
            if (err) return reject(err);
            resolve(buffer.toString('hex'))
        })
    })
}

userSchema.methods.setPassword = async function setPassword(password) {
    this.salt = await generateSalt();
    this.passwordHash = await generatePassword(this.salt, password)
}

userSchema.methods.checkPassword = async function (password) {
    if (!password) return false;

    const hash = await generatePassword(this.salt, password);
    return hash === this.passwordHash;
}

module.exports = connection.model('User', userSchema);
