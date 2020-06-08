const mongoose = require("mongoose");
const path = require('path')
const axios = require("axios").default;
const express = require('express')
const app = express()
const PORT = process.env.PORT || 8000
const cors = require('cors');
require('dotenv').config()


//////////////////////////
// Globals
//////////////////////////
// List of urls our API will accept calls from
// const whitelist = ['http://localhost:3000']

// const corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
// };


//////////////////////////
// Database
//////////////////////////

const db = mongoose.connection
const MONGODB_URI =
    process.env.MONGODB_URL || 'mongodb://localhost:27017/turnout';

// Error / Disconnection
mongoose.connection.on('error', (err) =>
console.log(err.message + ' is Mongod not running?')
);
mongoose.connection.on('disconnected', () => console.log('mongo disconnected'));

//...farther down the page

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => {
console.log('connected to mongoose...');
});

//////////////////////////
// Models
//////////////////////////

const User = require('./models/userSchema.js')
const Event = require('./models/protestSchema.js')
//////////////////////////
// Middleware
//////////////////////////

// app.use(cors(corsOptions)) // cors middlewear, configured by corsOptions
app.use(express.json())
app.use(express.static('build'))

//////////////////////////
// Routes
//////////////////////////

app.get('/', (req, res) => {
    res.send('Hello Turnout!')
})

//////////////////////////
// Listener
//////////////////////////
app.listen(PORT, () => console.log("Listening on port:", PORT));