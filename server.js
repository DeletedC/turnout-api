const mongoose = require("mongoose");
const path = require('path')
const axios = require("axios").default;
const express = require('express')
const app = express()
const PORT = process.env.PORT || 8000
const cors = require('cors');
require('dotenv').config()
const moment = require('moment')
const bcrypt = require('bcryptjs')


//////////////////////////
// Globals
//////////////////////////
// List of urls our API will accept calls from
const whitelist = ['http://localhost:3000', 'https://turnout-node-react.herokuapp.com/']

const corsOptions = (req, callback) => {
  let corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

//////////////////////////
// Database
//////////////////////////

const db = mongoose.connection
const MONGODB_URI =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/turnout';

// Error / Disconnection
mongoose.connection.on('error', (err) =>
console.log(err.message + ' is Mongod not running?')
);
mongoose.connection.on('disconnected', () => console.log('mongo disconnected'));

//...farther down the page

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true,  useCreateIndex: true});
mongoose.connection.once('open', () => {
console.log('connected to mongoose...');
});

//////////////////////////
// Models
//////////////////////////

const Event = require('./models/protestSchema.js')

//////////////////////////
// Controllers
//////////////////////////

const usersController = require('./controllers/usersController.js')

//////////////////////////
// Middleware
//////////////////////////

app.use(cors(corsOptions)) // cors middlewear, configured by corsOptions
app.use(express.json())
app.use(express.static('build'))


app.use('/users', usersController)
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
        let hour = req.body.hours < 10?'0' + req.body.hours: req.body.hours
        // console.log('hours fixed',hour);
        if(req.body.amOrPm === 'PM'){
            let PM = parseInt(hour) + 12
            const eventDate = await new Date(`${req.body.date}T${PM}:${req.body.minutes}:00`)
            console.log(eventDate);
            console.log("went at PM");
            const newEvent = await Event.create({
                title: req.body.title,
                category: req.body.category,
                date: eventDate,
                location: req.body.location,
                images: [{
                    image: req.body.images
                }]
            }, (err, createdEvent) => {
                if (err){
                    console.log(err);
                } else {
                    console.log(createdEvent);
                    res.status(200).json(createdEvent)
                }
            })
        } else {
            console.log("went at AM");
            const eventDate = await new Date(`${req.body.date}T${hour}:${req.body.minutes}:00`)
            console.log(eventDate);
            const newEvent = await Event.create({
                title: req.body.title,
                category: req.body.category,
                date: eventDate,
                location: req.body.location,
                images: [{
                    image: req.body.images
                }]
            }, (err, createdEvent) => {
                if (err){
                    console.log(err);
                } else {
                    console.log(createdEvent);
                    res.status(200).json(createdEvent)
                }
            })
        }
    } catch (error) {
        res.status(400).json(error)
    }
})

//////////////////////////
// Update Route
//////////////////////////

app.put('/events/:id', async (req, res) => {
   try {
       const editEvent = await Event.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        category: req.body.category,
        date: req.body.date,
        location: req.body.location,
        images: [{
            image: req.body.images
        }]
       }, (err, editedEvent) => {
           res.status(200).json(editedEvent)
       })
   } catch (error) {
     res.status(400).json(error)  
   }
})
//////////////////////////
// Delete Routes
//////////////////////////
app.delete('/events/:id', async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id)
        res.status(200).json(deletedEvent)
    } catch (error) {
        res.status(400).json(error)
    }
})

//////////////////////////
// Listener
//////////////////////////
app.listen(PORT, () => console.log("Listening on port:", PORT));