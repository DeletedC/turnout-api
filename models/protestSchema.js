const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const protestSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: false
    },
    category: {
        type: String,
        required: true,
        unique: false
    },
    date: {
        type: Date,
        required: true,
        unique: false
    },
    location: {
        type: String
    },
    images: [{
        type: Object,
        required: true
    }],
    attendees: [{
        category: String,
        user_id: String
    }]
}, {
    timestamps: true
});

const Protest = mongoose.model('Protest', protestSchema);
module.exports = Protest;