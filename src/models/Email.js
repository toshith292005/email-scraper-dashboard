const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    source: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Email', emailSchema);