const mongoose = require('mongoose');
const connection = require('../libs/connection');

const categorySchema = new mongoose.Schema({
    title: {
        type: Map,
        of: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    }
})

module.exports = connection.model('Category', categorySchema)
