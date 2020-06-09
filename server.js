const mongoose = require("mongoose");
const path = require('path')
const axios = require("axios").default;
const express = require('express')
const app = express()
const PORT = process.env.PORT || 8000
const cors = require('cors');
require('dotenv').config()
const moment = require('moment')

//////////////////////////
// Globals
//////////////////////////
// List of urls our API will accept calls from
const whitelist = ['http://localhost:3000']

const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

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

app.use(cors(corsOptions)) // cors middlewear, configured by corsOptions
app.use(express.json())
app.use(express.static('build'))

//////////////////////////
// Routes
//////////////////////////

app.get('/', (req, res) => {
    res.send('Hello Turnout!')
})

//////////////////////////
// Show Route
//////////////////////////

app.get('/events/:id', async (req, res) => {
    try {
        const oneEvent = await Event.findById(req.params.id)
        res.status(200).json(oneEvent)
    } catch (error) {
        res.status(400).json(error)
    }
})


//////////////////////////
// Index Route
//////////////////////////

app.get('/events', async (req, res) => {
    try {
        const allEvents = await Event.find({})
        res.status(200).json(allEvents)
    } catch (error) {
        res.status(400).json(error)
    }
})
//////////////////////////
// Create Routes
//////////////////////////

app.post('/events', async (req, res) => {
    try {
        const newEvent = await Event.create({
            title: req.body.title,
            category: req.body.category,
            date: req.body.date,
            location: req.body.location,
            images: [{
                image: req.body.images
            }]
        }, (err, createdEvent) => {
            if (err){
                console.log(err);
            } else {
                res.status(200).json(createdEvent)
            }
        })
    } catch (error) {
        res.status(400).json(error)
    }
})

//////////////////////////
// Listener
//////////////////////////
app.listen(PORT, () => console.log("Listening on port:", PORT));