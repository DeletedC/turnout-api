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
        type: String,
        required: true,

    },
    images: [{
        type: Object,
        required: false,
        unique: false
    }],
    attendees: [{
        user_id: String
    }]
}, {
    timestamps: true
});

const Event = mongoose.model('Event', protestSchema);
module.exports = Event;

// will need to make date required