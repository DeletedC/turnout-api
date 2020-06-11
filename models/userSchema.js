const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const accountSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
        unique: false
    },
    lastName: {
        type: String,
        required: true,
        unique: false
    },
    causes: [{
        category: String,
    }]
}, {
    timestamps: true
});

const Account = mongoose.model('Account', accountSchema);
module.exports = Account;