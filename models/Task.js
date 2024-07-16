const mongoose = require('mongoose');
const connection = require('../libs/connection');


const taskSchema = new mongoose.Schema({
    src: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    id: {
        type: String,
        required: true,
    }
})

module.exports = connection.model('Task', taskSchema)
